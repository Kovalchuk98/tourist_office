<template>
  <div>
    <Header />
    <v-container fluid>
      <v-row v-if="!auth" class="mt-4" align="center" justify="center">
        <v-col cols="12" sm="8" md="6">
          <v-card>
            <v-toolbar color="green" dark flat>
              <v-toolbar-title>Sign In</v-toolbar-title>
              <v-spacer />
            </v-toolbar>
            <v-card-text>
              <v-form>
                <v-text-field
                  dark
                  v-model="form.name"
                  label="Name"
                  name="name"
                  prepend-icon="mdi-account"
                  type="text"
                />
                <v-text-field
                  dark
                  id="password"
                  v-model="form.password"
                  label="Password"
                  name="password"
                  prepend-icon="mdi-lock"
                  type="password"
                />
              </v-form>
            </v-card-text>
            <v-card-actions class="pb-4 d-flex flex-wrap">
              <v-btn color="green" dark class="ml-2" @click="signin">
                Sign In
              </v-btn>
              <v-spacer />
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <v-row v-else>
        <v-col>
          <h2 class="text-center">You`re already signed in</h2>
          <h2 class="text-center">Welcome, Admin</h2>
          <router-link class="m-auto-0" to="/">Home</router-link>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Getter, mapActions, mapGetters } from "vuex";
import { ProposalState } from "../../types/index";
import Header from "../../components/UI/Header.vue";
export default Vue.extend({
  name: "Home",
  components: {
    Header,
  },
  data() {
    return {
      item: {} as ProposalState,
      isEdit: false,
      form: {
        name: "",
        password: "",
      },
    };
  },
  computed: {
    ...mapGetters("user", ["isAuth"]),
    ...mapGetters("proposals", ["getProposals"]),
    auth: {
      get(): boolean {
        return this.isAuth;
      },
    },
    itemdata: {
      get(): ProposalState {
        return this.item;
      },
    },
    proposals: {
      get(): ProposalState {
        return this.getProposals;
      },
    },
  },
  methods: {
    ...mapActions("user", ["logIn"]),
    async signin() {
      await this.logIn({
        username: this.form.name,
        password: this.form.password,
      });
      this.$router.push({ path: "/" });
    },

    editItem(payload: string) {
      this.getProposalById(payload);
      (this.$refs.form as any).open();
    },
  },
});
</script>

<style lang="scss"></style>
