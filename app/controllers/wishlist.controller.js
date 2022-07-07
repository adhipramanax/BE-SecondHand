require("dotenv").config();
const { Whistlist } = require("../models");
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

      res.status(200).json(responseFormatter.success(wishlist, "Wishlist found", res.statusCode));
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
