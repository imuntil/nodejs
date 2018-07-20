const Li = require('../../models/li')
const {ct, PM} = require('../../utils')
const {ApiError, ApiErrorNames} = require('../error/ApiError')
const {forceRefresh} = require('../../utils/ruri')

class LiController {

  static getRange(size, totalPages, page, count) {
    let [skip, limit] = [0, size]
    if (+ page < totalPages) {
      skip = count - size * page
    } else {
      skip = 0
      limit = count % size
    }
    return [skip, limit]
  }

  static async getLis(ctx) {
    const who = await ct.getCurrentUser(ctx)
    if (!who || who.auth < PM.LV2) {
      throw new ApiError(ApiErrorNames.PERMISSION_DENIED)
    }
    const {
      page = 1,
      size = 10
    } = ctx.request.query

    if (!LiController.count) {
      LiController.count = await Li.count()
    }

    const count = LiController.count
    const totalPages = Math.ceil(count / size)

    const [skip, limit] = LiController.getRange(size, totalPages, page, count)

    const list = await Li
      .find()
      .skip(skip)
      .limit(limit)
      .lean()
      .exec()
    return {
      data: {
        total: count,
        totalPages,
        totalOfCurPage: list.length,
        currentPage: page,
        pageSize: size,
        result: list
      }
    }
  }

  /**
   * 获取li番列表
   * GET
   * /shizuku/li?page={}&size={}
   * @param {*} ctx
   * @param {*} next
   */
  static async getList(ctx, next) {
    console.log('获取ruri列表')
    const body = await LiController.getLis(ctx)
    ctx.body = body
  }

  static async forceRefresh(ctx) {
    console.log('强制更新Li')
    await forceRefresh()
    const list = await LiController.getLis(ctx)
    ctx.body = list
  }

  static async addLi(ctx, next) {
    console.log('新增Li')
    // const li = await Li.create({title: '111', link: '111', img: '111.png',
    // magnet: ['111']}) ctx.body = {   data: li.toObject() }
    ctx.body = {}
  }

  /**
   * 搜索
   * GET
   * /shizuku/li/search?page={}&size={}&keyword={}
   * @param {*} ctx
   * @param {*} next
   */
  static async searchLi(ctx, next) {
    console.log('搜索Li')
    const {
      keyword,
      size = 10,
      page = 1
    } = ctx.query
    if (size <= 0 || page <= 0) {
      throw new ApiError(ApiErrorNames.MISSING_OR_WRONG_PARAMETERS)
    }
    if (!keyword || !keyword.trim()) {
      const body = await LiController.getLis(ctx)
      ctx.body = body
      return
    }
    const title = new RegExp(keyword, 'i')
    const count = await Li
      .find({title})
      .count()
    const totalPages = await Math.ceil(count / size)
    const [skip, limit] = LiController.getRange(size, totalPages, page, count)
    const li = await Li
      .find({title})
      .skip(skip)
      .limit(limit)
      .lean()
      .exec()
    ctx.body = {
      data: {
        total: count,
        totalPages,
        totalOfCurPage: li.length,
        currentPage: page,
        pageSize: size,
        result: li
      }
    }
  }
}

LiController.count = 0

module.exports = LiController