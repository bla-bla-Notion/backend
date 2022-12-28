const express = require('express');
const router = express.Router();
const httpRouter = require('./http.route');
// const socketRouter = require('./socket.route');

router.use('/api/page', httpRouter);
// router.use(socketRouter);

module.exports = router;
