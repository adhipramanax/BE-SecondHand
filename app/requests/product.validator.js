const { body } = require('express-validator')

module.exports ={ 
  createProduct: [
    body('name')
      .not().isEmpty().withMessage('Nama produk tidak boleh kosong'),
    body('price')
      .not().isEmpty().withMessage('Harga produk tidak boleh kosong'),
    body('description')
      .not().isEmpty().withMessage('Deskripsi produk tidak boleh kosong'),
  ]
}
