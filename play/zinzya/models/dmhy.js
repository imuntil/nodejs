const mongoose = require('mongoose')
const { transformSize } = require('../utils/ct')

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
    type: String,
    required: true
  },
  real_size: Number,
  subtitle: String
})

dmhySchema.pre('save', function (next) {
  const { date, size, type } = this
  this.date = new Date(date)
  this.real_size = transformSize(size)
  this.category = type
  next()
})

module.exports = mongoose.model('Dmhy', dmhySchema)