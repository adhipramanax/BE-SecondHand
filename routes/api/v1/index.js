const router = require('express').Router();

// Import the controllers or other


// Implement the routes here
router.get('/', (req, res) => {
  res.send('Hello World!');
});

module.exports = router;