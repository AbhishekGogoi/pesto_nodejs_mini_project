const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const generateToken = require('../config/jwt');

const registerUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  try {
    let user = await User.findOne({ username });

    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({
      username,
      password,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // Token is not generated during user registration
    res.json({ msg: 'User registered successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

const loginUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  try {
    let user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const token = generateToken(user);

    res.json({ token });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  registerUser,
  loginUser,
};
