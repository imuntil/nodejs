const Li = require('../../models/li')

class LiController {

  static async getList(ctx, next) {
    console.log('获取列表')
    const {
      page = 1,
      size = 10
    } = ctx.request.query
    if (!LiController.count) {
      LiController.count = await Li.count()
    }

    const count = LiController.count
    const totalPages = Math.ceil(count / size)

    let [skip,
      limit] = [0, size]
    if (+ page < totalPages) {
      skip = count - size * page
    } else {
      skip = 0
      limit = count % size
    }

    const list = await Li
      .find()
      .skip(skip)
      .limit(limit)
      .lean()
      .exec()
    ctx.body = {
      total: count,
      totalPages,
      totalOfCurPage: list.length,
      currentPage: page,
      pageSize: size,
      data: list
    }
  }
  static async addLi(ctx, next) {
    console.log('新增Li')
    const li = await Li.create({title: '111', link: '111', img: '111.png', magnet: ['111']})
    ctx.body = {
      data: li.toObject()
    }
  }
}

LiController.count = 0

module.exports = LiController