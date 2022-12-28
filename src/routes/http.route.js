const express = require('express');

const router = express.Router();
const HttpController = require('../http/http.controller');

const httpController = new HttpController();

router.get('/', httpController.pageList);
router.get('/:pageId', httpController.getDetailPage);

module.exports = router;
