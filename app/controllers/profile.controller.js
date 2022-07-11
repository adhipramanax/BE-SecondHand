require('dotenv').config()
<<<<<<< HEAD
const fs = require("fs");
const cloudinary = require("../config/cloudinary");
=======
>>>>>>> 2060b7c07f7328493e8440206e171a057b254c82
const { User } = require('../models')
const responseFormatter = require('../helpers/responseFormatter')

// get all user use class
class profilController {
<<<<<<< HEAD
  static async findUser(req, res) {
    try {
      const user = await User.findByPk(req.user.id)

      if (!user) {
        res.status(404).json(responseFormatter.error(null, 'User tidak ditemukan!', res.statusCode))
      }

      res.status(200).json(responseFormatter.success(user, 'User berhasil ditemukan!', res.statusCode))
=======
  static async getAll(req, res) {
    try {
      const user = await User.findAll()
      res.status(200).json(responseFormatter.success(user, 'User berhasil ditampilkan!', res.statusCode))
>>>>>>> 2060b7c07f7328493e8440206e171a057b254c82
    } catch (error) {
      res.status(500).json(responseFormatter.error(null, error.message, res.statusCode))
    }
  }

<<<<<<< HEAD
  static async update(req, res) {
    try {
      const user = await User.findByPk(req.params.id, {
        attributes: {
          exclude: ['password']
        }
      })

      if (!user) {
        res.status(404).json(responseFormatter.error(null, 'User tidak ditemukan!', res.statusCode))
      }

      // Delete image from cloudinary
      const public_id = user.url_photo.split('/').pop();
      cloudinary.delete(`Final-Project/Profile/${public_id.split('.')[0]}`)

      let url = '';
      const image = req.file;

      // upload profile gallery to cloudinary
      const uploader = async (path) => await cloudinary.uploads(path, 'Final-Project/Profile');

      const { path } = image;
      const newPath = await uploader(path)
      url = newPath.url
      fs.unlinkSync(path)
      
      const { name, city, address, phone_number } = req.body
      await User.update({
=======
  static async updateuser(req, res) {
    try {
      const user = await User.findOne({ where: { id: req.params.id } })
      if (!user) {
        res.status(404).json(responseFormatter.error(null, 'User tidak ditemukan!', res.statusCode))
      }
      const { name, city, address, phone_number, url_photo } = req.body
      const newUser = await User.update({
>>>>>>> 2060b7c07f7328493e8440206e171a057b254c82
        name,
        city,
        address,
        phone_number,
<<<<<<< HEAD
        url_photo: url,
        updatedAt: new Date()
      }, {
        where: { id: req.params.id }
      })

      res.status(200).json(responseFormatter.success(user, 'User berhasil diubah!', res.statusCode))
=======
        url_photo
      }, {
        where: { id: req.params.id }
      })
      res.status(200).json(responseFormatter.success(newUser, 'User berhasil diubah!', res.statusCode))
>>>>>>> 2060b7c07f7328493e8440206e171a057b254c82
    } catch (error) {
      res.status(500).json(responseFormatter.error(null, error.message, res.statusCode))
    }

  }
}

module.exports = profilController