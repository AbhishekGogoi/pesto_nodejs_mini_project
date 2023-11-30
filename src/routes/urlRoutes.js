const express = require('express');
const router = express.Router();
const urlController = require('../controllers/urlController');
const authenticate = require('../middleware/authMiddleware');

// @route   POST /api/url/shorten
// @desc    Shorten a URL
// @access  Private
router.post('/shorten', authenticate, urlController.shortenUrl);

// @route   GET /api/url/manage
// @desc    Get user's shortened URLs
// @access  Private
router.get('/manage', authenticate, urlController.getUserUrls);

// @route   PUT /api/url/:id
// @desc    Update a shortened URL
// @access  Private
router.put('/:id', authenticate, urlController.updateUrl);

// @route   DELETE /api/url/:id
// @desc    Delete a shortened URL
// @access  Private
router.delete('/:id', authenticate, urlController.deleteUrl);



module.exports = router;