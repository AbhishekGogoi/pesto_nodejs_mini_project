const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  urlId: {
    type: String,
    required: true,
  },
  originalUrl: { type: String, required: true },
  shortUrl: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true},
});

module.exports = mongoose.model('Url', urlSchema);
