const express = require('express');

const router = express.Router();
const httpRouter = require('./http.route');

router.use('/page', httpRouter);

module.exports = router;
