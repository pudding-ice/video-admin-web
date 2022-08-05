import {getInfo, getMenuRouter, login, logout} from '@/api/user'
import {getToken, removeToken, setToken} from '@/utils/auth'
import {resetRouter} from '@/router/index'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    buttons: [],
    roles: [],
    menus: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_BUTTONS: (state, buttons) => {
    state.buttons = buttons
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_MENU: (state, menus) => {
    state.menus = menus
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      login(userInfo).then(response => {
        console.log(response)
        const data = response.data
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        console.log(response)
        const {data} = response
        console.log('role=' + data.roles)
        if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
          commit('SET_ROLES', data.roles)
        } else {
          reject('getInfo: roles must be a non-null array !')
        }
        const buttonAuthList = []
        data.permissionValueList.forEach(button => {
          buttonAuthList.push(button)
        })
        commit('SET_NAME', data.name)
        commit('SET_AVATAR', data.avatar)
        commit('SET_BUTTONS', buttonAuthList)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken()// 清空cookie
        resetRouter()
        commit('SET_TOKEN', '')// 清空前端vuex中存储的数据
        commit('SET_ROLES', [])// 清空前端vuex中存储的数据
        commit('SET_BUTTONS', [])
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  getRouter({commit, state}) {
    return new Promise((resolve, reject) => {
      getMenuRouter().then(response => {
        const menus = response.data.menuList
        menus.push({
          path: '/404',
          component: '404',
          hidden: true
        }, {
          path: '*',
          redirect: '/404',
          hidden: true
        })
        console.log(menus)
        commit('SET_MENU', menus.reverse()) // 把name 保存到vuex中
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({commit}) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first //清楚token
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

