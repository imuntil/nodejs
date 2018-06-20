const mongoose = require('mongoose')

const liSchema = new mongoose.Schema({
  title: {
    required: true,
    type: String
  },
  link: {
    type: String
  },
  magnet: [String],
  img: {
    type: String
  }
})

const Li = mongoose.model('Li', liSchema)
module.exports = Li