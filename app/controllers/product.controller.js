const Product = require("../models").Product;
const ProductGallery = require("../models").Product_Gallery;
const DetailProduct = require("../models").Detail_Product;
const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator')
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

class ProductController {
  // Create Product
  static async createProduct(req, res) {
    /* body = {
      name: "string",
      price: 10000,
      description: "string",
      id_categorys: "1,2,3",
      file_images: Form-Data Object
    } */
    try {
      const errors = validationResult(req)
      const { name, price, description, id_categorys } = req.body;

      if (!errors.isEmpty()) {
        return res.status(422).json({
          errors: errors.array()
        })
      }
      let file_images = req.files.file_images;

      // Check file_images is not an array
      if (!Array.isArray(file_images)) {
        file_images = [file_images];
      }

      if (!file_images) {
        return res.status(400).json({
          message: "Please upload at least one image"
        });
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
      const product_gallery = await ProductGallery.bulkCreate(
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
        return res.status(400).json({
          message: "You can only choose 5 categorys"
        });
      }

      split_id_categorys.forEach(async (id_category) => {
        await DetailProduct.create({
          id_product: product_id,
          id_category: parseInt(id_category),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });

      return res.status(201).json({
        message: "Product created successfully",
        product,
        product_gallery,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  // update product
  static async updateProduct(req, res) {
    /*
      query = {
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
          id
        },
      });

      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      // Check if user is owner of product
      if (product.id_user !== req.user.id) {
        return res.status(403).send("You are not authorized to access this resource");
      }

      // Get id categorys for this product and delete all
      const id_categorys_product = await DetailProduct.findAll({
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
        return res.status(400).json({
          message: "You can only choose 5 categorys"
        });
      }

      split_id_categorys.forEach(async (id_category) => {
        await DetailProduct.create({
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
        const product_gallery_new = await ProductGallery.bulkCreate(
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
          const image = await ProductGallery.findOne({
            where: { id: id_image },
          });

          if (image && image.id_product === product.id) {
            console.log(`Delete image ${image.id}`);
            // await image.destroy();
          }
        });
      }
      return res.status(204).json({
        message: "Product updated successfully",
        product,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }


  // get product by id
  static async getProductById(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.findOne({
        where: { id },
      });
      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }
      return res.status(200).json({
        message: "Product found",
        product,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error",
        error,
      });
    }
  }
  // get all product
  static async getAllProduct(req, res) {
    try {
      const products = await Product.findAll();
      if (!products) {
        return res.status(404).json({
          message: "Product not found",
        });
      }
      return res.status(200).json({
        message: "Product found",
        products,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error",
        error,
      });
    }
  }


}
module.exports = ProductController;
