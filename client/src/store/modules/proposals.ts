import { Module } from "vuex";
import { RootState, ProposalState, ProposalSt } from "@/types/index";
import http from "@/services/http-common";
import axios from "axios";
import Vue from "vue";
import { Prop } from "vue/types/options";

export const proposals: Module<ProposalSt, RootState> = {
  namespaced: true,
  state: {
    proposals: [] as Array<ProposalState>,
  },
  mutations: {
    setProposals(state, payload) {
      state.proposals = payload;
    },
    setPreview(state, { id, img }: { id: string; img: string }) {
      state.proposals?.map((item: ProposalState) => {
        if (item._id === id) {
          item.img = img;
        }
      });
    },
    setProposal(state, { id, formData }: { id: string; formData: FormData }) {
      state.proposals?.map((item: ProposalState) => {
        if (item._id === id) {
          item.name = formData.get("name")?.toString();
          item.descr = formData.get("descr")?.toString();
          item.employee = {
            name: formData.get("ename")!.toString(),
            phone: formData.get("ephone")!.toString(),
          };
          item.img = formData.get("img")?.toString();
          item.marker = {
            name: formData.get("cname")?.toString(),
            descr: formData.get("cdescr")?.toString(),
            img: formData.get("cimg")?.toString(),
          };
          item.file = formData.get("file")?.toString();
        }
      });
    },
  },
  actions: {
    async addProposal(
      context,
      {
        formData,
      }: {
        formData: FormData;
      }
    ) {
      await http
        .post("/api/proposal/", formData)
        .then((res) => {
          Vue.$toast.success(res.data.message);
        })
        .catch((e) => {
          Vue.$toast.error(e.response.data.message);
        });
    },

    async getWeekProposals(
      context,
      { start, end }: { start: string; end: string }
    ) {
      await http
        .get(`/api/proposal/week`, {
          params: {
            start,
            end,
          },
        })
        .then((res) => {
          context.commit("setProposals", res.data);
        });
    },

    async updatePreview(
      context,
      {
        id,
        img,
      }: {
        id: string;
        img: string;
      }
    ) {
      await http
        .post(`/api/proposal/${id}/preview`, {
          id,
          img,
        })
        .then((res) => {
          Vue.$toast.success(res.data.message);
        })
        .catch((e) => {
          Vue.$toast.warning(e.response.data.message);
        });
      context.commit("setPreview", { id, img });
    },

    async updateProposal(
      context,
      {
        id,
        formData,
      }: {
        id: string;
        formData: FormData;
      }
    ) {
      await http
        .patch(`/api/proposal/${id}`, formData)
        .then((res) => {
          Vue.$toast.success(res.data.message);
        })
        .catch((e) => {
          Vue.$toast.warning(e.response.data.message);
        });
      context.commit("setProposal", { id, formData });
    },
    async removeMarker(context, { id }: { id: string }) {
      await http.delete(`/api/proposal/marker/${id}`);
    },

    async deleteItemById(context, { id, file }: { id: string; file: string }) {
      await http
        .delete(`/api/proposal/${id}`)
        .then((res) => {
          Vue.$toast.success(res.data.message);
        })
        .catch((e) => {
          Vue.$toast.warning(e.response.data.message);
        });
      context.dispatch("deleteFile", file);
      const array = context.state.proposals?.filter(
        (item: ProposalState) => item._id !== id
      );
      context.commit("setProposals", array);
    },
    async deleteFile(context, file: string) {
      await http
        .post("/api/files/deletefile", { file })
        .then((res) => {
          Vue.$toast.success(res.data.message);
        })
        .catch((e) => {
          Vue.$toast.warning(e.response.data.message);
        });
    },
  },
  getters: {
    getProposals(state) {
      return state.proposals;
    },
  },
};
