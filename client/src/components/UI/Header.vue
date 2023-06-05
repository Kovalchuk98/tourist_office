<template>
  <div>
    <v-navigation-drawer v-model="drawer" app temporary>
      <v-list dense class="navigation_menu">
        <v-app-bar-nav-icon class="close_btn" @click="drawer = !drawer">
          <v-icon> mdi-close </v-icon>
        </v-app-bar-nav-icon>

        <div v-if="auth" class="d-flex flex-column align-center mt-4">
          <v-img
            class="rounded-circle"
            src="../../assets/noavatar.png"
            height="60"
            width="60"
            contain
          />
          <span class="span_name mt-1 mb-4">admin</span>
        </div>
        <v-list-item
          v-show="!auth"
          :class="{ 'mt-8': !auth }"
          link
          @click="$router.push({ path: 'admin/signin' })"
        >
          <v-list-item-action>
            <v-icon>mdi-login-variant</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Sign In</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-show="auth" link @click="logout">
          <v-list-item-action>
            <v-icon>mdi-logout-variant</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Log Out</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar color="grey darken-4" dark app clipped-left>
      <v-app-bar-nav-icon
        v-if="$vuetify.breakpoint.smAndDown"
        @click.stop="drawer = !drawer"
      />
      <router-link
        class="d-flex align-center"
        to="/"
        style="text-decoration: none; color: #fff"
      >
        <v-img
          class="rounded-circle mx-4"
          src="../../assets/logo.png"
          max-height="40"
          max-width="40"
          contain
        />
        <v-toolbar-title>Tourist Office</v-toolbar-title>
      </router-link>

      <v-spacer />
      <template v-if="$vuetify.breakpoint.mdAndUp && auth">
        <template>
          <div
            v-if="auth && $vuetify.breakpoint.mdAndUp"
            class="d-flex align-center mr-5"
          >
            <v-img
              class="rounded-circle"
              src="../../assets/noavatar.png"
              max-height="40"
              max-width="40"
              contain
            />
            <span class="ml-2">admin</span>
          </div>
        </template>
        <v-btn
          v-show="!auth && $route.path === '/admin'"
          class="btn primary mr-4 green accent-4 rounded-pill"
          @click="$router.push({ path: '/admin/signin' })"
        >
          Sign In
        </v-btn>

        <v-btn
          v-show="auth"
          class="btn primary red accent-4 rounded-pill pa-3"
          @click="logout"
        >
          Log Out
        </v-btn>
      </template>
    </v-app-bar>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions, mapGetters } from "vuex";
export default Vue.extend({
  data: () => ({
    drawer: false,
  }),
  computed: {
    ...mapGetters("user", ["isAuth"]),
    auth: {
      get(): boolean {
        return this.isAuth;
      },
    },
  },
  methods: {
    ...mapActions("user", ["logOut"]),
    async logout(): Promise<void> {
      await this.logOut();
    },
  },
});
</script>

<style lang="scss" scoped>
.navigation_menu {
  position: relative;
  .close_btn {
    position: absolute;
    right: 3%;
  }
}
</style>
