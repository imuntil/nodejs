const mongoose = require('mongoose')

const proxySchema = new mongoose.Schema({
  /* 代理地址 */
  server: {
    type: String,
    required: true,
    unique: true
  },
  /* 代理失败次数，达到一定数值将不再使用或删除 */
  failed: {
    type: Number,
    default: 0
  }
})

module.exports = mongoose.model('Proxy', proxySchema)