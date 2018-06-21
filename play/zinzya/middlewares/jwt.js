const jwtAuth = async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    if (~~err.status === 401) {
      ctx.status = 401
      ctx.body = {
        code: 401,
        message: 'Unauthorized'
      }
    } else {
      throw err
    }
  }
}

module.exports = jwtAuth