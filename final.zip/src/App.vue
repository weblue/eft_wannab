<template>
  <v-app id="app">
    <!-- <div id="nav"> -->
    <v-main>
      <!-- <v-tabs v-model="tab" fixed-tabs>
        <v-tab>Home</v-tab>
        <v-tab>Barters</v-tab>
        <v-tab>Crafting</v-tab>
        <v-tab>Quests</v-tab>
        <v-tab>Settings</v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item v-for="i in 3" :key="i" :value="'tab-' + i">
          <v-card flat>
            <v-card-text
              >{{ tab }}
              <p class="text-white">"fuckkssp</p>
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs-items> -->
      <router-view />
    </v-main>

    <!-- </div> -->
  </v-app>
</template>
<script>
import { mapActions } from "vuex";
// import trades from "../docs/assets/trades.json";
export default {
  data() {
    return {};
  },
  methods: {
    ...mapActions(["fetchJsonData", "fetchUserData"]),
  },
  created() {
    this.fetchJsonData();
    this.fetchUserData();
    // console.log(trades);
  },
};
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.v-input--selection-controls {
  margin-top: 0px !important;
}
.text-underline {
  text-decoration: underline;
}
.align-self-center {
  align-self: center;
}
.jc-sa {
  justify-content: space-around !important;
}
.row {
  width: 100%;
  margin: 0px !important;
}

.dark-mode-text-field {
  color: white;
  border-radius: 5px;
  border: 1px solid white;
  width: 50px;
}
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  opacity: 1;
}

.pos-rel {
  position: relative;
}
.pos-abs {
  position: absolute;
}
.v-slide-group__prev {
  display: none !important;
}

/* Desktops and laptops ----------- */
@media only screen and (min-width: 1224px) {
  .wd-28 {
    width: 28%;
  }
}
/* Large screens ----------- */
@media only screen and (min-width: 1824px) {
  .wd-28 {
    width: 28%;
  }
}
/* Smartphones (portrait and landscape) ----------- */
@media only screen and (min-device-width: 320px) and (max-device-width: 480px) {
  .mob-wids {
    flex: 0 0 190% !important;
    max-width: 190% !important;
  }
  .v-expansion-panel-content__wrap {
    padding: 0px !important;
  }
}
.bgyellow {
  background: yellow;
  color: black;
}
</style>
