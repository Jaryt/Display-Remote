<template>
  <div class="editor" align="center">
    <slot />
    <br />
    <ctrlr-library :update="update" :hidden="!editing" ref="library"></ctrlr-library>
    <ctrlr-timeline :update="update"></ctrlr-timeline>
  </div>
</template>

<script>
export default {
  props: {
    editing: Boolean
  },
  methods: {
    update(e, a) {
      let dest = e.to.id;

      if (a === "library" && dest === "sequence") {
        // console.log("a");
      } else if (a === "sequence" && dest === "library") {
        // console.log("b");
      } else {
        // order change
      }
      
      this.$store.commit("setTimelineDirty", true);
    }
  }
};
</script>

<style scoped>
.editor {
  width: 80%;
  height: 50%;
  margin: 0 auto;
}
</style>
