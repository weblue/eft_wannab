const state = {
  user_data: {
      "wish_trades": [],
      "completed_quests": [],
      "partial_quests": {
  
      },
      "level": {
        "prapor": 1,
        "therapist": 1,
        "skier": 1,
        "peacekeeper": 1,
        "mechanic": 1,
        "intelligence_center": 0,
        "lavatory": 0,
        "medstation": 0,
        "nutrition_unit": 0,
        "workbench": 0
      },
      "compact": false,
      "hidden_items": []
  },
};

const getters = {
  user_data: (state) => state.user_data,
};

const actions = {
  fetchUserData({ commit }, payload) {
    console.log(payload);
    if (localStorage.getItem("user") == null) {
      localStorage.setItem("user", JSON.stringify(getters.user_data));

      commit("setUserData", { state_name: "user_data", payload: getters.user_data });
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
