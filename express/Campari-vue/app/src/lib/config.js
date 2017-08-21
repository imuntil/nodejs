/**
 * Created by 斌 on 2017/3/13.
 */

const BASE_PATH = '/api/'
const IMG_PATH = '/images/asserts/'

export default {
  path: BASE_PATH,
  imgPath: IMG_PATH,
  avatarPath: BASE_PATH + 'upload/',
  dev: false,
  testData: [
    {price: 1131, ENName: 'noxxx', CNName: '茅台', procontent: '700', id: 1},
    {price: 11111, ENName: 'noxxx', CNName: '茅台', procontent: '700', id: 2},
    {price: 2111, ENName: 'noxxx', CNName: '茅台', procontent: '700', id: 3},
    {price: 1131, ENName: 'noxxx', CNName: '茅台', procontent: '700', id: 4},
    {price: 111, ENName: 'noxxx', CNName: '茅台', procontent: '700', id: 5},
    {price: 1114, ENName: 'noxxx', CNName: '茅台', procontent: '700', id: 6},
    {price: 1151, ENName: 'noxxx', CNName: '茅台', procontent: '700', id: 7},
    {price: 1141, ENName: 'noxxx', CNName: '茅台', procontent: '700', id: 8},
    {price: 111, ENName: 'noxxx', CNName: '茅台', procontent: '700', id: 9},
    {price: 1811, ENName: 'noxxx', CNName: '茅台', procontent: '700', id: 10},
    {price: 9111, ENName: 'noxxx', CNName: '茅台', procontent: '700', id: 11},
    {price: 1011, ENName: 'noxxx', CNName: '茅台', procontent: '700', id: 12},
    {price: 1191, ENName: 'noxxx', CNName: '茅台', procontent: '700', id: 13}
  ],
  simUserData: {
    name: 'zhin',
    phone: '13022163937',
    userid: 3,
    avatar: '3.png'
  },
  testOrderData: [
    {
      ordernum: '13745933347530',
      total: '2',
      orderprice: '100',
      orderstatus: 0,
      orderaddress: '上海换头可靠连接方式',
      status: {
        s: '未支付',
        c: 'red',
        o: '去支付'
      },
      products: [
        {price: 1131, ENName: 'noxxx', CNName: '茅台', procontent: '700', id: 1, num: 1},
        {price: 1131, ENName: 'noxxx', CNName: '茅台', procontent: '700', id: 2, num: 1}
      ]
    },
    {
      ordernum: '13745932317530',
      total: '2',
      orderprice: '1001',
      orderstatus: 1,
      orderaddress: '上海宝三',
      status: {
        s: '已支付',
        c: 'red',
        o: '查看物流'
      },
      products: [
        {price: 118, ENName: 'noxxx', CNName: '茅台', procontent: '700', id: 2, num: 1},
        {price: 131, ENName: 'noxxx', CNName: '茅台', procontent: '700', id: 1, num: 1}
      ]
    },
    {
      ordernum: '1297927952409',
      total: '1',
      orderprice: '100',
      orderstatus: 0,
      orderaddress: '上海换头可靠连接方式',
      status: {
        s: '未支付',
        c: 'red',
        o: '去支付'
      },
      products: [
        {price: 1131, ENName: 'noxxx', CNName: '茅台', procontent: '700', id: 1, num: 1}
      ]
    },
    {
      ordernum: '12380170918',
      total: '3',
      orderprice: '1001',
      orderstatus: 1,
      orderaddress: '上海宝三',
      status: {
        s: '已支付',
        c: 'red',
        o: '查看物流'
      },
      products: [
        {price: 118, ENName: 'noxxx', CNName: '茅台', procontent: '700', id: 2, num: 1},
        {price: 131, ENName: 'noxxx', CNName: '茅台', procontent: '700', id: 1, num: 1},
        {price: 1131, ENName: 'noxxx', CNName: '茅台', procontent: '700', id: 2, num: 1}
      ]
    }
  ]
}
