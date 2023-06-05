<template>
  <div>
    <Header />
    <v-container>
      <v-row>
        <v-col md-12>
          <v-img class="ma-auto" :src="img" max-width="500" />
        </v-col>
        <v-col md-12>
          <h1>{{ proposal.name }}</h1>
          <p class="mt-4 text-justify">{{ proposal.descr }}</p>

          <p v-if="itemdate.length > 1" class="mx-2 py-0">
            <span> From: {{ itemdate[0] }} </span>
            <br />
            <span>To: {{ itemdate[itemdate.length - 1] }}</span>
          </p>
          <span class="mx-2" v-else>{{ itemdate[0] }}</span>
        </v-col>
      </v-row>
      <h2 class="text-center my-4" v-if="!proposal.marker.location.length">
        Marker for this proposal not found
      </h2>
      <CreateMap :auth="auth" :proposal="proposal.marker" />
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";
import { ProposalState } from "../types";
import Header from "../components/UI/Header.vue";
import CreateMap from "../components/admin/CreateMap.vue";
export default Vue.extend({
  components: {
    Header,
    CreateMap,
  },
  data() {
    return {
      proposal: {} as ProposalState,
    };
  },
  computed: {
    ...mapGetters("proposals", ["getProposals"]),
    ...mapGetters("user", ["isAuth"]),
    proposals(): Array<ProposalState> {
      return this.getProposals;
    },
    auth() {
      return this.isAuth;
    },
    img(): string {
      return `${this.$axios.defaults.baseURL}/images/${
        (this.proposal as any).img
      }`;
    },
    itemdate: {
      get(): Array<string> {
        const arr = (this.proposal as any).date;
        return arr
          .map(this.reverseDateRepresentation)
          .sort()
          .map(this.reverseDateRepresentation);
      },
    },
  },

  created() {
    this.proposals.map((item) => {
      if (item._id === this.$route.params.id) {
        Object.assign(this.proposal, item);
      }
    });
  },
  methods: {
    reverseDateRepresentation(date: string) {
      let parts = date.split(".");
      return `${parts[0]}.${parts[1]}.${parts[2]}`;
    },
  },
});
</script>
<style></style>
