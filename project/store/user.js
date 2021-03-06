import { http } from '../plugins/axios'

const state = () => ({
  token: '',
  id: '',
  email: '',
  nickname: '',
  avatar: ''
})

const mutations = {
  SET_TOKEN(state, token) {
    state.token = token
  },
  SET_USER(state, user = {}) {
    console.log('xx', user)
    state.id = user._id
    state.email = user.email
    state.nickname = user.nickname
    state.avatar = user.avatar
  },
  LOGOUT(state) {
    state.id = ''
    state.token = ''
    state.email = ''
    state.nickname = ''
    state.avatar = ''
  }
}

const actions = {
  login: async ({ state, commit }, data) => {
    let ret = await http.post('/user/login', data)
    // 登录返回token
    if (ret.code === 0) {
      commit('SET_TOKEN', ret.data.token)
      console.log('store里有token吗', ret.data.token)
      return ret
    }
  },
  // 每次渲染页面都重新给vuex赋值
  detail: async ({ state, commit }, data) => {
    let ret = await http.get('/user/detail')
    if (ret.code === 0) {
      commit('SET_USER', ret.data)
      return ret
    }
  }
}

export default {
  namespace: true,
  state,
  mutations,
  actions
}
