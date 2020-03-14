
const express = require('express');
let router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'Express-Mongo-Redis API' });
});

module.exports = router;
