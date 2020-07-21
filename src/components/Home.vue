<template>
  <div id="display-remote">
    <div :hidden="editing" id="preview">
      <ctrlr-display ref="display" getMedia></ctrlr-display>
      <ctrlr-actions v-if="controls"></ctrlr-actions>
      <div v-else>
        <h1>Controller disabled!</h1>
        <p>Please save changes to timeline to continue controlling main display.</p>
      </div>
    </div>
    <ctrlr-editor :editing="editing" getMedia>
      <button @click="editing = !editing">Toggle Sequence Editor</button>
    </ctrlr-editor>
  </div>
</template>

<script>
export default {
  data() {
    return {
      editing: false
    };
  },
  computed: {
    controls() {
      return !this.$store.state.isDirty;
    },
  },
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
