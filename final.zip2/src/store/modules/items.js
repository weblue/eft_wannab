import trades from "../../../docs/assets/trades.json";
import quests from "../../../docs/assets/quests.json";

import id_trades from "../../../docs/assets/id_trades.json";
import items from "../../../docs/assets/items.json";
import statics from "../../../docs/assets/static.json";
import id_quests from "../../../docs/assets/id_quests.json";

const state = {
  trades: {},
  traders: [],
  id_trades: {},
  items: {},
  trader_images: {},
  quest_orders_front: [],
  id_quests: {},
  max_levels: {},
  craft_stations: [],
  quest_orders: {},
  quests: {},
};

const getters = {
  items: (state) => state.items,
  id_trades: (state) => state.id_trades,
  traders: (state) => state.traders,
  trades: (state) => state.trades,
  trader_images: (state) => state.trader_images,
  quest_orders_front: (state) => state.quest_orders_front,
  id_quests: (state) => state.id_quests,
  max_levels: (state) => state.max_levels,
  craft_stations: (state) => state.craft_stations,
  quest_orders: (state) => state.quest_orders,
  quests: (state) => state.quests,
};

const actions = {
  fetchJsonData({ commit }, payload) {
    commit("setJsonData", { state_name: "trades", payload: trades });
    commit("setJsonData", { state_name: "traders", payload: statics.traders });
    commit("setJsonData", {
      state_name: "craft_stations",
      payload: statics.craft_stations,
    });

    commit("setJsonData", {
      state_name: "quest_orders",
      payload: statics.quest_orders,
    });
    commit("setJsonData", {
      state_name: "quests",
      payload: quests,
    });
    commit("setJsonData", { state_name: "id_trades", payload: id_trades });
    commit("setJsonData", { state_name: "items", payload: items });
    commit("setJsonData", { state_name: "id_quests", payload: id_quests });
    commit("setJsonData", {
      state_name: "max_levels",
      payload: statics.max_levels,
    });

    commit("setJsonData", {
      state_name: "trader_images",
      payload: statics.trader_images,
    });
    commit("setJsonData", {
      state_name: "quest_orders_front",
      payload: statics.quest_orders.front,
    });
  },
};

const mutations = {
  setJsonData(state, payload) {
    state[payload.state_name] = payload.payload;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
