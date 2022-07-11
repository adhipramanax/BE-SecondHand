const { History, Offer, Product, Product_Gallery, Detail_Product, Category } = require('../models')
const responseFormatter = require('../helpers/responseFormatter')

class historyTransactionController{
  static async offerHistory(req, res){
    try {

      const { id_product, order = false } = req.query;
      let histories = null
      
      if(order){
        histories = await History.findAll({
          order: [
            ['id', 'DESC']
          ],
          where: {
            id_user: req.user.id
          },
        });
      }else{
        histories = await History.findAll({
          where: {
            id_user: req.user.id
          },
        });
      }

      const data = histories.map(async (history) => {
        let offer = null

        if(id_product){
          offer = await Offer.findOne({
            attributes: {
              exclude: ['createdAt', 'updatedAt']
            },
            where: {
              id: history.id_offer,
              id_product: id_product
            }
          })
        }else{
          offer = await Offer.findOne({
            attributes: {
              exclude: ['createdAt', 'updatedAt']
            },
            where: {
              id: history.id_offer
            }
          })
        }

        if(offer){
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
        }else{
          return false
        }

      })

      const result = await Promise.all(data)

      if(!result[0]){
        res.status(404).json(responseFormatter.error(null , "Riwayat penawaran tidak ditemukan", res.statusCode))
        return
      }
  
      res.status(200).json(responseFormatter.success(result , "Riwayat penawaran berhasil ditemukan", res.statusCode))  
    } catch (error) {
      res.status(500).json(responseFormatter.error(error, error.message, res.statusCode))
    }
  }
}

module.exports = historyTransactionController