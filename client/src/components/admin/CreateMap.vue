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
        v-if="proposal"
        :coords="proposal.location"
        marker-id="123"
        :hint-content="proposal.name"
        :icon="markerIcon(proposal.name)"
        :balloon-template="balloonTemplate(proposal)"
      >
      </ymap-marker>
    </yandex-map>

    <v-divider> </v-divider>
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
    proposal: {
      type: Object,
    },
  },
  data() {
    return {
      location: [],
      controls: ["fullscreenControl", "zoomControl"],
      coords: [53.893009, 27.567444],
    };
  },

  methods: {
    ...mapActions("proposals", ["removeMarker", "getWeekProposals"]),

    bindListener(id) {
      if (!this.auth) {
        document.getElementById("btn").classList.add("user_btn");
      }
      document.getElementById("btn").addEventListener("click", () => {
        this.location = [];
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
        <h2 class="my-2">${marker.name}</h2>
        <p>I am here: ${marker.location}</p>
        <p>${marker.descr}</p>
        <img src="${this.$axios.defaults.baseURL}/images/${marker.img}" width="300" height="auto">
        </v-row>
      `;
    },
    onClick(e) {
      if (this.auth) {
        this.location = e.get("coords");
        this.$emit("getCoords", this.location);
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
