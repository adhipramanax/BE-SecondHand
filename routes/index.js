const router = require('express').Router();
const apiRouter = require('./api/v1');

router.use('/api/v1', apiRouter);

module.exports = router