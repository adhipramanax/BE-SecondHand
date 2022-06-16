const Product = require("../models").Product;
const ProductGallery = require("../models").Product_Gallery;
const DetailProduct = require("../models").Detail_Product;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator')
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const responseFormatter = require('../helpers/responseFormatter');

class ProductController {
  // Create Product
  static async createProduct(req, res) {
    /*
      #swagger.tags = ['Product']
      #swagger.operationId = "create-product"
      #swagger.summary = "Create new product"
      #swagger.description = "This endpoint allows you to create a new product for your store"
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.requestBody = {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  example: "string",
                  required: true,
                },
                price: {
                  type: "number",
                  example: 10000,
                  required: true,
                },
                description: {
                  type: "string",
                  example: "string",
                  required: true,
                },
                id_categorys: {
                  type: "string",
                  example: "1,2,3",
                  required: true,
                },
                file_images: {
                  type: "file",
                  required: true,
                }
              }
            }
          }
        }
      }
    */
    try {
      const errors = validationResult(req)
      const { name, price, description, id_categorys } = req.body;

      if (!errors.isEmpty()) {
        return res.status(422).json(responseFormatter.error(null, errors.array(),res.statusCode));
      }

      let file_images = req.files.file_images;

      // Check file_images is not an array
      if (!Array.isArray(file_images)) {
        file_images = [file_images];
      }

      if (!file_images) {
        /*
          #swagger.response[400] = {
            description: "Bad Request",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Please upload file_images",
                    },
                  },
                },
              },
            },
          }
        */
        return res.status(400).json(responseFormatter.error(null, "Please upload at least one image",res.statusCode));
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
        /*
          #swagger.response[400] = {
            description: "Bad Request",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "You can only choose 5 categorys",
                    },
                  },
                },
              },
            },
          }
        */
        return res.status(400).json(responseFormatter.error(null, "You can only choose 5 categorys",res.statusCode));
      }

      split_id_categorys.forEach(async (id_category) => {
        await DetailProduct.create({
          id_product: product_id,
          id_category: parseInt(id_category),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });

      /*
        #swagger.responses[201] = {
          description: "Product created",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Product created",
                  },
                  product: {
                    type: "object",
                  },
                  product_gallery: {
                    type: "object",
                  },
                }
              }
            }
          }
        }
      */
      return res.status(201).json(responseFormatter.success({product,product_gallery}, "Product created",res.statusCode));
    } catch (error) {
      console.log(error);
      return res.status(500).json(responseFormatter.error(null, error.message,res.statusCode));
    }
  }

  // update product
  static async updateProduct(req, res) {
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
    /*
      #swagger.tags = ['Product']
      #swagger.operationId = "update-product"
      #swagger.summary = "Update product"
      #swagger.description = "This endpoint allows you to update a product"
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.requestBody = {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  example: "string",
                  required: true,
                },
                price: {
                  type: "number",
                  example: 10000,
                  required: true,
                },
                description: {
                  type: "string",
                  example: "string",
                  required: true,
                },
                id_categorys: {
                  type: "string",
                  example: "1,2,3",
                  required: true,
                },
                images_deleted: {
                  type: "string",
                  example: "1,2",
                  required: true,
                },
                file_images: {
                  type: "file",
                }
              }
            }
          }
        }
      }
      #swagger.parameters['id'] = {
        in: "path",
        name: "id",
        description: "Product ID",
        required: true,
        type: "integer",
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
        return res.status(404).json(responseFormatter.error(null, "Product not found",res.statusCode));
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
        return res.status(400).json(responseFormatter.error(null, "You can only choose 5 categorys",res.statusCode));
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
      /*
        #swagger.responses[204] = {
          description: "Product updated successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Product updated successfully",
                  },
                  product: {
                    type: "object",
                  }
                }
              }
            }
          }
        }
      */
      return res.status(204).json(responseFormatter.success(product, "Product updated successfully",res.statusCode));
    } catch (error) {
      console.log(error);
      return res.status(500).json(responseFormatter.error(null, error.message,res.statusCode));
    }
  }

  // get product by id
  static async getProductById(req, res) {
    /*
      #swagger.tags = ['Product']
      #swagger.operationId = "get-product-by-id"
      #swagger.summary = "Get product by id"
      #swagger.description = "This endpoint allows you to get a product by id"
      #swagger.parameters['id'] = {
        in: "path",
        name: "id",
        description: "Product ID",
        required: true,
        type: "integer",
      }
    */
    try {
      const { id } = req.params;
      const product = await Product.findOne({
        where: { id },
      });
      if (!product) {
        return res.status(404).json(responseFormatter.error(null, "Product not found",res.statusCode));
      }
      /*
        #swagger.responses[200] = {
          description: "Product found",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Product found",
                  },
                  product: {
                    type: "object",
                  }
                }
              }
            }
          }
        }
      */
      return res.status(200).json(responseFormatter.success(product, "Product found",res.statusCode));
    } catch (error) {
      return res.status(500).json(responseFormatter.error(null, error.message,res.statusCode)); 
    }
  }
  // get all product
  static async getAllProduct(req, res) {
    /*
      #swagger.tags = ['Product']
      #swagger.operationId = "get-all-product"
      #swagger.summary = "Get all product"
      #swagger.description = "This endpoint allows you to get all product"
    */
    try {
      const products = await Product.findAll();
      if (!products) {
        return res.status(404).json(responseFormatter.error(null, "Product not found",res.statusCode));
      }

      /*
        #swagger.responses[200] = {
          description: "Product found",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Product found",
                  },
                  products: {
                    type: "array",
                  }
                }
              }
            }
          }
        }
      */
      return res.status(200).json(responseFormatter.success(products, "Product found",res.statusCode));
    } catch (error) {
      return res.status(500).json(responseFormatter.error(null, "Internal server error",res.statusCode));
    }
  }

  // get product by status_product
  static async getProductByStatus(req, res) {
      
    /*
      #swagger.tags = ['Product']
      #swagger.operationId = "get-product-by-status"
      #swagger.summary = "Get product by status"
      #swagger.description = "This endpoint allows you to get a product by status"
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.parameters['status'] = {
        in: "path",
        name: "status",
        description: "Product status",
        example: 0,
        required: true,
        type: "integer",
      }
    */
    try {
      const { id_user, status: status_product } = req.query;
      const products = await Product.findAll({
        where: { 
          id_user,
          status_product 
        },
        include: [{ model: ProductGallery }]
      });

      if (!products) {
        return res.status(404).json(responseFormatter.error(null, "Product not found",res.statusCode));
      }

      /*
        #swagger.responses[200] = {
          description: "Product found",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Product found",
                  },
                  products: {
                    type: "array",
                  }
                }
              }
            }
          }
        }
      */
      return res.status(200).json(responseFormatter.success(products, "Product found",res.statusCode));
    } catch (error) {
      console.log(error);
      return res.status(500).json(responseFormatter.error(null, "Internal server error",res.statusCode));
    }
  }

  // update status_sell or status_product of product
  static async updateStatus(req, res) {

    /*
      #swagger.tags = ['Product']
      #swagger.operationId = "update-status"
      #swagger.summary = "Update status"
      #swagger.description = "This endpoint allows you to update status of product. Only change status_sell or status_product. If you want to change status_sell and status_product, it will change both status_sell and status_product"
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.parameters['id'] = {
        in: "path",
        name: "id",
        description: "Product ID",
        required: true,
        type: "integer",
      }
      #swagger.requestBody = {
        description: "Product status",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                status_sell: {
                  type: "integer",
                  example: true,
                },
                status_product: {
                  type: "integer",
                  example: false,
                }
              }
            }
          }
        }
      }
    */

    try {
      const { id } = req.params;
      let { status_sell, status_product } = req.body;

      // Check if status_sell or status_product is undefined
      if (status_sell === undefined && status_product === undefined) {
        return res.status(400).json(responseFormatter.error(null, "Status_sell or status_product is undefined",res.statusCode));
      }

      const product = await Product.findOne({
        where: { id },
      });

      if (!product) {
        return res.status(404).json(responseFormatter.error(null, "Product not found",res.statusCode));
      }

      // Check if status_sell or status_product is not undefined
      if (status_sell === undefined) {
        status_sell = product.status_sell;
      }

      if (status_product === undefined) {
        status_product = product.status_product;
      }

      // Check if user is owner of product
      if (product.id_user !== req.user.id) {  
        return res.status(403).send("You are not authorized to access this resource");
      }


      await product.update({
        status_sell,
        status_product,
        updatedAt: new Date(),
      });

      /*
        #swagger.responses[200] = {
          description: "Product updated",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Product updated",
                  },
                  product: {
                    type: "object",
                  }
                }
              }
            }
          }
        }
      */
      return res.status(200).json(responseFormatter.success(product, "Product updated successfully",res.statusCode));
    } catch (error) {
      console.log(error);
      return res.status(500).json(responseFormatter.error(null, "Internal server error",res.statusCode));
    }
  }

  // delete product by id
  static async deleteProduct(req, res) {
    /*
      #swagger.tags = ['Product']
      #swagger.operationId = "delete-product"
      #swagger.summary = "Delete product"
      #swagger.description = "This endpoint allows you to delete a product"
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.parameters['id'] = {
        in: "path",
        name: "id",
        description: "Product ID",
        required: true,
        type: "integer",
      }
    */
    try {
      const { id } = req.params;
      const product = await Product.findOne({
        where: { id },
      });

      if (!product) {
        return res.status(404).json(responseFormatter.error(null, "Product not found",res.statusCode));
      }

      // Check if user is owner of product
      if (product.id_user !== req.user.id) {
        return res.status(403).send("You are not authorized to access this resource");
      }

      await product.destroy();
      return res.status(200).json(responseFormatter.success(null, "Product deleted successfully",res.statusCode));

    } catch (error) {
      console.log(error);
      return res.status(500).json(responseFormatter.error(null, "Internal server error",res.statusCode));
    }
  }


  //////////////////////////////////////////////////// BUYER ////////////////////////////////////////////////////////

  // Search product by name
  static async searchProductByName(req, res) {
    /*
      #swagger.tags = ['Product']
      #swagger.operationId = "search-product-by-name"
      #swagger.summary = "Search product by name"
      #swagger.description = "This endpoint allows you to search product by name"
      #swagger.parameters['name'] = {
        in: "path",
        name: "name",
        description: "Product name",
        required: true,
        type: "string",
      }
      */
    try {
      const { name } = req.params;
      const products = await Product.findAll({
        where: { name: { [Op.iLike]: `%${name}%` } },
      });

      // Check if products is empty array
      if (products.length === 0) {
        return res.status(404).json(responseFormatter.error(null, "Product not found",res.statusCode));
      }

      /*
        #swagger.responses[200] = {
          description: "Product found",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Product found",
                  },
                  products: {
                    type: "array",
                  }
                }
              }
            }
          }
        }
      */
      return res.status(200).json(responseFormatter.success(products, "Product found",res.statusCode));
    } catch (error) {
      console.log(error);
      return res.status(500).json(responseFormatter.error(null, "Internal server error",res.statusCode));
    }
  }

  // Filter by category
  static async filterByCategory(req, res) {
    /*
      params = {
        categories: "1,2",
      }

      return all product with category in category
    */
   /*
      #swagger.tags = ['Product']
      #swagger.operationId = "filter-by-category"
      #swagger.summary = "Filter by category"
      #swagger.description = "This endpoint allows you to filter product by category"

      #swagger.parameters['categories'] = {
        in: "path",
        name: "categories",
        description: "Category ID",
        required: true,
        type: "string",
      }

      
   */

    try {
      const { categories } = req.params;

      const product_ids = await DetailProduct.findAll({
        attributes: ["id_product"],
        where: { id_category: { [Op.in]: categories.split(",") } },
      });

      const products = await Product.findAll({
        where: { id: { [Op.in]: product_ids.map((product) => product.id_product) } },
      });

      if (products.length === 0) {
        return res.status(404).json(responseFormatter.error(null, "Product not found",res.statusCode));
      }
      /*
      #swagger.responses[200] = {
        description: "Product found",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "Product found",
                },
                products: {
                  type: "array",
                }
              }
            }
          }
        }
      } 
      */
      return res.status(200).json(responseFormatter.success(products, "Product found",res.statusCode));

    } catch (error) {
      console.log(error);
      return res.status(500).json(responseFormatter.error(null, "Internal server error",res.statusCode));
    }
  }

}
module.exports = ProductController;
