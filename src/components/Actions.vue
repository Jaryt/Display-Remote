<template>
  <div id="actions">
    <button @click="$emit('on-seek', -1)">
      <img src="../assets/controls/back.png" />
    </button>
    <button @click="togglePause">
      <img :src="playing" />
    </button>
    <button @click="$emit('on-seek', 1)">
      <img src="../assets/controls/forward.png" />
    </button>
  </div>
</template>

<script>
import pause from "../assets/controls/pause.png";
import play from "../assets/controls/play.png";

export default {
  data() {
    return {
      playing: this.$store.state.playback.playing ? play : pause
    };
  },
  methods: {
    togglePause() {
      this.$emit("on-seek", 0);
      this.playing = this.$store.state.playback.playing ? play : pause;
    }
  }
};
</script>

<style scoped>
#actions {
  max-width: 80%;
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
  width: 90%;
}
</style>