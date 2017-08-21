/**
 * Created by 斌 on 2017/3/31.
 */
export const AJAX_RESPONSE_CODE = 'code'
export const AJAX_RESPONSE_RESULT = 'result'
export const AJAX_RESPONSE_MSG = 'msg'

export const THE_USER_KEY = 'Use2HFY7201nmjf871lOD-20nmq1EFCM'
export const THE_ADDRESS_KEY = 'AddRessJFUHS67210JVX7FEHJua19CJ9G7Bciqk'
export const THE_CART_KEY = 'DJFUj7F5dig1FI829sy167YWU287surfT'

//  address
//  从服务器拉取address
export const ADR_FETCH_ADDRESSES_A = 'address/fetch-adrs-a'
//  将fetch的数据同步本地address
export const ADR_SET_ADRS_M = 'address/set-adrs-m'
//  增加地址
export const ADR_ADD_ADDRESS_A = 'address/add-adr-a'
//  更新本地地址库
export const ADR_UPDATE_ADRS = 'address/adr-update-adrs'
//  删除地址
export const ADR_DELETE_ADDRESS_A = 'address/deleteAdr-A'
//  更新地址(编辑地址)
export const ADR_UPDATE_ADDRESS_A = 'address/updateAdr-A'
//  设置默认地址
export const ADR_SET_DEFAULT_ADDRESS_A = 'address/setDefaultAdr-A'
//  设置选择的地址
export const ADR_SET_CHOSEN_ADDRESS = 'address/setChosenAdr'
//  获取chosen-adr-g
export const ADR_CHOSEN_ADDRESS_G = 'address/chosenAdr'
export const ADR_SET_EDIT_ADDRESS = 'address/setEditAdr'

//  cart
//  获取购物车-action
export const CART_FETCH_CART_A = 'cart/fetch-cart-a'
//  获取购物车-mutations
export const CART_SET_CART_M = 'cart/set-cart-m'
//  加入购物车
export const CART_ADD_ITEM_A = 'cart/add-item-a'
//  修改cart中商品count
export const CART_EDIT_COUNT_A = 'cart/edit-count-a'
//  选中商品
export const CART_CHOOSE_A = 'cart/choose-a'
//  更新购物车
export const CART_UPDATE_CART = 'cart/update-cart'
//  删除购物车中的商品
export const CART_DELETE_ITEM_A = 'cart/delete-item-a'
//  需要更新(详见 store/cart.js)
export const CART_NEED_UPDATE_M = 'cart/need-update-M'
//  toggle all chosen && delete
export const CART_CHOOSE_ALL_A = 'cart/choose-all-a'
export const CART_CHOOSE_ALL = 'cart/choose-all'
export const CART_DELETE_ALL_A = 'cart/delete-all-a'
export const CART_DELETE_ALL = 'cart/delete-all'
export const CART_ADD_BUY_NOW = 'cart/addBuyNow'
export const CART_UPDATE_BUY_NOW = 'cart/updateBuyNow'
//  GETTERS
export const CART_ALL_CHOSEN = 'cart/allChosen'
export const CART_THE_MONEY = 'cart/theMoney'
export const CART_IS_ALL_CHOSEN = 'cart/isAllChosen'
export const CART_THE_CHOSEN = 'cart/theChosen'
export const CART_THE_PRO = 'cart/thePro'

export const USER_LOCAL_USER_M = 'user/localUser'
export const USER_SET_USER_M = 'user/setUser'
export const USER_MODIFY_AVATAR_M = 'user/modifyAvatar'
export const USER_SAVE_PHONE_CODE_M = 'user/savePhone_Code'
export const USER_DELETE_PHONE_CODE_M = 'user/deletePhone_Code'

export const USER_LOCAL_USER_A = 'user/localUser'
export const USER_SET_USER_A = 'user/setUser'
//  修改头像
export const USER_MODIFY_AVATAR_A = 'user/modifyAvatar'
//  修改昵称
export const USER_MODIFY_NICK_A = 'user/modifyNick'
//  确认用户是否登录
export const USER_CHECK_LOGIN_A = 'user/checkLogin'
//  登出
export const USER_LOGOUT_A = 'user/logout'
//  用户信息
export const USER_INFO = 'user/userInfo'

//  订单
export const PLACE_ORDER_A = 'order/placeOrder'

//  loading
export const UPDATE_LOADING_STATUS = 'loading/updateLoadingStatus'
//  toast
export const SHOW_TOAST = 'loading/showToast'
export const HIDE_TOAST = 'loading/hideToast'
//  目标路由，用于登录后的重定向
export const DESTINATION = 'loading/destination'
//  暂时隐藏tabbar
export const TEMP_HIDING = 'loading/temp-hiding'

//  产品类别
export const TYPES = ['none', '开胃酒&利口酒', '伏特加', '威士忌', '白兰地', '朗姆酒', '起泡葡萄酒', '葡萄酒']
//  订单状态
export const ORDER_STATUS = ['待支付', '待收货', '已完成', '已取消']
