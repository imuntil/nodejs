const mongoose = require('mongoose')

const dmhySchema = new mongoose.Schema({
  date: Date,
  category: String,
  title: {
    type: String,
    required: true
  },
  magnet: {
    type: String,
    required: true
  },
  size: {
    size: Number,
    required: true
  }
})

module.exports = mongoose.model('Dmhy', dmhySchema)