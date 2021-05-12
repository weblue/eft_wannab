<template>
  <v-card color="basil">
    <v-tabs v-model="tab" background-color="transparent" color="basil" grow>
      <v-tab v-for="item in items" :key="item">
        {{ item }}
      </v-tab>
    </v-tabs>
    <Home v-if="tab == 0" />
    <Barters v-else-if="tab == 1" />
    <Crafting v-if="tab == 2" />
    <Quests v-if="tab == 3" />
  </v-card>
</template>

<script>
import Home from "@/components/Home.vue";
import Quests from "@/components/Quests.vue";
import Barters from "@/components/Barters.vue";
import Crafting from "@/components/Crafting.vue";
import ItemCard from "@/components/cards/ItemCard.vue";

export default {
  components: {
    Home,
    Quests,
    Barters,
    Crafting,
    ItemCard
  },
  data() {
    return {
      tab: null,
      items: ["Home", "Barters", "Crafting", "Quests", "Settings"],
    };
  },
};
</script>