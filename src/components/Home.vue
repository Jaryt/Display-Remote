<template>
  <div id="display-remote">
    <div :hidden="editing" id="preview">
      <ctrlr-display ref="display"></ctrlr-display>
      <ctrlr-actions @on-seek="onSeek"></ctrlr-actions>
    </div>
    <ctrlr-editor :editing="editing">
      <button @click="editing = !editing">Toggle Sequence Editor</button>
    </ctrlr-editor>
  </div>
</template>

<script>
export default {
  mounted() {
    const play = () => {
      // const timeline = this.$store.state.timeline;
      // const playback = this.$store.state.playback;
      // this.$store.dispatch("update", { seek: 1, play });
      // this.$refs.display.update(timeline, playback);
    };

    play();
  },
  data() {
    return {
      editing: false
    };
  },
  methods: {
    onSeek() {
      // const payload = {
      //   seek: num
      // };
      // this.$store.dispatch("update", payload);
      // if (num != 0) {
      //   const timeline = this.$store.state.timeline;
      //   const playback = this.$store.state.playback;
      //   // this.$refs.display.update(timeline, playback);
      // }
    }
  },
  computed: {
    media: {
      get() {
        return this.$store.state.media;
      },
      set(media) {
        this.$store.commit("updateMedia", media);
      }
    }
  }
};
</script>

<style scoped>
#display-remote {
  margin: 0 auto;
  align-content: center;
}

#display {
  position: relative;
  height: 35vh;
}

#preview {
  width: 80%;
  height: 50vh;
  margin: 0 auto;
  overflow: hidden;
}

</style>
