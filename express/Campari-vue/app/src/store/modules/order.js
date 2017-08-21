/**
 * Created by 斌 on 2017/5/21.
 */
import { order } from '../../lib/services'
import * as type from '../../lib/constant'
// import _ from 'lodash'

export default {
  state: {
  },
  actions: {
    [type.PLACE_ORDER_A] (context, payload) {
      return order.placeOrder(payload.orders)
        .then(data => {
          console.log(data)
          if (payload.from) return
          let orders = payload.orders
          console.log(payload)
          let sku = null
          payload.isAll && (sku = -1)
          orders.sku.length === 1 && (sku = orders.sku[0].sku)
          if (orders.sku.length > 1) {
            sku = orders.sku
          }
          context.dispatch(type.CART_DELETE_ITEM_A, {
            item: {
              _id: payload._id,
              sku
            },
            lazy: true
          })
        })
    }
  }
}
