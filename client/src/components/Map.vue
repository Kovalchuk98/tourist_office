<template>
  <div class="container map_wrapper">
    <yandex-map
      :coords="coords"
      :controls="controls"
      :zoom="13"
      @click="onClick"
      ref="map"
    >
      <ymap-marker
        v-for="item in proposals"
        :key="item._id"
        :coords="item.marker.location"
        :marker-id="item._id"
        :hint-content="item.marker.name"
        :icon="markerIcon(item.marker.name)"
        @balloonopen="bindListener(item._id)"
        :balloon-template="balloonTemplate(item)"
      >
      </ymap-marker>
    </yandex-map>
  </div>
</template>

<script>
import { yandexMap, ymapMarker } from "vue-yandex-maps";
import { mapActions, mapGetters } from "vuex";
export default {
  components: {
    yandexMap,
    ymapMarker,
  },
  props: {
    auth: {
      type: Boolean,
    },
  },
  data() {
    return {
      isOpen: true,
      dialog: false,
      location: [],
      cursor: {
        id: "",
        name: "",
        descr: "",
        img: "",
        location: [],
      },
      controls: ["fullscreenControl", "zoomControl"],

      coords: [53.893009, 27.567444],
    };
  },

  computed: {
    ...mapGetters("proposals", ["getProposals"]),
    items() {
      return this.getMarkers;
    },
    proposals() {
      return this.getProposals;
    },
  },
  methods: {
    ...mapActions("proposals", ["removeMarker"]),

    bindListener(id) {
      if (!this.auth) {
        document.getElementById("btn").classList.add("user_btn");
      }
      document.getElementById("btn").addEventListener("click", () => {
        this.remove(id);
      });
    },

    remove(id) {
      this.$refs.map.myMap.balloon.close();
      this.removeMarker({ id });
    },

    markerIcon(payload) {
      return {
        imageSize: [43, 43],
        imageOffset: [0, 0],
        content: payload,
        contentOffset: [0, 15],
        contentLayout: `<h3 class="mt-6">${payload}</h3>`,
      };
    },
    balloonTemplate(marker) {
      return `
        <v-row>
        <h2 class="my-2">${marker.marker.name}</h2>
        <p>I am here: ${marker.marker.location}</p>
        <img src="${this.$axios.defaults.baseURL}/images/${marker.marker.img}" width="300" height="auto">
        <button class="remove_btn" id="btn">Remove marker</button>
        </v-row>
      `;
    },
    onClick(e) {
      if (this.auth) {
        this.location = e.get("coords");
      }
    },
    async create() {
      if (this.cursor.text !== "") {
        await this.createMarker({
          name: this.cursor.name,
          descr: this.cursor.descr,
          img: this.cursor.img,
          location: this.location,
        });
        this.location = [];
        this.dialog = false;
        this.cursor.name = "";
        this.cursor.descr = "";
        this.cursor.img = "";
      }
    },
  },
};
</script>

<style lang="scss">
.ymap-container {
  height: 100%;
}

.map_wrapper {
  overflow: hidden;
  height: 400px;
}

.remove_btn {
  margin: 10px 0 10px 0;
  padding: 5px 10px;
  color: #fff;
  background-color: rgb(158, 14, 14);
}
.user_btn {
  visibility: hidden;
}
</style>
