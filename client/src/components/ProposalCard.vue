<template>
  <v-card class="d-flex flex-column ma-2" min-width="200" width="250">
    <v-btn
      v-if="auth"
      fab
      class="ma-1 align-self-end"
      color="white"
      x-small
      text
      light
      @click="deleteItem(proposal)"
      ><v-icon>mdi-close</v-icon></v-btn
    >
    <input
      class="img_input"
      ref="imginput"
      type="file"
      accept="image/*"
      @change="onFileChange($event)"
    />
    <v-hover>
      <template v-slot:default="{ hover }">
        <v-img
          class="black--text align-end"
          height="250px"
          max-height="250px"
          min-width="200"
          :src="img"
        >
          <v-card-title>{{ proposal.name }}</v-card-title>

          <v-fade-transition>
            <v-overlay hover v-if="hover && auth" absolute color="green">
              <v-btn @click="change">Change image</v-btn>
            </v-overlay>
          </v-fade-transition>
        </v-img>
      </template>
    </v-hover>

    <v-text-field
      flat
      :value="proposal.descr"
      label="Description"
      solo
      disabled
      hide-details
    ></v-text-field>

    <p v-if="itemDate.length > 1" class="mx-2 py-0">
      <span> From: {{ itemDate[0] }} </span>
      <br />
      <span>To: {{ itemDate[itemDate.length - 1] }}</span>
    </p>
    <span class="mx-2" v-else>{{ itemDate[0] }}</span>

    <v-card-text class="text--primary">
      <div>{{ proposal.employee.name }}</div>
      <div>{{ proposal.employee.phone }}</div>
    </v-card-text>

    <v-card-actions class="my-1">
      <v-btn color="green" text @click="download(proposal.file)">
        Download
      </v-btn>
      <v-spacer />
      <v-btn
        v-if="auth"
        @click="editItem(proposal._id)"
        fab
        small
        color="orange"
        text
      >
        <v-icon>mdi-pencil </v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import http from "../services/http-common";
import { mapActions, mapGetters } from "vuex";
import { ProposalState } from "../types";
export default Vue.extend({
  props: {
    proposal: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      absolute: true,
      opacity: 0.5,
      overlay: false,
      selectedFile: null,
    };
  },

  computed: {
    ...mapGetters("user", ["isAuth"]),
    fileName(): FormData | null {
      return this.selectedFile !== null ? this.selectedFile : null;
    },

    auth(): boolean {
      return this.isAuth;
    },

    img() {
      return `${http.defaults.baseURL}/images/${this.proposal.img}`;
    },

    itemDate() {
      const arr = this.proposal.date;
      return arr
        .map((item: ProposalState) => this.reverseDateRepresentation(item))
        .sort();
    },
  },
  methods: {
    ...mapActions("proposals", [
      "deleteItemById",
      "downloadFile",
      "updatePreview",
      "updateProposal",
    ]),

    reverseDateRepresentation(date: string) {
      let parts = date.slice(0, 10).split("-").reverse().join(".");
      return parts;
    },

    async uploadPreview(): Promise<void> {
      const formData = new FormData() as FormData;
      formData.append("file", this.selectedFile as any);
      await http.post("/api/files/uploadpreview", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      this.updatePreview({
        id: this.proposal._id,
        img: this.fileName.name,
      });
      this.selectedFile = null;
    },

    download(file: string) {
      try {
        window.open(`${http.defaults.baseURL}/documents/${file}`, "_blank");
      } catch (e) {
        this.$toast.error(e.message);
      }
    },
    deleteItem(payload: any) {
      this.deleteItemById({
        id: payload._id,
        file: payload.file,
      });
    },
    editItem(payload: string) {
      this.$emit("editItem", payload);
    },
    change() {
      (this.$refs.imginput as any).click();
    },
    onFileChange(e: any) {
      const selectedFile = e.target.files[0];
      this.selectedFile = selectedFile as any;
      this.uploadPreview();
    },
  },
});
</script>

<style lang="scss">
.img_input {
  width: 1px;
  height: 1px;
  visibility: hidden;
}
</style>
