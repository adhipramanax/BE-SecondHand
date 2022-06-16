const router = require('express').Router();

// Import the controllers or other

const authenticationController = require('../../../app/controllers/authentication.controller');
const { authJWT } = require('../../../app/middlewares')
const { register, login } = require('../../../app/requests/auth.validator')
const { create } = require('../../../app/requests/offer.validator')
const { offerController } = require('../../../app/controllers')
const profilController = require('../../../app/controllers/profile.controller')

// Implement the routes here
router.post('/auth/login', login, authenticationController.login);
router.post('/auth/register', register, authenticationController.register);

router.post('/offer', [authJWT, create], offerController.offerUser)
router.put('/offer/:id', [authJWT], offerController.updateStatus)

//profil user
router.get('/profile', [authJWT], profilController.getAll)
router.put('/profile/:id', [authJWT], profilController.updateuser)


module.exports = router;