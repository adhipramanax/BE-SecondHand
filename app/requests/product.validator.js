const { Product } = require('../models')
const { check } = require('express-validator')

module.exports = [
    check('name')
      .not().isEmpty().withMessage('Nama produk tidak boleh kosong'),
    check('price')
      .not().isEmpty().withMessage('harga produk tidak boleh kosong'),
    check('description')
      .not().isEmpty().withMessage('deskripsi produk tidak boleh kosong'),
  ]
