const Anime = require('../../models/bangumi')
const {ApiError, ApiErrorNames} = require('../error/ApiError')

class BangmiController {
  static async getList(ctx) {
    console.log('获取番剧列表')
    let {year} = ctx.request.query
    if (!/^\d{4}$/.test(year)) {
      // throw new ApiError(ApiErrorNames.MISSING_OR_WRONG_PARAMETERS)
      year = (new Date()).getFullYear()
    }
    const bangumi = await Anime
      .find()
      .where('date')
      .gte(new Date(`${year}-01-01`))
      .lte(new Date(`${year}-12-31`))
      .sort('date')
      .lean()
      .exec();
    ctx.body = {
      data: {
        count: bangumi.length,
        year,
        result: bangumi
      }
    }
  }
}

module.exports = BangmiController