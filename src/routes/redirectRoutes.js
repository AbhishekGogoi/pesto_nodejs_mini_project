const express = require('express');
const router = express.Router();
const urlController = require('../controllers/urlController');

// @route   GET /:shortUrl
// @desc    Redirect to the original URL
// @access  Public
router.get('/:urlId', urlController.redirectToOriginalUrl);

module.exports = router;