const { check } = require('express-validator')

module.exports = {
  register: [
    check('name')
      .not().isEmpty().withMessage('Nama tidak boleh kosong'),
    check('email')
      .not().isEmpty().withMessage('Email tidak boleh kosong')
      .bail()
      .isEmail().withMessage('Email tidak valid'),
    check('password')
      .not().isEmpty().withMessage('Password tidak boleh kosong')
      .bail()
      .isLength({ min: 6 }).withMessage('Password minimal 6 karakter')
  ],
  login: [
    check('email')
      .not().isEmpty().withMessage('Email tidak boleh kosong')
      .bail()
      .isEmail().withMessage('Email tidak valid'),
    check('password')
      .not().isEmpty().withMessage('Password tidak boleh kosong')
  ]
}


