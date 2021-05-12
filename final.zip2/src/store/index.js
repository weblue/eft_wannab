import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
import items from "./modules/items";
import user from "./modules/user";

export default new Vuex.Store({
  modules: {
    items,
    user,
  },
});
