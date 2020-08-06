<template>
  <div id="actions">
    <button @click="seek(-1)">
      <img src="@/assets/controls/back.png" />
    </button>
    <button @click="togglePause">
      <img :src="playing" />
    </button>
    <button @click="seek(1)">
      <img src="@/assets/controls/forward.png" />
    </button>
  </div>
</template>

<script>
import pause from "@/assets/controls/pause.png";
import play from "@/assets/controls/play.png";
const { get, post } = require("@/main.js");

export default {
  data() {
    return {
      playing: play,
    };
  },
  methods: {
    togglePause() {
      get("toggle", (res) => {
        this.playing = res.playing ? play : pause;
      });
    },
    seek(offset) {
      post("seek", JSON.stringify({ offset }), undefined, "application/json");
    },
  },
  mounted() {
    get("playback", (res) => {
      this.playing = res.playing ? play : pause;
    });
  },
};
</script>

<style scoped>
#actions {
  max-width: 100%;
  margin: 0 auto;
}

button {
  position: relative;
  width: 33.33%;
  height: 10vh;
  padding: 10%;
  border: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

img {
  width: 50%;
}
</style>