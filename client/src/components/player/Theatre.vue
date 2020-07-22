<template>
  <div class="container">
    <ctrlr-display ref="display" id="display"></ctrlr-display>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  background-color: black;
  position: absolute;
}

#display {
  position: absolute;
  height: inherit;
  left: 0;
  right: 0;
  object-fit: scale-down;
}
</style>