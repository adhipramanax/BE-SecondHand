const router = require('express').Router();

// Import the controllers or other
const historyTransactionController = require('../../../app/controllers/historyTransaction.controller');

const { authenticationController, offerController } = require('../../../app/controllers')
const { authJWT } = require('../../../app/middlewares')
const { register, login } = require('../../../app/requests/auth.validator')
const { create } = require('../../../app/requests/offer.validator')

// Implement the routes here
router.post('/auth/login', login, authenticationController.login);
router.post('/auth/register', register, authenticationController.register);

router.post('/offer', [ authJWT, create ], offerController.offerUser)
router.put('/offer/:id', [ authJWT ], offerController.updateStatus)

router.get('/offer/history', historyTransactionController.offerHistory)

module.exports = router;