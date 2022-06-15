const router = require('express').Router();

// Import the controllers or other
const { offerController } = require('../../../app/controllers')


// Implement the routes here
router.get('/', (req, res) => {
  res.send('Hello World!');
});

router.post('/offer', offerController.offerUser)
router.put('/offer/:id', offerController.updateStatus)

module.exports = router;