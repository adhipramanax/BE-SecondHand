const authJWT = require('./authJWT');
const upload = require('./file-cloudinary.middleware');
const fileValidation = require('./file.middleware');

module.exports = {
  authJWT,
  upload,
  fileValidation
}