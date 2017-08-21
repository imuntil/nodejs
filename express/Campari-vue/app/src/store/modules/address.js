/**
 * Created by 斌 on 2017/5/7.
 */
import * as type from '../../lib/constant'
import { address } from '../../lib/services'
import _ from 'lodash'

function setDefault (adrs, index) {
  _.forEach(adrs, adr => {
    adr.isDefault = false
  })
  adrs[index].isDefault = true
}
export default {
  state: {
    ADRS: [],
    chosenAdr: null
  },
  mutations: {
    [type.ADR_SET_ADRS_M] (state, payload) {
      state.ADRS = payload
    },
    [type.ADR_UPDATE_ADRS] (state, payload) {
      switch (payload.method.toUpperCase()) {
        case 'ADD':
          state.ADRS.push(payload.adr)
          if (payload.adr.isDefault) {
            setDefault(state.ADRS, state.ADRS.length - 1)
          }
          break
        case 'UPDATE':
          state.ADRS[payload.index] = payload.adr
          if (payload.adr.isDefault) {
            setDefault(state.ADRS, payload.index)
          }
          break
        case 'DELETE':
          state.ADRS.splice(payload.index, 1)
          break
        case 'DEFAULT':
          setDefault(state.ADRS, payload.index)
          break
      }
    },
    [type.ADR_SET_CHOSEN_ADDRESS] (state, payload) {
      state.chosenAdr = state.ADRS[payload.index]
    }
  },
  actions: {
    [type.ADR_FETCH_ADDRESSES_A] (context, payload) {
      return address.fetchAddress(payload)
        .then(data => {
          if (!data || !data.length) {
            data = [{id: 1}, {id: 2}, {id: 3}, {id: 4}]
          }
          context.commit(type.ADR_SET_ADRS_M, data)
          return true
        })
    },
    [type.ADR_ADD_ADDRESS_A] (context, payload) {
      return address.addAddress(payload)
        .then(() => {
          context.commit(type.ADR_UPDATE_ADRS, {adr: payload, method: 'add'})
          return true
        })
    },
    [type.ADR_DELETE_ADDRESS_A] (context, payload) {
      return address.deleteAddress({_id: payload._id}, payload.id)
        .then(() => {
          context.commit(type.ADR_UPDATE_ADRS, {method: 'delete', index: payload.index})
          return true
        })
    },
    [type.ADR_UPDATE_ADDRESS_A] (context, payload) {
      return address.updateAddress(payload.params, payload.params._id)
        .then(() => {
          context.commit(type.ADR_UPDATE_ADRS, {method: 'update', index: payload.index, adr: payload.params})
          return true
        })
    },
    [type.ADR_SET_DEFAULT_ADDRESS_A] (context, payload) {
      return address.setDefaultAdr(payload, payload.id)
        .then(() => {
          context.commit(type.ADR_UPDATE_ADRS, {method: 'default', index: payload.index})
          return true
        })
    }
  },
  getters: {
    [type.ADR_CHOSEN_ADDRESS_G] (state) {
      if (state.chosenAdr) return state.chosenAdr
      let adr = _.filter(state.ADRS, {isDefault: true})[0]
      if (adr) {
        state.chosenAdr = adr
        return adr
      }
      if (state.ADRS.length) {
        state.chosenAdr = state.ADRS[0]
        return state.chosenAdr
      }
    }
  }
}
