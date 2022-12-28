const express = require('express');
const router = express.Router();
const HttpController = require('../http/http.controller');
const httpController = new HttpController();

router.get('/', (req, res) => {
  res.send('http router');
});

module.exports = router;
