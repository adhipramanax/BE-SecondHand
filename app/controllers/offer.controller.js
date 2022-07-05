const { validationResult } = require('express-validator')

const { Offer, History, User } = require('../models'); 
const responseFormatter = require('../helpers/responseFormatter');

class offerController{
  static offerUser = async (req, res) => {
    try {
      const errors = validationResult(req);

      if(!errors.isEmpty()){
        res.status(422).json(responseFormatter.error(null, errors.array(), res.statusCode));
        return;
      }
      
      const offer = await Offer.create({
        offer_price: req.body.offer_price,
        id_product: req.body.id_product,
        id_user: req.user.id,
      })

      await History.create({
        id_user: req.user.id,
        id_offer: offer.id
      })

      res.status(201).json(responseFormatter.success(offer, "Harga tawarmu berhasil dikirim ke penjual", res.statusCode));
    } catch (error) {
      res.status(500).json(responseFormatter.error(null, error.message, res.statusCode))
    }
  }

  static updateStatus = async (req, res) => {
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

  static showOfferProduct = async (req, res) => {
    try {
      const offer = await Offer.findAll({
        where: {
          id_product: req.params.id,
        },
      });

      const user = await User.findAll({
        where: {
          id: offer.map(offers => offers.id_user),
        },
      });

      res.status(200).json(responseFormatter.success(user, "Data penawaran berhasil ditampilkan", res.statusCode));
    } catch (error) {
      res.status(500).json(responseFormatter.error(null, error.message, res.statusCode))
    }
  }
}

module.exports = offerController;