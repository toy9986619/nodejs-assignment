import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
export const store = new Vuex.Store({
  state: {
    isLogin: false,
    user: "",
  },

  mutations: {
    login(state, user) {
      state.user = user;
      state.isLogin = true;
    },

    logout(state) {
      state.user = "";
      state.isLogin = false;
    },
  }
});