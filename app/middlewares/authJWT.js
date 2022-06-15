require('dotenv').config();
const jwt = require('jsonwebtoken');

const authJWT = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (authHeader){
    const token = authHeader.split(' ')[1];
    const secretKey = process.env.SECRET_KEY;
    jwt.verify(token, secretKey, (err, user) => {
      if(err){
        return res.status(403).json({
          message: err.message
        })
      }

      req.user = user
      next();
    })
  }else{
    res.sendStatus(401)
  }
}

module.exports = authJWT;
