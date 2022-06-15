const Product = require("../models").Product;
const ProductGallery = require("../models").Product_Gallery;
const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator')
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

class ProductController {
  // Create Product
  // Input: name, price, description, file_images
  static async createProduct(req, res) {
    try {
      const errors = validationResult(req)
      const { name, price, description } = req.body;

      if (!errors.isEmpty()) {
        return res.status(422).json({
          errors: errors.array()
        })
      }
      const file_images = req.files.file_images;
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
        id_user: 1,
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
    try {
      const { id } = req.params;
      const { name, price, description } = req.body;
      // validate name, price, description, url_image
      if (!name || !price || !description) {
        return res.status(400).json({
          message: "Please fill all required fields"
        });
      }
      const product = await Product.findOne({
        where: { id },
      });
      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }
      await product.update({
        name,
        price,
        description,
        updatedAt: new Date(),
      });
      return res.status(200).json({
        message: "Product updated successfully",
        product,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error",
        error,
      });
    }
  }
  // delete product
  static async deleteProduct(req, res) {
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
      await product.destroy();
      return res.status(200).json({
        message: "Product deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error",
        error,
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
