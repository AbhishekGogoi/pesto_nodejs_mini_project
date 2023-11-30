 const shortid = require('shortid');
// const crypto = require('crypto');
// const validator = require('validator');
const { validationResult } = require('express-validator');
const Url = require('../models/Url');
// const { nanoid } = require('nanoid');
const  utils  = require('../utils/urlValidator');

const shortenUrl = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { originalUrl } = req.body;
  const base = `http://localhost:5000`;

  const urlId = shortid.generate();
  if (utils.validateUrl(originalUrl)) {
    try {
      let url = await Url.findOne({ originalUrl });
      if (url) {
        res.json(url);
      } else {
        const shortUrl = `${base}/${urlId}`;

       const url = new Url({
          originalUrl,
          shortUrl,
          urlId,
          user: req.user.id,
        });

        await url.save();
        res.json(url);
      }
    } catch (err) {
      console.log(err);
      res.status(500).json('Server Error');
    }
  } else {
    res.status(400).json('Invalid Original Url');
  }
};

const redirectToOriginalUrl = async (req, res) => {
  try {
    const url = await Url.findOne({ urlId: req.params.urlId });

    if (url) {
      return res.redirect(url.originalUrl);
    } else {
      return res.status(404).json("Url not found");
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json("Server Error");
  }
};


const getUserUrls = async (req, res) => {
  try {
    const userUrls = await Url.find({ user: req.user.id });

    if (userUrls.length === 0) {
      return res.status(404).json({ msg: 'No URLs found for the user' });
    }

    res.json(userUrls);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

const updateUrl = async (req, res) => {
  const { id } = req.params;
  const { originalUrl } = req.body;

  try {
    let url = await Url.findById(id);

    if (!url) {
      return res.status(404).json({ msg: 'URL not found' });
    }

    url.originalUrl = originalUrl;

    await url.save();

    res.json(url);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

const deleteUrl = async (req, res) => {
  const { id } = req.params;

  try {
    let url = await Url.findById(id);

    if (!url) {
      return res.status(404).json({ msg: 'URL not found' });
    }

    await url.deleteOne();

    res.json({ msg: 'URL removed' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Server Error', error: error.message });
  }
};

module.exports = {
  shortenUrl,
  redirectToOriginalUrl,
  getUserUrls,
  updateUrl,
  deleteUrl,
};
