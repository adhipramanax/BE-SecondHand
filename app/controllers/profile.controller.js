require('dotenv').config()
const { User } = require('../models')
const responseFormatter = require('../helpers/responseFormatter')

// get all user use class
class profilController {
  static async findUser(req, res) {
    try {
      const user = await User.findByPk(req.params.id)

      if (!user) {
        res.status(404).json(responseFormatter.error(null, 'User tidak ditemukan!', res.statusCode))
      }

      res.status(200).json(responseFormatter.success(user, 'User berhasil ditemukan!', res.statusCode))
    } catch (error) {
      res.status(500).json(responseFormatter.error(null, error.message, res.statusCode))
    }

  }

  static async updateuser(req, res) {
    try {
      const user = await User.findByPk(req.params.id)
      if (!user) {
        res.status(404).json(responseFormatter.error(null, 'User tidak ditemukan!', res.statusCode))
      }
      const { name, city, address, phone_number, url_photo } = req.body
      const newUser = await User.update({
        name,
        city,
        address,
        phone_number,
        url_photo
      }, {
        where: { id: req.params.id }
      })
      res.status(200).json(responseFormatter.success(newUser, 'User berhasil diubah!', res.statusCode))
    } catch (error) {
      res.status(500).json(responseFormatter.error(null, error.message, res.statusCode))
    }

  }
}

module.exports = profilController