const Anime = require('../../models/bangumi')
const jwt = require('jsonwebtoken')
const {ApiError, ApiErrorNames} = require('../error/ApiError')
const {ct, PM, credentials} = require('../../utils')

class BangumiController {
  /**
   * 获取番剧列表
   * GET
   * @param {ctx} ctx
   */
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

  /**
   * 新增番剧 pm>= lv4
   * POST
   * body = {name, date, kantoku?, maker?}
   * @param {ctx} ctx
   */
  static async addBangumi(ctx) {
    console.log('新增番剧')
    let {name, date} = ctx.request.body
    date = new Date(date)
    if (!name || isNaN(date)) {
      throw new ApiError(ApiErrorNames.MISSING_OR_WRONG_PARAMETERS)
    }
    /* 没有权限 */
    const who = await ct.getCurrentUser(ctx)
    if (!who || who.auth < PM.LV4) {
      throw new ApiError(ApiErrorNames.PERMISSION_DENIED)
    }
    const bgm = await Anime.create({
      ...ctx.request.body
    })
    ctx.body = {
      data: bgm
    }
  }

  /**
   * 编辑番剧 pm >= lv4
   * PUT
   * body = {name, date, bid, kantoku?, maker?...}
   * @param {ctx} ctx
   */
  static async modifyBangumi(ctx) {
    console.log('编辑番剧')
    let {bid, ...rest} = ctx.request.body
    if (!bid || ct.isEmptyObj(rest)) {
      throw new ApiError(ApiErrorNames.MISSING_OR_WRONG_PARAMETERS)
    }
    const who = await ct.getCurrentUser(ctx)
    // jwt.verify(who.token, credentials.cookieSecret, (err, decoded) => {
    // console.log(err)   console.log(decoded) })
    if (!who || who.auth < PM.LV4) {
      throw new ApiError(ApiErrorNames.PERMISSION_DENIED)
    }
    const res = await Anime.findOneAndUpdate(
      { _id: bid },
      { ...rest }
    ).exec()
  }

  /**
   * 删除番剧 pm >= lv5
   * DEL
   * @param {ctx} ctx
   */
  static async deleteBangumi(ctx) {
    console.log('删除番剧（伪）')
  }
}

module.exports = BangumiController