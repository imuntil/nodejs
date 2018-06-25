const mongoose = require('mongoose')

const animeSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  kantoku: String,
  maker: String,
  type: {
    type: String,
    enum: ['动画', '剧场版', 'OVA/OAD', '其他'],
    default: '动画'
  },
  adder: String,
  editor: String
})

module.exports = mongoose.model('Anime', animeSchema)