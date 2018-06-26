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
  visible: {
    type: Boolean,
    default: true
  },
  adder: mongoose.Schema.Types.ObjectId,
  editor: [{
    nick: String,
    uid: mongoose.Schema.Types.ObjectId
  }]
})

module.exports = mongoose.model('Anime', animeSchema)