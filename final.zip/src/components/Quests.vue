<template>
  <div>
    <v-container fluid>
      <!-- {{ resultValues }} -->
      <div>
        <v-text-field label="Search" v-model="search" outlined>
          <template v-slot:append-outer>
            <v-btn class="mt-0" dark @click="search = ''">Clear</v-btn>
          </template>
        </v-text-field>
      </div>
      <v-expansion-panels class="questpanel" v-model="panel" multiple>
        <v-expansion-panel
          class="pr-0 pl-0"
          @click="handleChange(item)"
          v-for="(item, i) in Object.keys(quest_orders).filter(
            (key) => key != 'front'
          )"
          :key="i"
        >
          <v-expansion-panel-header class="pr-0 pl-0 pl-md-2 pr-md-2">
            <img
              :src="'images/traders/' + trader_images[item]"
              style="max-width: 50px"
              alt=""
            />

            <span class="ml-1">{{
              item.replace(/\b\w/g, (l) => l.toUpperCase())
            }}</span>
          </v-expansion-panel-header>
          <v-expansion-panel-content class="quests-panel">
            <v-row
              class="mt-3"
              v-for="(abc, m) in resultValues.filter((pol) => pol.type == item)"
              :key="m"
            >
              <v-col
                cols="12"
                class="pr-0 pl-0 pr-md-2 pl-md-2"
                v-for="(it, j) in abc.arr"
                :key="j"
                md="4"
              >
                <div>
                  <v-card
                    shadow
                    class="pa-4 jc-sa"
                    style="border: 1px solid #dcdcdc"
                  >
                    <div class="d-flex">
                      <p>
                        <!-- {{
                          search != "" &&
                          quests[abc.type][it].cost.filter((itp) =>
                            items[itp.id].name
                              .toLowerCase()
                              .includes(search.toLowerCase())
                          ).length > 0
                            ? "yay"
                            : "nay"
                        }} -->
                      </p>
                      <p
                        class="text-left"
                        :class="[
                          search != '' &&
                          resultValues.filter((pol) => pol.type == item)
                            .length > 0
                            ? 'bgyellow'
                            : '',
                        ]"
                      >
                        {{
                          itemname(item, it) != null
                            ? itemname(item, it).name
                            : ""
                        }}
                      </p>
                      <v-btn
                        v-if="
                          user_data.completed_quests.find((its) => its == it) ==
                          null
                        "
                        @click="lc_done_quests(it)"
                        class="mx-2 ml-auto"
                        dark
                        x-small
                        color="success"
                      >
                        <v-icon>mdi-check</v-icon> Done
                      </v-btn>
                      <v-btn
                        v-else
                        @click="lc_undo_quests(it)"
                        class="mx-2 ml-auto"
                        dark
                        x-small
                      >
                        <v-icon>mdi-undo</v-icon> Undo
                      </v-btn>
                    </div>

                    <div
                      v-if="
                        user_data.completed_quests.find((its) => its == it) ==
                        null
                      "
                      class="d-flex"
                      style="justify-content: space-around"
                    >
                      <div
                        class="d-block"
                        v-for="(ij, l) in getCosts(quests, abc.type, it)"
                        :key="l"
                      >
                        <div>
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                              <div
                                v-bind="attrs"
                                v-on="on"
                                :style="`margin:auto;width:50px;height:50px;background-image: url(images/items/${
                                  items[ij.id].img
                                };background-position: center;background-repeat: no-repeat; background-size: cover;`"
                              ></div>
                              <!-- <p
                                :class="[
                                  search != '' &&
                                  resultValues.filter((pol) => pol.type == item)
                                    .length > 0
                                    ? 'bgyellow'
                                    : '',
                                ]"
                              >
                                {{ items[ij.id].name }}
                              </p> -->
                              <div>
                                <input
                                  type="number"
                                  value="0"
                                  min="0"
                                  class="dark-mode-text-field"
                                />
                                &nbsp; <span>of {{ ij.count }}</span>
                              </div>
                            </template>
                            <span style="text-decoration: underline">{{
                              items[ij.id].name
                            }}</span>
                            <!-- <p class="mb-0">{{ ij.count }}</p> -->
                          </v-tooltip>
                        </div>
                      </div>
                    </div>
                  </v-card>
                </div>
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-container>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "Quests",
  computed: {
    ...mapGetters([
      "quest_orders",
      "items",
      "trader_images",
      "quest_orders",
      "id_quests",
      "quests",
      "user_data",
      "max_levels",
    ]),

    resultValues() {
      if (this.search != "") {
        let temp = [];
        this.active.forEach((element) => {
          let arr = [];
          let allitems = Object.keys(this.items).filter((key) =>
            this.items[key].name
              .toLowerCase()
              .includes(this.search.toLowerCase())
          );

          // arr = this.quest_orders[element].filter((it) =>
          //   it.toLowerCase().includes(this.search.toLowerCase())
          // );
          arr = this.quest_orders[element];
          console.log(arr);
          arr.forEach((item) => {
            for (
              let index = 0;
              index < this.quests[element][item].cost.length;
              index++
            ) {
              let obj = allitems.find(
                (key) => key == this.quests[element][item].cost[index].id
              );
              if (obj != null) {
                let obt = temp.find((il) => il.type == element);
                let tupa = [];

                if (obt == null) {
                  this.quest_orders[element].forEach((finalexists) => {
                    for (
                      let index = 0;
                      index < this.quests[element][finalexists].cost.length;
                      index++
                    ) {
                      let abp = this.items[
                        this.quests[element][finalexists].cost[index].id
                      ].name
                        .toLowerCase()
                        .includes(this.search.toLowerCase());
                      console.log(abp);
                      if (abp == true) {
                        tupa.push(finalexists);
                        break;
                      }
                    }

                    // quests[element][finalexists].cost.forEach(finalcost=>{
                    //     items[finalcost.id].name.toLowerCase()
                    //           .includes(search.toLowerCase())
                    // })
                  });
                  // quests[abc.type][it].cost.filter((itp) =>
                  //           items[itp.id].name
                  //             .toLowerCase()
                  //             .includes(search.toLowerCase())
                  //         )
                  // this.quest_orders[element]
                  temp.push({ type: element, arr: tupa });
                  break;
                }
              }
            }
          });
        });

        console.log(temp);
        // if (temp.length > 0) {
        //   return temp;
        // } else {
        //   return [];
        // }
        // let abc = [];
        // this.active.forEach((active) => {
        //   abc.push({ type: active, arr: this.quest_orders[active] });
        // });
        return temp;
      } else {
        console.log("camer");
        let temp = [];
        this.active.forEach((active) => {
          temp.push({ type: active, arr: this.quest_orders[active] });
        });
        return temp;
      }
      // return this.quest_orders[this.active].filter((it) =>
      //     it.toLowerCase(this.search.toLowerCase())
    },

    // resultValues() {
    //   if (this.search != "") {
    //     let temp = [];

    //     this.active.forEach((activeitem) => {
    //       let allitems = Object.keys(this.items).filter((key) =>
    //         this.items[key].name
    //           .toLowerCase()
    //           .includes(this.search.toLowerCase())
    //       );
    //       let arr = this.quest_orders[activeitem];
    //       console.log(this.quests[activeitem]);
    //       arr.forEach((item) => {
    //         for (
    //           let index = 0;
    //           index < this.quests[activeitem][item].cost.length;
    //           index++
    //         ) {
    //           let obj = allitems.find(
    //             (key) => key == this.quests[activeitem][item].cost[index].id
    //           );
    //           console.log(obj);
    //           if (obj != null) {
    //             temp.push(item);
    //             break;
    //           }
    //         }
    //       });

    //     });
    //     console.log(temp);
    //     if (temp.length > 0) {
    //       return temp;
    //     }
    //   } else {
    //     console.log("camer");
    //     let temp = [];
    //     this.active.forEach((activeitem) => {
    //       temp.push(this.quest_orders[activeitem]);
    //     });
    //     return temp;
    //   }
    // },
  },
  methods: {
    ...mapActions(["fetchUserData"]),
    itemname(item, it) {
      let obj = this.quests[item];
      if (obj != null) {
        let final = obj[it];
        return final;
      } else {
        return { name: "" };
      }
    },

    handleLevelChange(e, item) {
      this.user_data.level[item] = parseInt(e.target.value);
      this.fetchUserData(this.user_data);
    },
    lc_undo_quests(id) {
      this.user_data.completed_quests = this.user_data.completed_quests.filter(
        (it) => it != id
      );
      this.fetchUserData(this.user_data);
    },
    lc_done_quests(id) {
      this.user_data.completed_quests.push(id);
      this.fetchUserData(this.user_data);
    },
    searchResults() {},
    handleChange(e) {
      // this.flag = false;
      let obj = this.active.find((it) => it == e);
      if (obj == null) {
        this.active.push(e);
      }
    },
    getCosts(quests, type, id) {
      let obj = quests[type];
      console.log(type);
      if (obj != null) {
        return obj[id].cost;
      } else {
        return [];
      }
    },
  },
  data() {
    return {
      active: ["prapor"],
      search: "",
      panel: [0],
    };
  },
};
</script>

<style >
.quests-panel .v-expansion-panel-content__wrap {
  padding-right: 0px !important;
  padding-left: 0px !important;
}
.v-text-field__details {
  display: none !important;
}
.v-input__append-outer {
  margin-top: 0px !important;
  align-self: center;
}
</style>