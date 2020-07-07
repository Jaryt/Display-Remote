<template>
  <ctrlr-display ref="display"></ctrlr-display>
</template>

<script>
export default {
  mounted() {
    const play = () => {
      const timeline = this.$store.state.timeline;
      const playback = this.$store.state.playback;

      this.$store.dispatch("update", { seek: 1, play });

      this.$refs.display.update(timeline, playback);
    };

    play();
  }
};
</script>

<style scoped>
html * {
  background-color: black;
}

#display {
  height: 100%;
}
</style>