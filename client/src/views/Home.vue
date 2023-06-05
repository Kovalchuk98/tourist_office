<template>
  <div>
    <Header />
    <Calendar
      :dates="dates"
      :week="week"
      @prevWeek="prevWeek"
      @nextWeek="nextWeek"
    />
    <CreateProposal ref="form" :item="itemdata" />
    <ProposalList :proposals="proposals" @editItem="editItem" />
    <h2 class="text-center" v-if="!proposals.length">
      No proposals on this week
    </h2>
    <Map />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Map from "../components/Map.vue";
import ProposalList from "../components/ProposalList.vue";
import CreateProposal from "../components/admin/CreateProposal.vue";
import Header from "../components/UI/Header.vue";
import Calendar from "../components/Calendar.vue";
import getWeek from "../utils/calendar";
import { ProposalState } from "../types/index";
import { mapGetters } from "vuex";
export default Vue.extend({
  name: "Home",
  components: {
    Map,
    Header,
    ProposalList,
    Calendar,
    CreateProposal,
  },
  data() {
    return {
      dates: [] as Array<string>,
      week: 0,
      item: {} as ProposalState,
      isEdit: false,
    };
  },
  created() {
    this.getCurrentWeek();
    this.fetchForWeek();
  },
  computed: {
    ...mapGetters("proposals", ["getProposals"]),
    proposals: {
      get(): ProposalState {
        return this.getProposals;
      },
    },
    itemdata: {
      get(): ProposalState {
        return this.item;
      },
    },
  },
  watch: {
    week: {
      handler: "getCurrentWeek",
      immediate: true,
    },
  },
  methods: {
    async prevWeek() {
      this.week = this.week - 1;
      this.getCurrentWeek();
      await this.fetchForWeek();
    },
    async nextWeek() {
      this.week = this.week + 1;
      this.getCurrentWeek();
      await this.fetchForWeek();
    },
    async fetchForWeek() {
      await this.$store.dispatch("proposals/getWeekProposals", {
        start: this.dates[0],
        end: this.dates[this.dates.length - 1],
      });
    },
    getCurrentWeek() {
      this.dates = getWeek(this.week);
    },
    editItem(payload: string) {
      this.getProposalById(payload);
      (this.$refs.form as any).open();
    },
    getProposalById(payload: string) {
      const obj = this.proposals as any;
      const ndata = obj.find((item: any) => item._id == payload);
      Object.assign(this.item, ndata);
    },
  },
});
</script>
