require("dotenv").config();
const { notification, Product, Product_Gallery, Detail_Product, Category, Offer } = require("../models");
const responseFormatter = require("../helpers/responseFormatter");

//make get all wishlist by id user and id product using class
class NotificationController {
  static async getAllNotification(req, res) {
    try {
      const notif = await notification.findAll({
        where: {
          isRead: false,
          target: req.user.id
        },
      });

      const data = notif.map(async (item) => {
        let offer, product

        if(item.id_offer !== null){
          offer = await Offer.findAll({
            where: {
              id: item.id_offer
            }
          })

          product = await Product.findAll({
            where: { id: offer.map(item => item.id_product) },
            attributes: ["id", "name", "description", "price", "status_sell"],
          })
        }

        product = await Product.findAll({
          where: { id: item.id_product },
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
          id: item.id,
          message: item.message,
          offer,
          product,
          categories,
          galleries,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        };
      });

      const result = await Promise.all(data)

      res.status(200).json(responseFormatter.success(result, "notification found", res.statusCode));
    } catch (error) {
      res.status(500).json(responseFormatter.error(null, error.message, res.statusCode));
    }
  }
}

module.exports = NotificationController;
