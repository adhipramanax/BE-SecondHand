require('dotenv').config()
const fs = require("fs");
const cloudinary = require("../config/cloudinary");
const { User } = require('../models')
const responseFormatter = require('../helpers/responseFormatter')

// get all user use class
class profilController {
  static async findUser(req, res) {
    try {
      const user = await User.findByPk(req.user.id)

      if (!user) {
        res.status(404).json(responseFormatter.error(null, 'User tidak ditemukan!', res.statusCode))
        return
      }

      res.status(200).json(responseFormatter.success(user, 'User berhasil ditemukan!', res.statusCode))
    } catch (error) {
      res.status(500).json(responseFormatter.error(null, error.message, res.statusCode))
    }
  }

  static async update(req, res) {
    try {
      const user = await User.findByPk(req.params.id, {
        attributes: {
          exclude: ['password']
        }
      })

      if (!user) {
        res.status(404).json(responseFormatter.error(null, 'User tidak ditemukan!', res.statusCode))
        return
      }
      
      let url = '';
      const { name, city, address, phone_number } = req.body
      const image = req.file;

      if(image) {
        // Delete image from cloudinary
        if(user.url_photo !== null){
          const public_id = user.url_photo.split('/').pop();
          cloudinary.delete(`Final-Project/Profile/${public_id.split('.')[0]}`)
        }

        // upload profile gallery to cloudinary
        const uploader = async (path) => await cloudinary.uploads(path, 'Final-Project/Profile');

        const { path } = image;
        const newPath = await uploader(path)
        url = newPath.url
        fs.unlinkSync(path)
        
        await User.update({
          name,
          city,
          address,
          phone_number,
          url_photo: url,
          updatedAt: new Date()
        }, {
          where: { id: req.params.id }
        })
      }else{
        await User.update({
          name,
          city,
          address,
          phone_number,
          updatedAt: new Date()
        }, {
          where: { id: req.params.id }
        })
      }

      res.status(200).json(responseFormatter.success(user, 'User berhasil diubah!', res.statusCode))
    } catch (error) {
      res.status(500).json(responseFormatter.error(null, error.message, res.statusCode))
    }

  }
}

module.exports = profilController