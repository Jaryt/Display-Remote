<template>
  <div class="editor" align="center">
    <ctrlr-upload :complete=fileUploaded />
    <ctrlr-timeline></ctrlr-timeline>
  </div>
</template>

<script>
export default {
  methods: {
    fileUploaded() {
      console.log('hi')
    }
  }

};
</script>

<style scoped>
.editor {
  width: 50%;
  height: 50%;
}
</style>
