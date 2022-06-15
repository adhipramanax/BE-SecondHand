const { validationResult } = require('express-validator')

const { Offer } = require('../models'); 
const { responseFormatter } = require('../helpers');

class offerController{
  static async offerUser(req, res){
    try {
      const errors = validationResult(req);

      if(!errors.isEmpty()){
        res.status(422).json(responseFormatter.error(null, errors.array(), res.statusCode));
        return;
      }
      
      const offer = await Offer.create({
        offer_price: req.body.offer_price,
        id_user: req.user.id,
        id_product: req.body.id_product,
      })

      res.status(201).json(responseFormatter.success(offer, "Harga tawarmu berhasil dikirim ke penjual", res.statusCode));
    } catch (error) {
      res.status(500).json(responseFormatter.error(null, error.message, res.statusCode))
    }
  }

  static async updateStatus(req, res){
    try {
      const offer = await Offer.update({
        offer_status: req.body.offer_status,
      }, {
        where: {
          id: req.params.id,
        }
      })

      res.status(200).json(responseFormatter.success(offer, "Status penawaran berhasil diubah", res.statusCode));
    } catch (error) {
      res.status(500).json(responseFormatter.error(null, error.message, res.statusCode))
    }
  }
}

module.exports = offerController;