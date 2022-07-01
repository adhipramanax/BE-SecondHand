require('dotenv').config()
const { Wishlist } = require('../models/whislist');
const responseFormatter = require('../helpers/responseFormatter')
//make get all wishlist by id user and id product using class
class WishlistController {
    static async getAllWishlist(req, res) {
        try {
            const { id } = req.params;
            const wishlist = await Wishlist.findAll({
                where: {
                    userId: id
                }
            });
            if (wishlist.length === 0) {
                return responseFormatter.error(res, 'Wishlist not found', 404);
            }
            return responseFormatter.success(res, 'Wishlist found', 200, wishlist);
        } catch (error) {
            return responseFormatter.error(res, error.message, 500);
        }
    }

    static async createWishlist(req, res) {
        try {
            const { id } = req.params;
            const { productId } = req.body;
            const wishlist = await Wishlist.create({
                userId: id,
                productId: productId
            });
            return responseFormatter.success(res, 'Wishlist created', 200, wishlist);
        } catch (error) {
            return responseFormatter.error(res, error.message, 500);
        }
    }
}

module.exports = WishlistController;






