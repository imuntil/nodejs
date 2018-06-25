const mongoose = require('mongoose')

const animeSchema = new mongoose.Schema({
  date: Date,
  name: {
    type: String,
    required: true
  },
  kantoku: String,
  maker: String
})

module.exports = mongoose.model('Anime', animeSchema)