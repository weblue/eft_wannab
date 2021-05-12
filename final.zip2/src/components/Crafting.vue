<template>
  <div>
    <v-container fluid>
      <!-- {{ panel }} -->
      <v-expansion-panels v-model="panel" multiple>
        <v-expansion-panel
          class="pr-0 pl-0"
          @click="handleChange(item)"
          v-for="(item, i) in craft_stations"
          :key="i"
        >
          <!-- @click.prevent="onClick()" -->
          <v-expansion-panel-header>
            <!-- <img
              :src="'images/traders/' + trader_images[item]"
              style="max-width: 50px"
              alt=""
            /> -->
            <span class="ml-1">{{ nameSplitter(item) }}</span>
            <!-- item.split('_').length>0 ? item.:item.replace(/\b\w/g, (l) => l.toUpperCase()) -->

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
            </template>

            <!-- @click.prevent="onClick()" -->
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-row class="mt-3">
              <v-col
                v-for="(it, j) in getTradeInnerCards.filter(
                  (ilk) => ilk.type == item
                )"
                :key="j"
                cols="12"
                :md="it.cost.length <= 3 ? 4 : 5"
              >
                <v-card
                  shadow
                  class="d-flex pa-4"
                  style="
                    border: 1px solid #dcdcdc;
                    justify-content: space-around;
                  "
                >
                  <!-- <p>{{ it }}</p> -->
                  <div
                    v-for="(sub_item, l) in it.cost"
                    :key="l"
                    class="align-self-center"
                  >
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <div
                          v-bind="attrs"
                          v-on="on"
                          :style="`width:50px;height:50px;background-image: url(images/items/${
                            items[sub_item.id].img
                          };background-position: center;background-repeat: no-repeat; background-size: cover;`"
                        ></div>
                        <!-- <img
                          :src="'images/items/' + items[sub_item.id].img"
                          width="50"
                          height="50"
                          v-bind="attrs"
                          v-on="on"
                          alt=""
                        /> -->
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
                  <div>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <!-- <img
                          :src="'images/items/' + items[it.reward.id].img"
                          width="50"
                          height="50"
                          style="max-height: 50px !important"
                          alt=""
                          v-bind="attrs"
                          v-on="on"
                          class="align-self-center"
                        /> -->

                        <div
                          v-bind="attrs"
                          v-on="on"
                          :style="`width:50px;height:50px;background-image: url(images/items/${
                            items[it.reward.id].img
                          };background-position: center;background-repeat: no-repeat; background-size: cover;`"
                        ></div>

                        <sub v-if="it.reward.count != null" class="text-right"
                          >x{{ it.reward.count }}
                        </sub>
                      </template>
                      <span style="text-decoration: underline">{{
                        items[it.reward.id].name
                      }}</span>
                      <p class="mb-0">{{ it.reward.count }}</p>
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
  name: "Crafting",
  computed: {
    ...mapGetters([
      "trades",
      "craft_stations",
      "max_levels",
      "trader_images",
      "user_data",
      "items",
    ]),
    // inter,
    getTradeInnerCards() {
      let temp = [];
      this.active.forEach((activeitem) => {
        for (
          let index = 0;
          index <= this.user_data.level[activeitem];
          index++
        ) {
          if (this.trades[activeitem][index] != null) {
            console.log("cames" + index);
            Object.keys(this.trades[activeitem][index]).forEach((key) => {
              console.log(this.trades[activeitem][index][key]);
              let obj = this.user_data.wish_trades.find(
                (temp_key) => temp_key == key
              );

              if (obj == null) {
                temp.push({
                  ...this.trades[activeitem][index][key],
                  key: key,
                  exists: false,
                  type: activeitem,
                });
              } else {
                temp.push({
                  ...this.trades[activeitem][index][key],
                  key: key,
                  exists: true,
                  type: activeitem,
                });
              }
              // if (obj == null) {
              //   temp.push({
              //     ...this.trades[this.active][index][key],
              //     key: key,
              //   });
              // }
            });
          }
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
    onClick() {
      // const curr = this.panel;
      // this.panel = curr === undefined ? 0 : undefined;
    },
    def(e) {
      console.log(e);
      if (e != null) {
        this.panel = e;
        console.log(this.panel);
      }
      console.log(this.panel);
      console.log("dsadsa");
      // this.panel = 1;
      // console.log(this.panel);
      // console.log("Ds");
      // this.panel.push(il);
      // console.log(this.panel);
      // this.$forceUpdate(); // Notice we have to use a $ here
    },
    removeWishTrades(id) {
      console.log(id);
      this.user_data.wish_trades = this.user_data.wish_trades.filter(
        (its) => its != id
      ); //.push(id);
      this.fetchUserData(this.user_data);
    },
    addWishTrades(id) {
      console.log(id);
      this.user_data.wish_trades.push(id);
      this.fetchUserData(this.user_data);
    },
    handleLevelChange(e, item) {
      console.log(item);
      console.log(e.target.value);
      this.user_data.level[item] = parseInt(e.target.value);
      this.fetchUserData(this.user_data);
    },
    nameSplitter(item) {
      if (item.split("_").length > 0) {
        let arr = item.split("_");
        let namestr = "";
        arr.forEach((item, i) => {
          if (i != 0) {
            namestr = namestr + " " + item;
          } else {
            namestr = item;
          }
        });
        return namestr.replace(/\b\w/g, (l) => l.toUpperCase());
      } else {
        return item.replace(/\b\w/g, (l) => l.toUpperCase());
      }
    },
    handleChange(e) {
      // this.panel = [...Array(this.craft_stations).keys()].map((k, i) => i);

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
      flag: true,
      active: ["intelligence_center"],
      // items: ["Prapor", "Therapist", "Skier", "Peacekeeper", "Mechanic"],
    };
  },
};
</script>