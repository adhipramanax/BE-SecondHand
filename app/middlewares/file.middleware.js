const responseFormatter = require('../helpers/responseFormatter');

const validateFile = (req, res, next) => {
  const exceptedFileType = ['png', 'jpg', 'jpeg'];
  console.log(req.files);
  if(!req.file){
    res.status(422).json(responseFormatter.error(null, 'Unggah minimal 1 gambar!', res.statusCode));
  }

  const fileExtension = req.file.mimetype.split('/').pop();
  if(exceptedFileType.includes(fileExtension)){
    res.status(400).json(responseFormatter.error(null, 'File tidak diterima, unggah file berupa png, jpg atau jpeg'));
  }

  next();
};

module.exports = validateFile;