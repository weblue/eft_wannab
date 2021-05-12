<template>
    <div>
        <v-container fluid>
            <!-- {{ panel }} -->
            <v-expansion-panels v-model="panel" multiple>
                <!-- @click.prevent="onClick()" -->
                <v-expansion-panel @click="handleChange(item)" v-model="flag" v-for="(item, i) in traders.filter(
                        (itm) => itm != 'intelligence_center'
                    )" :key="i">
                    <!-- @click.prevent="onClick(i)" -->
                    <v-expansion-panel-header>
                        <template v-slot:actions>
                            <div @click.stop="onClick()">
                                Level
                                <input type="number" :max="max_levels[item]" @change="handleLevelChange($event, item)" v-model="user_data.level[item]" :id="item" class="ml-2 dark-mode-text-field" style="max-width: 50px" />
                            </div>
                            <!-- <v-btn icon @click.stop="onClick()">
                <v-icon>mdi-filter-variant</v-icon>
              </v-btn> -->
                        </template>
                        <img :src="'images/traders/' + trader_images[item]" style="max-width: 50px" alt="" />
                        <span class="ml-1">{{item.replace(/\b\w/g, (l) => l.toUpperCase())}}</span>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content v-model="flag">
                        <v-row class="mt-3">
                            <v-col v-for="(it, j) in getTradeInnerCards.filter((ilk) => ilk.type == item)" :key="j" cols="12" :md="it.cost.length < 3 ? 4 : 6">
                                <v-card shadow class="d-flex pa-4" style="border: 1px solid #dcdcdc; justify-content: space-around;">
                                    <div class="d-flex">
                                        <div v-for="(sub_item, l) in it.cost" :key="l" class="d-flex" style="align-items: center; justify-content: center;">
                                            <item-card :item="items[sub_item.id]" :count="sub_item.count"></item-card>
                                            <i style="margin-right: 15px; margin-left: 15px;" v-if="l != it.cost.length - 1" class="fas fa-2x fa-plus"></i>
                                        </div>
                                    </div>
                                    <i class="align-self-center fas fa-4x fa-long-arrow-alt-right"></i>
                                    <div class="d-flex" style="align-items: center; justify-content: center;">
                                        <item-card :item="items[it.reward.id]"> </item-card>
                                    </div>

                                    <div class="align-self-center">
                                        <v-btn v-if="it.exists == false" @click="addWishTrades(it.key)" class="mx-2" fab dark x-small color="pink">
                                            <v-icon dark> mdi-heart </v-icon>
                                        </v-btn>

                                        <v-btn @click="removeWishTrades(it.key)" class="mx-2" v-else fab dark x-small color="pink">
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
import ItemCard from "./cards/ItemCard.vue";
export default {
    name: "Barters",
    components: { "item-card": ItemCard },
    computed: {
        ...mapGetters([
            "trades",
            "traders",
            "max_levels",
            "trader_images",
            "user_data",
            "items"
        ]),
        // inter,
        getTradeInnerCards() {
            let temp = [];
            if (this.panel == undefined || this.panel == 0) {
                this.panel = [0];
            }
            this.active.forEach(activeitem => {
                // console.log(this.user_data.level[this.traders[activeitem]]);
                // console.log(this.traders[activeitem]);
                for (
                    let index = 0;
                    index < this.user_data.level[activeitem];
                    index++
                ) {
                    Object.keys(this.trades[activeitem][index + 1]).forEach(
                        key => {
                            let obj = this.user_data.wish_trades.find(
                                temp_key => temp_key == key
                            );
                            // console.log(obj);
                            if (obj == null) {
                                temp.push({
                                    ...this.trades[activeitem][index + 1][key],
                                    key: key,
                                    type: activeitem,
                                    exists: false
                                });
                            } else {
                                temp.push({
                                    ...this.trades[activeitem][index + 1][key],
                                    key: key,
                                    type: activeitem,
                                    exists: true
                                });
                            }
                        }
                    );
                }
            });

            return temp;
        }
    },
    created() {
        //console.log(this.getTradeInnerCards);
    },
    methods: {
        ...mapActions(["fetchUserData"]),
        abc(e) {
            //console.log(e);
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
                its => its != id
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
            let obj = this.active.find(it => it == e);
            if (obj == null) {
                this.active.push(e);
            } else {
                let index = this.active.findIndex(i => i == e);
                this.active.splice(index, 1);
            }
        },
        calcRes(src) {
            var img = new Image();
            img.src = src;

            img.onload = () => {
                console.log(
                    "image %s has width: %s and height: %s",
                    src,
                    img.width,
                    img.height
                );

                return { w: img.width, h: img.height };
            };
        }
    },
    data() {
        return {
            panel: [0],
            flag: false,
            active: ["prapor"]
            // items: ["Prapor", "Therapist", "Skier", "Peacekeeper", "Mechanic"],
        };
    }
};
</script>