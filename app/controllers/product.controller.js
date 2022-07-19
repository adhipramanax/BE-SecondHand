const Sequelize = require("sequelize");
const fs = require("fs");
const cloudinary = require("../config/cloudinary");
const responseFormatter = require("../helpers/responseFormatter");
const { Product, Product_Gallery, Detail_Product, Category, User, Offer } = require("../models");
const Op = Sequelize.Op;

class ProductController {
  // Create Product
  static createProduct = async (req, res) => {
    try {
      const { name, price, description, categories } = req.body;
      const images = req.files;

      if (images.length === 0) {
        res.status(400).json(responseFormatter.error(null, "Unggah minimal satu gambar", res.statusCode));
        return;
      }

      if(images.length > 4){
        res.status(400).json(responseFormatter.error(null, "Maksimal gambar yang di unggah 4", res.statusCode));
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

      const product_id = product.id;

      // Create Detail Product
      const split_categories = categories.split(",");

      // Check if split_id_categorys is more than 5
      if (split_categories.length > 5) {
        res.status(400).json(responseFormatter.error(null, "Maksimal 5 kategori yang dipilih", res.statusCode));
        return;
      }

      // insert product category to detail product
      split_categories.forEach(async (id_category) => {
        await Detail_Product.create({
          id_product: product_id,
          id_category: parseInt(id_category),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });

      // // Upload to Cloudinary
      const uploader = async (path) => await cloudinary.uploads(path, 'Final-Project/Product');

      const urls = []

      for (const image of images) {
        const { path } = image;
        const newPath = await uploader(path)
        urls.push(newPath)
        fs.unlinkSync(path)
      }

      // Insert url image to product gallery
      await Product_Gallery.bulkCreate(
        urls.map((url) => ({
          url_photo: url.url,
          public_id: url.public_id,
          id_product: product_id,
          createdAt: new Date(),
          updatedAt: new Date(),
        }))
      );

      return res.status(201).json(responseFormatter.success(product, "Product created", res.statusCode));
    } catch (error) {
      return res.status(500).json(responseFormatter.error(null, error.message, res.statusCode));
    }
  };

  // update product
  static updateProduct = async (req, res) => {
    try {
      const { name, price, description, categories } = req.body;

      // Find product by id and check if user is owner of product
      const product = await this.getProductFromRequest(req)

      if (!product) {
        res.status(404).json(responseFormatter.error(null, "Product not found", res.statusCode));
        return;
      }

      // Check if user is owner of product
      if (product.id_user !== req.user.id) {
        res.status(403).send("You are not authorized to access this resource");
        return;
      }

      // update product
      await product.update({
        name,
        price,
        description,
        updatedAt: new Date(),
      });

      // Get id category for this product and delete all
      const detailProduct = await Detail_Product.findAll({
        where: { id_product: product.id },
      });

      detailProduct.forEach(async (id_category) => {
        await id_category.destroy();
      });

      // Create Detail Product
      const split_categories = categories.split(",");

      // Check if split_id_categorys is more than 5
      if (split_categories.length > 5) {
        res.status(400).json(responseFormatter.error(null, "Maksimal 5 kategori yang dipilih", res.statusCode));
        return;
      }

      split_categories.forEach(async (id_category) => {
        await Detail_Product.create({
          id_product: product.id,
          id_category: parseInt(id_category),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });

      // Get all product gallery by id product      
      const productGallery = await Product_Gallery.findAll({
        where: {
          id_product: product.id
        }
      })

      // Delete image from cloudinary
      productGallery.forEach(gallery => {
        cloudinary.delete(gallery.public_id)
      })

      // Delete Image form database
      productGallery.forEach(async gallery => {
        await gallery.destroy()
      })

      const urls = []
      const images = req.files;

      if (images.length === 0) {
        res.status(400).json(responseFormatter.error(null, "Unggah minimal satu gambar", res.statusCode));
        return;
      }

      if(images.length > 4){
        res.status(400).json(responseFormatter.error(null, "Maksimal gambar yang di unggah 4", res.statusCode));
        return;
      }

      // upload product gallery to cloudinary
      const uploader = async (path) => await cloudinary.uploads(path, 'Final-Project/Product');

      for (const image of images) {
        const { path } = image;
        const newPath = await uploader(path)
        urls.push(newPath)
        fs.unlinkSync(path)
      }

      // upload product gallery to database
      await Product_Gallery.bulkCreate(
        urls.map((url) => ({
          url_photo: url.url,
          public_id: url.public_id,
          id_product: product.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        }))
      );

      return res.status(200).json(responseFormatter.success(product, "Product updated successfully", res.statusCode));
    } catch (error) {
      return res.status(500).json(responseFormatter.error(null, error.message, res.statusCode));
    }
  };

  // get all product
  static getAllProduct = async (req, res) => {
    try {
      const products = await Product.findAll({
        where: {
          status_product: true,
          status_sell: false,
          deletedAt: null
        },
      });

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
        attributes: ["name", "city", "url_photo"],
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
          status_product: true,
          deletedAt: null
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
          status_product: true,
          deletedAt: null
        },
      });

      const result = await Promise.all(this.getProductDetails(products))

      return res.status(200).json(responseFormatter.success(result, "Product found", res.statusCode));
    } catch (error) {
      return res.status(500).json(responseFormatter.error(null, error.message, res.statusCode));
    }
  };

  // get product by status_product
  static getProductSeller = async (req, res) => {
    try {
      const products = await Product.findAll({
        where: {
          id_user: req.user.id,
          status_sell: false,
          deletedAt: null
        },
      });

      let result = await Promise.all(this.getProductDetails(products));

      return res.status(200).json(responseFormatter.success(result, "Product found", res.statusCode));
    } catch (error) {
      return res.status(500).json(responseFormatter.error(null, error.message, res.statusCode));
    }
  };

  static getSellerProductInTrash = async (req, res) => {
    try {
      const products = await Product.findAll({
        where: {
          id_user: req.user.id,
          deletedAt: {
            [Op.ne]: null
          }
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
          deletedAt: null
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
          id_product: req.params.id
        },
        include: [
          {
            model: User,
            attributes: ['name', 'city', 'url_photo']
          },
          {
            model: Product,
            where: {
              id_user: req.user.id,
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

      await Product.update({
        deletedAt: new Date()
      },{
        where:{
          id: product.id
        }
      });

      await Detail_Product.update({
        deletedAt: new Date()
      },{
        where:{
          id: product.id
        }
      });

      await Product_Gallery.update({
        deletedAt: new Date()
      },{
        where:{
          id: product.id
        }
      });

      return res.status(200).json(responseFormatter.success(product, "Product deleted successfully", res.statusCode));
    } catch (error) {
      return res.status(500).json(responseFormatter.error(null, error.message, res.statusCode));
    }
  };

  static restoreProduct = async (req, res) => {
    try {
      const { data } = req.body;

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

      await Product.update({
        deletedAt: data
      },{
        where:{
          id: product.id
        }
      });

      await Detail_Product.update({
        deletedAt: data
      },{
        where:{
          id: product.id
        }
      });

      await Product_Gallery.update({
        deletedAt: data
      },{
        where:{
          id: product.id
        }
      });

      return res.status(200).json(responseFormatter.success(product, "Product restored successfully", res.statusCode));
    } catch (error) {
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
