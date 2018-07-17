const mongoose = require('mongoose')

const dmhySchema = new mongoose.Schema({
  date: String,
  type: String,
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
  subtitle: String,
  real_size: Number,
  real_date: Date
})

// dmhySchema.pre('save', function (next) {
//   const { date, size, type } = this
//   this.date = new Date(date)
//   this.real_size = transformSize(size)
//   this.category = type
//   next()
// })

module.exports = mongoose.model('Dmhy', dmhySchema)