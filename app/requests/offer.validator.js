const { check } = require('express-validator');

module.exports = {
  create: [
    check('offer_price')
      .not().isEmpty().withMessage('Offer Price doesn\'t empty!'),
  ]
}