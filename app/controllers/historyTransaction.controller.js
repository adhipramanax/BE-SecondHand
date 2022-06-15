const { History, Offer, User, Product } = require('../models')
const responseFormatter = require('../helpers/responseFormatter')

class historyTransactionController{
  static async offerHistory(req, res){
    try {
      const histories = await History.findAll({
        include: [{
          model: User,

          where: {
            id: 1
          },
          attributes: { exclude: ['password'] }
        },{
          model: Offer,
          include: [{
            model: Product,
            attributes: ['name']
          }]
        }]
      })
  
      res.status(200).json(responseFormatter.success(histories, "Histories Found", res.statusCode))  
    } catch (error) {
      res.status(500).json(responseFormatter.error(error, error.message, res.statusCode))
    }
  }
}

module.exports = historyTransactionController