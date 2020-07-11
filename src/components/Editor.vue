<template>
  <div class="editor" align="center">
    <slot />
    <br />
    <ctrlr-library :hidden="!editing" ref="library"></ctrlr-library>
    <ctrlr-timeline></ctrlr-timeline>
  </div>
</template>

<script>
export default {
  props: {
    editing: Boolean
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
