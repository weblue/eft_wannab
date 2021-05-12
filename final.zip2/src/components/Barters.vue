<template>
  <div>
    <v-container fluid>
      <!-- {{ panel }} -->
      <v-expansion-panels v-model="panel" multiple>
        <!-- @click.prevent="onClick()" -->
        <!--          
 -->

        <v-expansion-panel
          @click="handleChange(item)"
          v-model="flag"
          v-for="(item, i) in traders.filter(
            (itm) => itm != 'intelligence_center'
          )"
          :key="i"
        >
          <!-- @click.prevent="onClick(i)" -->
          <v-expansion-panel-header>
            <template v-slot:actions>
              <div @click.stop="onClick()">
                Level
                <input
                  type="number"
                  :max="max_levels[item]"
                  @change="handleLevelChange($event, item)"
                  v-model="user_data.level[item]"
                  :id="item"
                  class="ml-2 dark-mode-text-field"
                  style="max-width: 50px"
                />
              </div>
              <!-- <v-btn icon @click.stop="onClick()">
                <v-icon>mdi-filter-variant</v-icon>
              </v-btn> -->
            </template>
            <img
              :src="'images/traders/' + trader_images[item]"
              style="max-width: 50px"
              alt=""
            />
            <span class="ml-1">{{
              item.replace(/\b\w/g, (l) => l.toUpperCase())
            }}</span>
          </v-expansion-panel-header>
          <v-expansion-panel-content v-model="flag">
            <v-row class="mt-3">
              <v-col
                v-for="(it, j) in getTradeInnerCards.filter(
                  (ilk) => ilk.type == item
                )"
                :key="j"
                cols="12"
                :md="it.cost.length < 3 ? 4 : 6"
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
                    v-for="(sub_item, l) in it.cost"
                    :key="l"
                    class="align-self-center"
                  >
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <!-- <img
                          :src="'images/items/' + items[sub_item.id].img"
                          width="50"
                          v-bind="attrs"
                          v-on="on"
                          height="50"
                          alt=""
                        /> -->
                        <div
                          v-bind="attrs"
                          v-on="on"
                          :style="`width:50px;height:50px;background-image: url(images/items/${
                            items[sub_item.id].img
                          };background-position: center;background-repeat: no-repeat; background-size: cover;`"
                        ></div>
                        <!-- <sub class="text-right">x3</sub> -->
                        <sub v-if="sub_item.count != null" class="text-right"
                          >x{{ sub_item.count }}
                        </sub>
                      </template>
                      <span style="text-decoration: underline">{{
                        items[sub_item.id].name
                      }}</span>
                      <p class="mb-0">{{ sub_item.count }}</p>
                    </v-tooltip>
                  </div>

                  <i class="align-self-center fas fa-long-arrow-alt-right"></i>
                  <!-- {{ sub_item }} -->
                  <div>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <!-- <img
                          v-bind="attrs"
                          v-on="on"
                          :src="'images/items/' + items[it.reward.id].img"
                          width="50"
                          alt=""
                          class="align-self-center"
                        /> -->
                        <div
                          v-bind="attrs"
                          v-on="on"
                          :style="`width:50px;height:50px;background-image: url(images/items/${
                            items[it.reward.id].img
                          };background-position: center;background-repeat: no-repeat; background-size: cover;`"
                        ></div>
                      </template>
                      <span style="text-decoration: underline">{{
                        items[it.reward.id].name
                      }}</span>
                      <!-- <p class="mb-0">{{ sub_item.count }}</p> -->
                    </v-tooltip>
                  </div>

                  <div class="align-self-center">
                    <v-btn
                      v-if="it.exists == false"
                      @click="addWishTrades(it.key)"
                      class="mx-2"
                      fab
                      dark
                      x-small
                      color="pink"
                    >
                      <v-icon dark> mdi-heart </v-icon>
                    </v-btn>

                    <v-btn
                      @click="removeWishTrades(it.key)"
                      class="mx-2"
                      v-else
                      fab
                      dark
                      x-small
                      color="pink"
                    >
                      <i class="fas fa-trash"></i>
                    </v-btn>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-container>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "Barters",
  computed: {
    ...mapGetters([
      "trades",
      "traders",
      "max_levels",
      "trader_images",
      "user_data",
      "items",
    ]),
    // inter,
    getTradeInnerCards() {
      let temp = [];
      if (this.panel == undefined || this.panel == 0) {
        this.panel = [0];
      }
      this.active.forEach((activeitem) => {
        // console.log(this.user_data.level[this.traders[activeitem]]);
        // console.log(this.traders[activeitem]);
        for (let index = 0; index < this.user_data.level[activeitem]; index++) {
          Object.keys(this.trades[activeitem][index + 1]).forEach((key) => {
            let obj = this.user_data.wish_trades.find(
              (temp_key) => temp_key == key
            );
            // console.log(obj);
            if (obj == null) {
              temp.push({
                ...this.trades[activeitem][index + 1][key],
                key: key,
                type: activeitem,
                exists: false,
              });
            } else {
              temp.push({
                ...this.trades[activeitem][index + 1][key],
                key: key,
                type: activeitem,
                exists: true,
              });
            }
          });
        }
      });

      return temp;
    },
  },
  created() {
    console.log(this.getTradeInnerCards);
  },
  methods: {
    ...mapActions(["fetchUserData"]),
    abc(e) {
      console.log(e);
      this.panel = e;
    },
    onClick() {
      // let curr = this.panel;
      // let og = this.panel.find((it) => it == e);
      // console.log(og);
      // if (og == null) {
      //   curr.push(e);
      //   this.panel.push(e);
      // } else {
      //   this.panel.slice(e, 1);
      // }
      // const curr = this.panel;
      // this.panel = curr === undefined ? 0 : undefined;
    },
    removeWishTrades(id) {
      this.user_data.wish_trades = this.user_data.wish_trades.filter(
        (its) => its != id
      ); //.push(id);
      this.fetchUserData(this.user_data);
    },
    addWishTrades(id) {
      this.user_data.wish_trades.push(id);
      this.fetchUserData(this.user_data);
    },
    handleLevelChange(e, item) {
      this.user_data.level[item] = parseInt(e.target.value);
      this.fetchUserData(this.user_data);
    },
    handleChange(e) {
      // this.flag = false;
      let obj = this.active.find((it) => it == e);
      if (obj == null) {
        this.active.push(e);
      } else {
        let index = this.active.findIndex((i) => i == e);
        this.active.splice(index, 1);
      }
    },
  },
  data() {
    return {
      panel: [0],
      flag: false,
      active: ["prapor"],
      // items: ["Prapor", "Therapist", "Skier", "Peacekeeper", "Mechanic"],
    };
  },
};
</script>