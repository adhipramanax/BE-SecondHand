const router = require('express').Router();

// Import the controllers or other
const historyTransactionController = require('../../../app/controllers/historyTransaction.controller');


// Implement the routes here
router.get('/', (req, res) => {
  res.send('Hello World!');
});

router.get('/offer-history', historyTransactionController.offerHistory)

module.exports = router;