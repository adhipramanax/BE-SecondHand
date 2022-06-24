const router = require('express').Router();

// Import the controllers or other
const authenticationController = require('../../../app/controllers/authentication.controller');
const { register, login } = require('../../../app/requests/auth.validator')
const profilController = require('../../../app/controllers/profile.controller');



// Implement the routes here
router.post('/auth/login', login, authenticationController.login);
router.post('/auth/register', register, authenticationController.register);
router.delete('/auth/logout', authenticationController.logout);



// profil user 
router.put('/profile/:id', profilController.updateuser);

module.exports = router;