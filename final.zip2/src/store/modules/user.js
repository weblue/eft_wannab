import user_data from "../../../docs/user_real.json";

const state = {
  user_data: {},
};

const getters = {
  user_data: (state) => state.user_data,
};

const actions = {
  fetchUserData({ commit }, payload) {
    console.log(payload);
    if (localStorage.getItem("user") == null) {
      localStorage.setItem("user", JSON.stringify(user_data));

      commit("setUserData", { state_name: "user_data", payload: user_data });
    } else {
      if (payload == null) {
        commit("setUserData", {
          state_name: "user_data",
          payload: JSON.parse(localStorage.getItem("user")),
        });
      } else {
        localStorage.setItem("user", JSON.stringify(payload));

        commit("setUserData", { state_name: "user_data", payload: payload });
      }
    }
    // localStorage.setItem("user", JSON.stringify(user_data));
  },
  // makeItemHidden({ commit }, payload) {
  //   commit("setUserData", { state_name: "user_data", payload: user_data });

  // },
};

const mutations = {
  setUserData(state, payload) {
    state[payload.state_name] = payload.payload;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
