const { History, Offer, Product, Product_Gallery } = require('../models')
const responseFormatter = require('../helpers/responseFormatter')

class historyTransactionController{
  static async offerHistory(req, res){
    try {

      const histories = await History.findAll({
        attributes: ['id'],
        where: {
          id_user: req.params.id
        },
        include: [{
          model: Offer,
          attributes: ['offer_price', 'offer_status', 'createdAt'],
          include: [{
            model: Product,
            attributes: ['name'],
            include: [{
              model: Product_Gallery,
              attributes: ['url_photo'],
            }]
          }]
        }]
      })
  
      res.status(200).json(responseFormatter.success(histories , "Riwayat penawaran berhasil ditemukan", res.statusCode))  
    } catch (error) {
      res.status(500).json(responseFormatter.error(error, error.message, res.statusCode))
    }
  }
}

module.exports = historyTransactionController