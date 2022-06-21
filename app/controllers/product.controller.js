const { Product, Product_Gallery, Detail_Product, Category, User, Offer } = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const responseFormatter = require("../helpers/responseFormatter");

class ProductController {
  // Create Product
  static createProduct = async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.status(422).json(responseFormatter.error(null, errors.array(), res.statusCode));
        return;
      }

      const { name, price, description, id_categorys } = req.body;

      let file_images = req.files.file_images;

      // Check file_images is not an array
      if (!Array.isArray(file_images)) {
        file_images = [file_images];
      }

      if (!file_images) {
        res.status(400).json(responseFormatter.error(null, "Please upload at least one image", res.statusCode));
        return;
      }

      const product = await Product.create({
        name,
        price,
        description,
        status_product: true,
        status_sell: false,
        id_user: req.user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Upload to Cloudinary
      const images = [];
      for (let i = 0; i < file_images.length; i++) {
        const name = `${uuidv4()}-${product.name}-${i}-${file_images[i].name}`;
        file_images[i].mv(name);

        const output = await cloudinary.uploader.upload(name, {
          folder: "product",
          use_filename: true,
          unique_filename: true,
          overwrite: true,
        });

        // Delete file from local
        fs.unlinkSync(name);

        images.push(output.url);
      }

      const product_id = product.id;
      const product_gallery = await Product_Gallery.bulkCreate(
        images.map((image) => ({
          url_photo: image,
          id_product: product_id,
          createdAt: new Date(),
          updatedAt: new Date(),
        }))
      );

      // Create Detail Product
      const split_id_categorys = id_categorys.split(",");

      // Check if split_id_categorys is more than 5
      if (split_id_categorys.length > 5) {
        res.status(400).json(responseFormatter.error(null, "You can only choose 5 categorys", res.statusCode));
        return;
      }

      split_id_categorys.forEach(async (id_category) => {
        await Detail_Product.create({
          id_product: product_id,
          id_category: parseInt(id_category),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });
      return res
        .status(201)
        .json(responseFormatter.success({ product, product_gallery }, "Product created", res.statusCode));
    } catch (error) {
      console.log(error);
      return res.status(500).json(responseFormatter.error(null, error.message, res.statusCode));
    }
  };

  // update product
  static updateProduct = async (req, res) => {
    /*
      params = {
        id: 1,
      }

      body = {
        name: "string",
        price: 10000,
        description: "string",
        id_categorys: "1,2,3",
        images_deleted: "1,2",
        file_images: Form-Data Object // if not exist, dont upload image
      }
    */
    try {
      const { id } = req.params;
      const { name, price, description, id_categorys, images_deleted } = req.body;

      // Find product by id and check if user is owner of product
      const product = await Product.findOne({
        where: {
          id,
        },
      });

      if (!product) {
        res.status(404).json(responseFormatter.error(null, "Product not found", res.statusCode));
        return;
      }

      // Check if user is owner of product
      if (product.id_user !== req.user.id) {
        res.status(403).send("You are not authorized to access this resource");
        return;
      }

      // Get id categorys for this product and delete all
      const id_categorys_product = await Detail_Product.findAll({
        where: { id_product: product.id },
      });

      id_categorys_product.forEach(async (id_category) => {
        await id_category.destroy();
      });

      await product.update({
        name,
        price,
        description,
        updatedAt: new Date(),
      });

      // Create Detail Product
      const split_id_categorys = id_categorys.split(",");

      // Check if split_id_categorys is more than 5
      if (split_id_categorys.length > 5) {
        res.status(400).json(responseFormatter.error(null, "You can only choose 5 categorys", res.statusCode));
        return;
      }

      split_id_categorys.forEach(async (id_category) => {
        await Detail_Product.create({
          id_product: product.id,
          id_category: parseInt(id_category),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });

      // Check if user upload new images
      if (req.files !== null) {
        let file_images = req.files.file_images;

        // Check file_images is not an array
        if (!Array.isArray(file_images)) {
          file_images = [file_images];
        }

        const images = [];
        for (let i = 0; i < file_images.length; i++) {
          const name = `${uuidv4()}-${product.name}-${i}-${file_images[i].name}`;
          file_images[i].mv(name);

          const output = await cloudinary.uploader.upload(name, {
            folder: "product",
            use_filename: true,
            unique_filename: true,
            overwrite: true,
          });

          // Delete file from local
          fs.unlinkSync(name);

          images.push(output.url);
        }

        // Push to database for this product
        const product_gallery_new = await Product_Gallery.bulkCreate(
          images.map((image) => ({
            url_photo: image,
            id_product: product.id,
            createdAt: new Date(),
            updatedAt: new Date(),
          }))
        );
      }

      // Delete images from database based on images_deleted
      if (images_deleted) {
        const images_deleted_array = images_deleted.split(",");
        images_deleted_array.forEach(async (id_image) => {
          const image = await Product_Gallery.findOne({
            where: { id: id_image },
          });

          if (image && image.id_product === product.id) {
            console.log(`Delete image ${image.id}`);
            // await image.destroy();
          }
        });
      }

      return res.status(204).json(responseFormatter.success(product, "Product updated successfully", res.statusCode));
    } catch (error) {
      console.log(error);
      return res.status(500).json(responseFormatter.error(null, error.message, res.statusCode));
    }
  };

  // get all product
  static getAllProduct = async (req, res) => {
    try {
      const products = await Product.findAll();

      let result = await Promise.all(this.getProductDetails(products));

      return res.status(200).json(responseFormatter.success(result, "Product found", res.statusCode));
    } catch (error) {
      return res.status(500).json(responseFormatter.error(null, error.message, res.statusCode));
    }
  };

  // get product by id
  static getProductById = async (req, res) => {
    try {
      const product = await this.getProductFromRequest(req);

      const detailProduct = await Detail_Product.findAll({
        where: { id_product: product.id },
      });

      const categories = await Category.findAll({
        where: { id: detailProduct.map((detail) => detail.id_category) },
        attributes: ["name"],
      });

      const galleries = await Product_Gallery.findAll({
        attributes: ["url_photo"],
        where: {
          id_product: product.id,
        },
      });

      const seller = await User.findOne({
        attributes: ["name", "city"],
        where: {
          id: product.id_user,
        },
      });

      if (!product) {
        res.status(404).json(responseFormatter.error(null, "Product not found", res.statusCode));
        return;
      }

      return res.status(200).json(
        responseFormatter.success(
          {
            id: product.id,
            name: product.name,
            price: product.price,
            description: product.description,
            status_product: product.status_product,
            status_sell: product.status_sell,
            categories,
            galleries,
            seller,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
          },
          "Product found",
          res.statusCode
        )
      );
    } catch (error) {
      return res.status(500).json(responseFormatter.error(null, error.message, res.statusCode));
    }
  };

  // Search product by name
  static searchProductByName = async (req, res) => {
    try {
      const { name } = req.query;

      const products = await Product.findAll({
        where: {
          name: { [Op.iLike]: `%${name}%` },
        },
      });

      const result = await Promise.all(this.getProductDetails(products));

      return res.status(200).json(responseFormatter.success(result, "Product found", res.statusCode));
    } catch (error) {
      return res.status(500).json(responseFormatter.error(null, error.message, res.statusCode));
    }
  };

  // Filter by category
  static filterByCategory = async (req, res) => {
    try {
      let categories = req.query.categories.toLowerCase();

      const product_categories = await Detail_Product.findAll({
        include: [
          {
            model: Category,
            attributes: ["name"],
            where: {
              slug: { [Op.in]: categories.split(",") },
            },
          },
        ],
        attributes: ["id_product"],
      });

      const products = await Product.findAll({
        where: {
          id: {
            [Op.in]: product_categories.map((product) => product.id_product),
          },
        },
      });

      const result = await Promise.all(this.getProductDetails(products))

      return res.status(200).json(responseFormatter.success(result, "Product found", res.statusCode));
    } catch (error) {
      return res.status(500).json(responseFormatter.error(null, error.message, res.statusCode));
    }
  };

  // get product by status_product
  static getProductByStatus = async (req, res) => {
    try {
      const { status: status_product } = req.params;

      const products = await Product.findAll({
        where: {
          id_user: req.user.id,
          status_product,
        },
      });

      let result = await Promise.all(this.getProductDetails(products));

      return res.status(200).json(responseFormatter.success(result, "Product found", res.statusCode));
    } catch (error) {
      return res.status(500).json(responseFormatter.error(null, error.message, res.statusCode));
    }
  };

  static getProductSold = async (req, res) => {
    try {
      const products = await Product.findAll({
        where: {
          id_user: req.user.id,
          status_sell: true,
        },
      });

      let result = await Promise.all(this.getProductDetails(products));

      return res.status(200).json(responseFormatter.success(result, "Product found", res.statusCode));
    } catch (error) {
      return res.status(500).json(responseFormatter.error(null, error.message, res.statusCode));
    }
  }

  static getProductOffered = async (req, res) => {
    try {
      const productsUser = await Product.findAll({
        where: {
          id_user: req.user.id,
        },
      });

      const offer = await Offer.findAll({
        where: {
          id_product: {
            [Op.in]: productsUser.map((product) => product.id),
          },
        },
      });

      const products = await Product.findAll({
        where: {
          id: {
            [Op.in]: offer.map((offer) => offer.id_product),
          },
          status_sell: false
        },
      });

      const result = await Promise.all(this.getProductDetails(products))

      return res.status(200).json(responseFormatter.success(result, "Product found", res.statusCode));
    } catch (error) {
      return res.status(500).json(responseFormatter.error(null, error.message, res.statusCode));
    }
  };

  static getDetailProductOffered = async (req, res) => {
    try {
      const offer = await Offer.findAll({
        where: {
          id_user: req.params.id
        },
        include: [
          {
            model: User,
            attributes: ['name', 'city']
          },
          {
            model: Product,
            where: {
              status_sell: false
            },
            attributes: {exclude: ['id_user', 'createdAt', 'updatedAt']},
            include: [{
              model: Product_Gallery,
              attributes: ['url_photo']
            }]
          }
        ]
      });

      return res.status(200).json(responseFormatter.success(offer, "Product found", res.statusCode));
    } catch (error) {
      return res.status(500).json(responseFormatter.error(null, error.message, res.statusCode));
    }
  };

  // Update status product or status sell
  static updateStatusProduct = async (req, res) => {
    try {
      const product = await this.getProductFromRequest(req);

      if (!product) {
        res.status(404).json(responseFormatter.error(null, "Product not found", res.statusCode));
        return;
      }

      // Check if user is owner of product
      if (product.id_user !== req.user.id) {
        res
          .status(403)
          .json(responseFormatter.error(null, "You are not authorized to access this resource", res.statusCode));
        return;
      }

      // if status product exist
      if (req.body.status_product !== undefined) {
        await Product.update(
          {
            status_product: req.body.status_product,
            updatedAt: new Date(),
          },
          {
            where: {
              id: product.id,
            },
          }
        );
      }

      // is status sell exist
      if (req.body.status_sell !== undefined) {
        await Product.update(
          {
            status_sell: req.body.status_sell,
            updatedAt: new Date(),
          },
          {
            where: {
              id: product.id,
            },
          }
        );
      }

      return res.status(200).json(responseFormatter.success(product, "Product updated successfully", res.statusCode));
    } catch (error) {
      return res.status(500).json(responseFormatter.error(null, error.message, res.statusCode));
    }
  };

  // delete product by id
  static deleteProduct = async (req, res) => {
    try {
      const product = await this.getProductFromRequest(req);

      if (!product) {
        res.status(404).json(responseFormatter.error(null, "Product not found", res.statusCode));
        return;
      }

      // Check if user is owner of product
      if (product.id_user !== req.user.id) {
        res
          .status(403)
          .json(responseFormatter.error(null, "You are not authorized to access this resource", res.statusCode));
        return;
      }

      await Product.destroy({
        where: {
          id: product.id,
        },
      });

      return res.status(200).json(responseFormatter.success(product, "Product deleted successfully", res.statusCode));
    } catch (error) {
      console.log(error);
      return res.status(500).json(responseFormatter.error(null, error.message, res.statusCode));
    }
  };

  static getProductFromRequest(req) {
    return Product.findByPk(req.params.id);
  }

  static getProductDetails(products) {
    const data = products.map(async (product) => {
      const galleries = await Product_Gallery.findAll({
        where: { id_product: product.id },
        attributes: ["url_photo"],
      });

      const product_detail = await Detail_Product.findAll({
        where: { id_product: product.id },
      });

      const categories = await Category.findAll({
        where: { id: product_detail.map((detail) => detail.id_category) },
        attributes: ["name"],
      });

      return {
        id: product.id,
        name: product.name,
        price: product.price,
        description: product.description,
        status_product: product.status_product,
        status_sell: product.status_sell,
        categories,
        galleries,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      };
    });

    return data
  }
}

module.exports = ProductController;
