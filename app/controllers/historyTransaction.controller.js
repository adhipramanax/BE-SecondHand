const { History, Offer, Product, Product_Gallery, Detail_Product, Category } = require('../models')
const responseFormatter = require('../helpers/responseFormatter')

class historyTransactionController{
  static async offerHistory(req, res){
    try {

      // const histories = await History.findAll({
      //   attributes: ['id'],
      //   where: {
      //     id_user: req.user.id
      //   },
      //   include: [{
      //     model: Offer,
      //     attributes: ['offer_price', 'offer_status', 'createdAt'],
      //     include: [{
      //       model: Product,
      //       attributes: ['name'],
      //       include: [{
      //         model: Product_Gallery,
      //         attributes: ['url_photo'],
      //       }]
      //     }]
      //   }]
      // })

      const histories = await History.findAll({
        where: {
          id_user: req.user.id
        },
      });

      const data = histories.map(async (history) => {
        const offer = await Offer.findOne({
          attributes: {
            exclude: ['createdAt', 'updatedAt']
          },
          where: {
            id: history.id_offer,
          }
        })

        const product = await Product.findOne({
          attributes: {
            exclude: ['createdAt', 'updatedAt']
          },
          where: {
            id: offer.id_product
          }
        })

        const galleries = await Product_Gallery.findAll({
          attributes: ["url_photo"],
          where: {
            id_product: product.id
          }
        });

        const productDetail = await Detail_Product.findAll({
          where: {
            id_product: product.id
          }
        });

        const categories = await Category.findAll({
          attributes: ["name"],
          where: {
            id: productDetail.map(detail => detail.id_category)
          }
        });

        return {
          id: history.id,
          offer,
          product,
          categories,
          galleries
        }
      })

      const result = await Promise.all(data)

      console.log(result);
  
      res.status(200).json(responseFormatter.success(result , "Riwayat penawaran berhasil ditemukan", res.statusCode))  
    } catch (error) {
      res.status(500).json(responseFormatter.error(error, error.message, res.statusCode))
    }
  }
}

module.exports = historyTransactionController