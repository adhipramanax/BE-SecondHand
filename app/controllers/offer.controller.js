const { validationResult } = require('express-validator')

const { Offer, History, User } = require('../models'); 
const responseFormatter = require('../helpers/responseFormatter');
const { Sequelize } = require('sequelize');

class offerController{
  static offerUser = async (req, res) => {
    try {
      const errors = validationResult(req);

      if(!errors.isEmpty()){
        res.status(422).json(responseFormatter.error(null, errors.array(), res.statusCode));
        return;
      }

      const user = await User.findByPk(req.user.id);

      if(user.city === null || user.address === null || user.phone_number === null || user.url_photo === null){
        res.status(501).json(responseFormatter.error(null, "Lengkapi profile anda", res.statusCode));
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
          offer_status: null
        },
        attributes: ['id_user', [Sequelize.fn("max", Sequelize.col("id")), "id"]],
        group: ['id_user'],
      });

      const users = await User.findAll({
        where: {
          id: offer.map(item => item.id_user),
        },
        attributes: ['id', 'name', 'email', 'city', 'address', 'phone_number', 'url_photo'],
      });

      const result = users.map(async (user) => {
        return {
          ...user.dataValues,
          latestOfferPrice: await Offer.findOne({
            where: {
              id: offer.find(item => item.id_user === user.id).id,
            },
            attributes: ['offer_price'],
          }),
        }
      })

      res.status(200).json(responseFormatter.success(await Promise.all(result), "Data penawaran berhasil ditampilkan", res.statusCode));
    } catch (error) {
      res.status(500).json(responseFormatter.error(null, error.message, res.statusCode))
    }
  }
}

module.exports = offerController;