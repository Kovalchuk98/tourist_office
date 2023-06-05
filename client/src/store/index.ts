import Vue from "vue";
import Vuex, { StoreOptions } from "vuex";
import { user } from "@/store/modules/user";
import { proposals } from "@/store/modules/proposals";
import { RootState } from "@/types";

Vue.use(Vuex);

const store: StoreOptions<RootState> = {
  state: {
    version: "1.0",
  },
  modules: {
    user,
    proposals,
  },
};
export default new Vuex.Store<RootState>(store);
