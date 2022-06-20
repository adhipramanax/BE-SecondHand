const { check } = require('express-validator')

module.exports = [
  check('name')
    .not().isEmpty().withMessage('Nama produk tidak boleh kosong'),
  check('price')
    .not().isEmpty().withMessage('Harga produk tidak boleh kosong'),
  check('description')
    .not().isEmpty().withMessage('Deskripsi produk tidak boleh kosong'),
]
