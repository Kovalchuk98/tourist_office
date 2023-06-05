import { Module } from "vuex";
import { RootState, UserState } from "@/types/index";
import http from "@/services/http-common";
import Vue from "vue";
import { AxiosError, AxiosResponse } from "axios";

export const user: Module<UserState, RootState> = {
  namespaced: true,
  state: {
    user: {},
    token: localStorage.getItem("token") || null,
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },
    setToken(state, payload) {
      state.token = payload;
    },
    clearToken(state, payload) {
      state.token = payload;
    },
  },
  actions: {
    async logIn(
      context,
      { username, password }: { username: string; password: string }
    ): Promise<void> {
      await http
        .post("/api/auth/signin", {
          username,
          password,
        })
        .then((res: AxiosResponse) => {
          context.commit("setUser", res.data.user);
          context.commit("setToken", res.data.token);
          localStorage.setItem("token", res.data.token);
        })
        .catch((e: AxiosError) => {
          localStorage.removeItem("token");
          Vue.$toast.warning(e.response?.data.message);
        });
    },

    logOut({ commit }): void {
      commit("setUser", {});
      commit("clearToken", null);
      localStorage.removeItem("token");
    },
  },
  getters: {
    getUser(state) {
      return state.user;
    },
    isAuth(state) {
      return !!state.token;
    },
  },
};
