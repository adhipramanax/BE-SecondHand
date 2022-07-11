require('dotenv').config()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')

const { User } = require('../models')
const responseFormatter = require('../helpers/responseFormatter')

class authenticationController {
  static async register(req, res) {
    try {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.status(422).json(responseFormatter.error(null, errors.array(), res.statusCode))
      }

      const { name, password } = req.body;
      const email = req.body.email.toLowerCase();
      const salt = process.env.SALT;
      const encryptedPassword = await bcrypt.hash(password + salt, 10);

      const user = await User.findOne({ where: { email } })

      if (user) {
        res.status(422).json(responseFormatter.error(null, 'Email sudah terdaftar!', res.statusCode))
        return;
      }

      const newUser = await User.create({
        name,
        email,
        password: encryptedPassword,
        createdAt: new Date(),
        updatedAt: new Date()
      })

      res.status(201).json(responseFormatter.success(newUser, 'User berhasil ditambahkan!', res.statusCode))
    } catch (error) {
      res.status(500).json(responseFormatter.error(null, error.message, res.statusCode))
    }
  }

  static async login(req, res) {
    try {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.status(422).json(responseFormatter.error(null, errors.array(), res.statusCode))
      }

      const { email, password } = req.body
      const clearEmail = email.toLowerCase()
      const salt = process.env.SALT

      const user = await User.findOne({ where: { email: clearEmail } })

      if (!user) {
        res.status(404).json(responseFormatter.error(null, 'User tidak ditemukan!', res.statusCode))
        return
      }

      const isMatch = await bcrypt.compare(password + salt, user.password)

      console.log(isMatch);

      if (!isMatch) {
        res.status(403).json(responseFormatter.error(null, 'Email dan Password tidak cocok!', res.statusCode))
        return;
      }

      const token = jwt.sign(
        {
          id: user.id,
          name: user.name,
          email: user.email,
          city: user.city,
          address: user.address,
          phone_number: user.phone_number,
          url_photo: user.url_photo
        },
        process.env.JWT_SIGNATURE_KEY)

      return res.status(200).json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      }, "Authenticated", res.statusCode)
    } catch (error) {
      res.status(500).json(responseFormatter.error(null, error.message, res.statusCode))
    }
  }
}

module.exports = authenticationController;