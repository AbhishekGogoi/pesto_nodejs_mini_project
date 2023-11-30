const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');

// @route   POST /api/auth/register
// @desc    Register a user
// @access  Public
router.post(
  '/register',
  [
    check('username', 'Please enter a valid username').notEmpty(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  ],
  authController.registerUser
);

// @route   POST /api/auth/login
// @desc    Login a user
// @access  Public
router.post(
  '/login',
  [
    check('username', 'Please enter a valid username').notEmpty(),
    check('password', 'Password is required').exists(),
  ],
  authController.loginUser
);

module.exports = router;
