/**
 * Created by 斌 on 2017/4/19.
 */
import {UPDATE_LOADING_STATUS, SHOW_TOAST, HIDE_TOAST, DESTINATION, TEMP_HIDING} from '../../lib/constant'
import _ from 'lodash'

export default {
  state: {
    isLoading: false,
    toast: {
      value: false,
      time: 1000,
      width: '80%',
      type: 'text',
      position: 'default',
      text: ''
    },
    destination: {},
    tempHiding: false
  },
  mutations: {
    [UPDATE_LOADING_STATUS] (state, payload) {
      state.isLoading = payload.isLoading
    },
    [SHOW_TOAST] (state, payload) {
      if (_.isString(payload)) {
        state.toast = _.assign(state.toast, {value: true, text: payload})
      } else {
        state.toast = _.assign(state.toast, payload, {value: true})
      }
    },
    [HIDE_TOAST] (state) {
      state.toast.value = false
    },
    [DESTINATION] (state, destination) {
      state.destination = destination
    },
    [TEMP_HIDING] (state, payload) {
      state.tempHiding = payload
    }
  }
}
