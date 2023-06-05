<template>
  <v-row class="justify-center my-2">
    <h2 class="mx-2 text-center">Proposals for this week:</h2>
    <div class="d-flex align-center">
      <v-btn class="mx-1" text fab x-small @click="prevWeek">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>

      <h3 class="week pa-1" :class="{ current_week: week === 0 }">
        {{ dates[0] }} - {{ dates[dates.length - 1] }}
      </h3>
      <v-btn class="mx-1" text fab x-small @click="nextWeek">
        <v-icon>mdi-arrow-right</v-icon></v-btn
      >
    </div>
  </v-row>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: {
    week: {
      type: Number,
      required: true,
    },
    dates: {
      type: Array,
      required: true,
    },
  },
  methods: {
    prevWeek() {
      this.$emit("prevWeek");
    },
    nextWeek() {
      this.$emit("nextWeek");
    },
  },
});
</script>

<style lang="scss">
.week {
  border-radius: 0.75rem;
}
.current_week {
  color: orangered;
}
</style>
