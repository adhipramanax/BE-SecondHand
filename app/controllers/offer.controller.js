const { validationResult } = require('express-validator')

const { Offer } = require('../models'); 
const responseFormatter = require('../helpers/responseFormatter');
const getUser = require('../helpers/getUser');

class offerController{
  static async offerUser(req, res){
    try {
      const errors = validationResult(req);

      if(!errors.isEmpty()){
        res.status(422).json(responseFormatter.error(null, errors.array(), res.statusCode));
        return;
      }

      const user = await getUser(req, res);

      console.log(user)
      
      const offer = await Offer.create({
        offer_price: req.body.offer_price,
        id_product: req.body.id_product,
        id_user: user.id,
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