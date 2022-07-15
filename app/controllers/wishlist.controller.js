require("dotenv").config();
const { Whistlist, Product, Product_Gallery, Detail_Product, Category } = require("../models");
const responseFormatter = require("../helpers/responseFormatter");

//make get all wishlist by id user and id product using class
class WishlistController {
  static async getAllWishlist(req, res) {
    try {
      const wishlist = await Whistlist.findAll({
        where: {
          id_user: req.user.id,
        },
      });

      const data = wishlist.map(async (wishlist) => {
        const product = await Product.findAll({
          where: { id: wishlist.id_product },
          attributes: ["id", "name", "description", "price", "status_sell"],
        })

        const galleries = await Product_Gallery.findAll({
          where: { id_product: product.map(product => product.id) },
          attributes: ["url_photo"],
        });
  
        const product_detail = await Detail_Product.findAll({
          where: { id_product: product.map(product => product.id) },
        });
  
        const categories = await Category.findAll({
          where: { id: product_detail.map((detail) => detail.id_category) },
          attributes: ["name"],
        });
  
        return {
          id: wishlist.id,
          product,
          categories,
          galleries,
          createdAt: wishlist.createdAt,
          updatedAt: wishlist.updatedAt,
        };
      });

      const result = await Promise.all(data)

      res.status(200).json(responseFormatter.success(result, "Wishlist found", res.statusCode));
    } catch (error) {
      res.status(500).json(responseFormatter.error(null, error.message, res.statusCode));
    }
  }

  static async createWishlist(req, res) {
    try {
      const { id_product } = req.body;
      
      const wishlist = await Whistlist.findOne({
        where: {
          id_product
        }
      });

      if(wishlist) {
        return res.status(400).json(responseFormatter.error(null, "Product already in wishlist", res.statusCode));
      }
      
      const data = await Whistlist.create({
        id_user: req.user.id,
        id_product,
      });

      res.status(200).json(responseFormatter.success(data, "Wishlist created", res.statusCode));
    } catch (error) {
      res.status(500).json(responseFormatter.error(null, error.message, res.statusCode));
    }
  }
}

module.exports = WishlistController;
