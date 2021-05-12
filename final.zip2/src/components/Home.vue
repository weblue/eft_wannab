<template>
  <div>
    <v-container fluid class="pr-md-1 pl-md-1 pr-0 pl-0">
      <v-row>
        <v-col md="8" cols="12">
          <v-card flat>
            <v-card-text class="pa-0">
              <div class="text-center">
                <span class="text-underline">* Barter Wishlist *</span>
                <v-switch
                  v-model="user_data.compact"
                  @change="changeCompactMode"
                  :disabled="this.isMobile() == true ? true : false"
                  label="Compact Mode"
                  style="float: right"
                ></v-switch>
              </div>
              <v-row v-if="user_data.compact == false" class="mt-3">
                <v-col
                  v-for="(item, i) in user_data.wish_trades"
                  :key="i"
                  cols="12"
                  class="pr-0 pl-0 pl-md-2 pr-md-2"
                  :md="id_trades[item].cost.length < 3 ? 5 : 6"
                >
                  <v-card
                    shadow
                    class="d-flex pa-4"
                    style="
                      border: 1px solid #dcdcdc;
                      justify-content: space-around;
                    "
                  >
                    <div
                      v-for="(it, j) in id_trades[item].cost"
                      :key="j"
                      class="d-flex w-100"
                    >
                      <div class="align-self-center">
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <div
                              v-bind="attrs"
                              v-on="on"
                              :style="`width:50px;height:50px;background-image: url(images/items/${
                                items[it.id].img
                              };background-position: center;background-repeat: no-repeat; background-size: cover;`"
                            ></div>
                            <!-- <img
                              :src="'images/items/' + items[it.id].img"
                              width="50"
                              height="50"
                              v-bind="attrs"
                              v-on="on"
                              alt=""
                            /> -->
                            <sub v-if="it.count != null" class="text-right"
                              >x{{ it.count }}
                            </sub>
                          </template>
                          <span style="text-decoration: underline">{{
                            items[it.id].name
                          }}</span>
                          <p class="mb-0">{{ id_trades[item].reward.count }}</p>
                        </v-tooltip>
                      </div>

                      <div
                        class="align-self-center"
                        v-if="id_trades[item].cost.length - 1 != j"
                      >
                        <i class="align-self-center fas fa-plus"></i>
                      </div>
                    </div>

                    <i
                      class="align-self-center fas fa-long-arrow-alt-right"
                    ></i>
                    <div class="align-self-center">
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <!-- <img
                            :src="
                              'images/items/' +
                              items[id_trades[item].reward.id].img
                            "
                            width="50"
                            height="50"
                            v-bind="attrs"
                            v-on="on"
                            alt=""
                          /> -->
                          <div
                            v-bind="attrs"
                            v-on="on"
                            :style="`width:50px;height:50px;background-image: url(images/items/${
                              items[id_trades[item].reward.id].img
                            };background-position: center;background-repeat: no-repeat; background-size: cover;`"
                          ></div>
                          <sub
                            v-if="id_trades[item].reward.count != null"
                            class="text-right"
                            >x{{ id_trades[item].reward.count }}
                          </sub>
                        </template>
                        <span style="text-decoration: underline">{{
                          id_trades[item].trader.trader
                        }}</span>
                        <p class="mb-0">{{ id_trades[item].reward.count }}</p>
                      </v-tooltip>
                    </div>

                    <div>
                      <!-- <div
                      
                        :style="`width:30px;height:30px;background-image: url(images/traders/${
                          trader_images[
                            id_trades[item].trader.trader.toLowerCase()
                          ]
                        };background-position: center;background-repeat: no-repeat; background-size: cover;`"
                      ></div> -->
                      <img
                        :src="
                          'images/traders/' +
                          lv_getTraderImage(id_trades, item, trader_images)
                        "
                        width="30"
                        alt=""
                      />
                      <p class="mb-0">{{ id_trades[item].trader.trader }}</p>
                      <br />
                      <v-btn
                        class="mx-2"
                        fab
                        dark
                        x-small
                        @click="lc_remove_wishlist(i)"
                        color="pink"
                      >
                        <i class="fas fa-trash"></i>
                      </v-btn>
                    </div>
                  </v-card>
                </v-col>
              </v-row>
              <v-row v-else class="mt-3">
                <v-col
                  v-for="(item, i) in this.compact_entries"
                  :key="i"
                  cols="6"
                  md="2"
                >
                  <v-card
                    shadow
                    class="d-flex pa-2"
                    style="
                      justify-content: space-around;
                      border: 1px solid #dcdcdc;
                    "
                  >
                    <i
                      class="fas fa-times-circle"
                      @click="lc_hidden(item.key)"
                    ></i>
                    <div class="pa-1 pos-rel">
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <div
                            v-bind="attrs"
                            v-on="on"
                            :style="`width:50px;height:50px;background-image: url(images/items/${item.img};background-position: center;background-repeat: no-repeat; background-size: cover;`"
                          ></div>
                        </template>
                        <span style="text-decoration: underline">{{
                          item.name
                        }}</span>
                      </v-tooltip>
                    </div>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col md="4" cols="12" class="pr-md-1 pl-md-1 pr-0 pl-0">
          <v-card flat>
            <v-card-text class="pa-0">
              <div class="text-center">
                <span class="text-underline">* Next 5 Hand Overs *</span>
              </div>
              <v-row v-for="(item, i) in next_quests" :key="i" class="mt-3">
                <v-col cols="12" md="12">
                  <v-card
                    shadow
                    class="pa-4"
                    style="
                      border: 1px solid #dcdcdc;
                      justify-content: space-around;
                    "
                  >
                    <p class="text-left">{{ id_quests[item].name }}</p>
                    <div class="d-flex" style="justify-content: space-around">
                      <div v-for="(it, j) in id_quests[item].cost" :key="j">
                        <!-- {{ it.id }} -->
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <div
                              v-bind="attrs"
                              v-on="on"
                              :style="`width:50px;height:50px;background-image: url(images/items/${
                                items[it.id].img
                              };background-position: center;background-repeat: no-repeat; background-size: cover;`"
                            ></div>
                            <!-- <img
                              :src="'images/items/' + items[it.id].img"
                              width="50"
                              height="50"
                              v-bind="attrs"
                              v-on="on"
                              alt=""
                            /> -->
                            <!-- <br /> -->
                            <div>
                              <input
                                type="number"
                                value="0"
                                class="dark-mode-text-field"
                              />
                              <span>of {{ it.count }}</span>
                            </div>
                          </template>
                          <span style="text-decoration: underline">{{
                            items[it.id].name
                          }}</span>
                          <p class="mb-0">{{ it.count }}</p>
                        </v-tooltip>
                      </div>

                      <div
                        class="d-flex"
                        style="
                          flex-direction: column;
                          justify-content: space-around center;
                        "
                      >
                        <div>
                          <div
                            class="ml-auto mr-auto"
                            :style="`width:30px;height:30px;background-image: url(images/traders/${
                              trader_images[id_quests[item].trader]
                            };background-position: center;background-repeat: no-repeat; background-size: cover;`"
                          ></div>
                          <!-- <img
                            width="30"
                            :src="
                              'images/traders/' +
                              trader_images[id_quests[item].trader]
                            "
                            alt=""
                          /> -->
                          <p class="mb-0">{{ id_quests[item].trader }}</p>
                        </div>
                        <br />
                        <v-btn
                          @click="lc_done_quests(item)"
                          class="mx-2"
                          dark
                          x-small
                          color="success"
                        >
                          <v-icon>mdi-check</v-icon> Done
                        </v-btn>
                      </div>
                    </div>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "Home",
  computed: {
    ...mapGetters([
      "items",
      "id_trades",
      "user_data",
      "trader_images",
      "quest_orders_front",
      "id_quests",
    ]),
    compact_entries() {
      let temp = [];
      this.user_data.wish_trades.forEach((item) => {
        this.id_trades[item].cost.forEach((it) => {
          // Dont show the items that are in user hidden
          let obj = this.user_data.hidden_items.find(
            (hid_it) => hid_it == it.id
          );
          if (obj == null) {
            temp.push({ ...this.items[it.id], key: it.id });
          }
        });
      });
      return temp;
    },
    next_quests() {
      let temp = [];
      for (let index = 0; index < this.quest_orders_front.length; index++) {
        if (temp.length == 5) {
          break;
        }
        const element = this.quest_orders_front[index];
        let obj = this.user_data.completed_quests.find(
          (item) => item == element
        );
        if (obj == null) {
          temp.push(element);
        }
      }

      return temp;
    },
  },
  data() {
    return {};
  },
  created() {
    console.log(this.next_quests);
  },
  mounted() {
    let check = this.isMobile();
    if (check == true) {
      this.user_data.compact = true;
      this.fetchUserData(this.user_data);
    } else {
      this.user_data.compact = false;
      this.fetchUserData(this.user_data);
    }
  },
  methods: {
    ...mapActions(["fetchUserData"]),
    changeCompactMode(e) {
      // this.user_data.compact = e;
      let obj = { ...this.user_data, compact: e };
      this.fetchUserData(obj);
    },
    lv_getTraderImage(id_trades, item, trader_images) {
      return id_trades[item].trader.trader.toLowerCase().split(" ").length > 1
        ? trader_images[
            id_trades[item].trader.trader.toLowerCase().split(" ")[0] +
              "_" +
              id_trades[item].trader.trader.toLowerCase().split(" ")[1]
          ]
        : trader_images[id_trades[item].trader.trader.toLowerCase()];
    },
    lc_done_quests(id) {
      console.log(id);
      this.user_data.completed_quests.push(id);
      this.fetchUserData(this.user_data);
    },
    lc_remove_wishlist(id) {
      console.log(id);
      this.user_data.wish_trades.splice(id, 1);
      this.fetchUserData(this.user_data);
    },
    lc_hidden(ls) {
      this.user_data.hidden_items.push(ls);
      this.fetchUserData(this.user_data);
    },
    isMobile() {
      if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      ) {
        return true;
      } else {
        return false;
      }
    },
    // },
  },
};
</script>

<style>
</style>