<template>
  <v-container>
    <v-col>
      <v-row class="my-2">
        <AdminCard
          v-for="proposal in proposals"
          :key="proposal._id"
          :proposal="proposal"
          @editItem="editItem"
        />
      </v-row>
    </v-col>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import AdminCard from "./ProposalCard.vue";
export default Vue.extend({
  components: {
    AdminCard,
  },
  props: {
    proposals: {
      type: Array,
      required: true,
    },
  },
  methods: {
    editItem(payload: string) {
      this.$emit("editItem", payload);
    },
  },
});
</script>

<style></style>
