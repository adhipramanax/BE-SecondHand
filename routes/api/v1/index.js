const router = require('express').Router();

// Import the controllers or other

const authenticationController = require('../../../app/controllers/authentication.controller');
const { register, login } = require('../../../app/requests/auth.validator')
const { offerController } = require('../../../app/controllers')

// Implement the routes here
router.post('/auth/login', login, authenticationController.login);
router.post('/auth/register', register, authenticationController.register);

router.post('/offer', offerController.offerUser)
router.put('/offer/:id', offerController.updateStatus)

module.exports = router;