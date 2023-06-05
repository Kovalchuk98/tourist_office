<template>
  <v-row class="mt-4" @keyup.esc="closeDialog">
    <v-col>
      <div class="d-flex flex-column align-center">
        <div class="text-center">
          <v-dialog
            v-model="dialog"
            fullscreen
            hide-overlay
            transition="dialog-bottom-transition"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="green" large dark v-bind="attrs" v-on="on">
                Create new proposal
              </v-btn>
            </template>
            <v-card>
              {{ fileName }}
              {{ imgName }}
              <v-btn class="ma-2" fab dark @click="closeDialog">
                <v-icon>mdi-close</v-icon>
              </v-btn>
              <v-card-title class="text-h5" :class="classColor">
                {{ !isEdit ? "Create new proposal" : "Edit proposal" }}
              </v-card-title>

              <v-container>
                <h3 class="ma-4">Create proposal</h3>

                <form enctype="multipart/form-data">
                  <v-col cols="12" sm="12">
                    <v-text-field
                      light
                      v-model="form.name"
                      solo
                      label="Name"
                      clearable
                    ></v-text-field>
                    <v-textarea
                      light
                      solo
                      name="input-7-4"
                      label="Description"
                      no-resize
                      v-model="form.descr"
                    ></v-textarea>
                    <v-menu
                      light
                      ref="menu"
                      v-model="menu"
                      :close-on-content-click="false"
                      :return-value="dateFormatted"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="dateFormatted"
                          label="Select days"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        light
                        v-model="date"
                        no-title
                        scrollable
                        multiple
                      >
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="menu = false">
                          Cancel
                        </v-btn>
                        <v-btn
                          text
                          color="primary"
                          @click="$refs.menu.save(dateFormatted)"
                        >
                          OK
                        </v-btn>
                      </v-date-picker>
                    </v-menu>

                    <v-text-field
                      light
                      v-model="form.employee.name"
                      solo
                      label="Employee name"
                      clearable
                    ></v-text-field>
                    <v-text-field
                      light
                      v-model="form.employee.phone"
                      solo
                      label="Phone"
                      clearable
                    ></v-text-field>
                    <v-file-input
                      :label="form.file"
                      ref="fileupload"
                      counter
                      show-size
                      truncate-length="50"
                      accept="application/pdf"
                      @change="onFileChange"
                    />
                  </v-col>
                </form>
                <h3 class="ma-4">Create marker</h3>
                <v-col cols="12" sm="12">
                  <v-text-field
                    light
                    v-model="cursor.name"
                    solo
                    label="Name"
                    clearable
                  ></v-text-field>
                  <v-text-field
                    light
                    v-model="cursor.descr"
                    solo
                    label="Description"
                    clearable
                  ></v-text-field>

                  <v-file-input
                    :label="cursor.img"
                    class="my-2"
                    ref="imgupload"
                    counter
                    show-size
                    truncate-length="50"
                    accept="image/*"
                    @change="onImgChange"
                  />
                  <v-text-field
                    light
                    v-model="cursor.location"
                    solo
                    label="Coords"
                    clearable
                  ></v-text-field>

                  <CreateMap
                    :auth="auth"
                    @getCoords="getCoords"
                    :proposal="cursor"
                  />
                </v-col>

                <v-divider></v-divider>

                <v-card-actions class="py-6">
                  <v-btn color="red" @click="closeDialog">CANCEL</v-btn>
                  <v-spacer></v-spacer>
                  <v-btn v-if="!isEdit" color="primary" @click="addItem"
                    >ОК</v-btn
                  >
                  <v-btn v-else color="primary" @click="updateItem"
                    >UPDATE</v-btn
                  >
                </v-card-actions>
              </v-container>
            </v-card>
          </v-dialog>
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions, mapGetters } from "vuex";
import CreateMap from "./CreateMap.vue";
export default Vue.extend({
  props: {
    item: {
      type: Object,
    },
  },
  components: {
    CreateMap,
  },
  data() {
    return {
      menu: false,
      date: [] as Array<string>,
      dateFormatted: [] as Array<string>,
      form: {
        name: "",
        descr: "",
        employee: {
          name: "",
          phone: "",
        },
        img: "",
        file: "",
      },
      isEdit: false,
      dialog: false,
      selectedFile: [] as File[],
      selectedImg: [] as File[],

      isOpen: true,
      dialog2: false,
      cursor: {
        id: "",
        name: "",
        descr: "",
        img: "",
        location: [],
      },
    };
  },
  computed: {
    ...mapGetters("user", ["isAuth"]),
    fileName(): string {
      return this.selectedFile.length
        ? this.selectedFile?.name
        : this.form.file;
    },
    imgName(): string {
      return this.selectedImg.length ? this.selectedImg?.name : this.cursor.img;
    },
    computedDateFormatted() {
      return this.date.map((item: string) => {
        this.formatDate(item);
      });
    },
    auth: {
      get(): boolean {
        return this.isAuth;
      },
    },
    classColor() {
      return this.isEdit ? "orange" : "green";
    },
  },
  watch: {
    date(val) {
      this.dateFormatted = this.date.map((item: Date) => this.formatDate(item));
    },
  },

  methods: {
    ...mapActions("proposals", ["addProposal", "updateProposal", "uploadFile"]),
    async addItem() {
      if (this.selectedFile.length && this.cursor.location.length) {
        const formData = new FormData() as FormData;
        formData.append("file", this.selectedFile as any);
        formData.append("cimg", this.selectedImg as any);
        formData.append("name", this.form.name);
        formData.append("descr", this.form.descr);
        formData.append("date", JSON.stringify(this.date));
        formData.append("ename", this.form.employee.name);
        formData.append("ephone", this.form.employee.phone);
        formData.append("img", "placeholder.png");
        formData.append("cname", this.cursor.name);
        formData.append("cdescr", this.cursor.descr);
        formData.append("coords", JSON.stringify(this.cursor.location));

        await this.addProposal({
          formData,
        });
        this.clearForm();
        this.dialog = false;
      }
    },
    onFileChange(files: File[]) {
      const selectedFile = files;
      this.selectedFile = selectedFile as File[];
    },
    onImgChange(files: File[]) {
      const selectedImg = files;
      this.selectedImg = selectedImg as File[];
    },

    getCoords(payload: Array<number>) {
      this.cursor.location = payload;
    },

    open() {
      this.isEdit = true;
      this.form.name = this.item.name;
      this.form.descr = this.item.descr;
      this.date = this.computedDateFormatted;
      this.form.employee = this.item.employee;
      this.form.file = this.item.file;
      this.form.img = this.item.img;
      this.cursor.name = this.item.marker.name;
      this.cursor.descr = this.item.marker.descr;
      this.cursor.img = this.item.marker.img;
      this.cursor.location = this.item.marker.location;
      this.dialog = true;
    },
    updateItem() {
      const formData = new FormData() as FormData;
      formData.append("file", this.fileName);
      formData.append("name", this.form.name);
      formData.append("descr", this.form.descr);
      formData.append("date", JSON.stringify(this.date));
      formData.append("ename", this.form.employee.name);
      formData.append("ephone", this.form.employee.phone);
      formData.append("img", this.form.img);
      formData.append("cname", this.cursor.name);
      formData.append("cdescr", this.cursor.descr);
      formData.append("cimg", this.imgName);
      formData.append("coords", JSON.stringify(this.cursor.location));
      this.updateProposal({
        id: this.item._id,
        formData,
      });

      this.dialog = false;
      this.isEdit = false;
      this.clearForm();
    },
    closeDialog() {
      this.dialog = false;
      this.clearForm();
    },
    clearForm() {
      this.form.name = "";
      this.form.descr = "";
      this.date = [];
      this.dateFormatted = [];
      this.form.employee.name = "";
      this.form.employee.phone = "";
      this.form.file = "";
      this.cursor.name = "";
      this.cursor.descr = "";
      this.cursor.img = "";
      this.cursor.location = [];
      this.isEdit = false;
    },
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${day}.${month}.${year}`;
    },
  },
});
</script>

<style></style>
