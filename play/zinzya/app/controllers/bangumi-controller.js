const Anime = require('../../models/bangumi')
const jwt = require('jsonwebtoken')
const pick = require('lodash.pick')
const {ApiError, ApiErrorNames} = require('../error/ApiError')
const {ct, PM, credentials, dmhy} = require('../../utils')
const idReg = ct.regs.objectId.reg

class BangumiController {
  /**
   * 获取番剧列表
   * GET
   * @param {ctx} ctx
   */
  static async getList(ctx) {
    console.log('获取番剧列表')
    let {year} = ctx.params
    if (!/^\d{4}$/.test(year)) {
      // throw new ApiError(ApiErrorNames.MISSING_OR_WRONG_PARAMETERS)
      year = (new Date()).getFullYear()
    }
    const bangumi = await Anime
      .find()
      .where('visible')
      .equals(true)
      .where('date')
      .gte(new Date(`${year}-01-01`))
      .lte(new Date(`${year}-12-31`))
      .sort('date')
      .select('-visible')
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
   * 搜索番剧
   * GET
   * /shizuku/bangumi/search?name=xx
   * @param {*} ctx
   */
  static async searchBGMs(ctx) {
    console.log('搜索番剧')
    const {name} = ctx.query
    if (!name || !name.trim()) {
      throw new ApiError.ApiErrorNames(MISSING_OR_WRONG_PARAMETERS)
    }
    const bs = await Anime
      .find({name: new RegExp(name)})
      .exec()
    ctx.body = {
      data: {
        count: bs.length,
        result: bs
      }
    }
  }

  /**
   * 获取时间范围
   * GET
   * /shizuku/bangumi/range
   * @param {*} ctx
   */
  static async getDateRange(ctx) {
    console.log('获取时间范围')
    const end = (new Date()).getFullYear()
    const data = []
    for (let i = 1990; i <= end; i++) {
      data.push(i)
    }
    ctx.body = {
      data
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
      ...ctx.request.body,
      adder: who.id
    })
    ctx.body = {
      data: bgm
    }
  }

  /**
   * 编辑番剧 pm >= lv4
   * PUT
   * /shizuku/bangumi/:bid
   * body = {name?, date?, kantoku?, maker?...}
   * @param {ctx} ctx
   */
  static async modifyBangumi(ctx) {
    console.log('编辑番剧')

    const {bid} = ctx.params
    const rest = pick(ctx.request.body, ['date', 'name', 'kantoku', 'maker', 'type'])
    if (!bid || !idReg.test(bid) || ct.isEmptyObj(rest)) {
      throw new ApiError(ApiErrorNames.MISSING_OR_WRONG_PARAMETERS)
    }
    const who = await ct.getCurrentUser(ctx)
    if (!who || who.auth < PM.LV4) {
      throw new ApiError(ApiErrorNames.PERMISSION_DENIED)
    }

    const bgm = await Anime
      .findById(bid)
      .exec()
    for (let [k,
      v]of Object.entries(rest)) {
      if (k === 'date' && isNaN(new Date(v))) {
        throw new ApiError(ApiErrorNames.MISSING_OR_WRONG_PARAMETERS)
      }
      bgm[k] = v
    }
    /* 更新编辑人员信息 */
    if (bgm.editor) {
      bgm
        .editor
        .unshift({uid: who.id, nick: who.nick})
      bgm.editor = bgm
        .editor
        .slice(0, 5)
    } else {
      bgm.editor = [
        {
          id: who.id,
          nick: who.nick
        }
      ]
    }
    await bgm.save()
    ctx.body = {}
  }

  /**
   * 删除番剧 pm >= lv5
   * DEL
   * /shizuku/bangumi/:bid
   * @param {ctx} ctx
   */
  static async deleteBangumi(ctx) {
    console.log('删除番剧（伪）')
    const bid = ctx.params.bid
    if (!bid || !idReg.test(bid)) {
      throw new ApiError(ApiErrorNames.WRONG_ID)
    }
    await Anime
      .findByIdAndUpdate(bid, {visible: false})
      .exec()
    ctx.body = {}
  }

  /**
   * 获取番剧详细，主要为下载磁链
   * GET
   * /shizuku/bangumi/detail?name={}
   * @param {*} ctx
   */
  static async fetchDetail(ctx) {
    console.log('获取番剧详细')
    const name = (ctx.query.name || '').trim()
    if (!name) {
      throw new ApiError(ApiErrorNames.MISSING_OR_WRONG_PARAMETERS)
    }
    await dmhy.crawlDmhy(name)
    ctx.body = {}
  }
}

module.exports = BangumiController