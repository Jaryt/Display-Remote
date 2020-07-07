<template>
  <div id="display">
    <img class="buffer" ref="buffer0" />
    <img class="buffer" ref="buffer1" />
  </div>
</template>

<script>
const images = require.context("../assets/media/", false, /\.(png|jpe?g|gif)$/i);

export default {
  data() {
    return {};
  },
  props: {},
  mounted() {
    this.$refs.buffer1.classList.toggle("fade");
  },
  methods: {
    update(timeline, playback) {
      let prevBuffer = this.$refs[`buffer${playback.prevBuffer}`];
      let buffer = this.$refs[`buffer${playback.buffer}`];
      let media = timeline.media[playback.index % timeline.media.length];

      prevBuffer.classList.toggle("fade");
      buffer.classList.toggle("fade");

      prevBuffer.style.zIndex = 0;
      buffer.style.zIndex = 1;

      buffer.src = images(media.path);
    }
  }
};
</script>

<style scoped>
.buffer {
  transition: opacity 1s;
  position: absolute;
  width: inherit;
  height: inherit;
  margin: 0 auto;
  right: 0;
  left: 0;
}

.buffer.fade {
  opacity: 0;
}
</style>
