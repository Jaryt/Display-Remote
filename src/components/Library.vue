<template>
  <div id="library">
    <ctrlr-upload :complete=syncLibrary />
    <draggable :list="library" group="media" draggable=".item">
      <div class="item" v-for="element in library" :key="element">
          <img :src="getImage(element)" />
      </div>
    </draggable>
  </div>
</template>

<script>
import draggable from "vuedraggable";

const images = require.context("../assets/media/");

export default {
  props: {
    sequence: Array
  },
  components: {
    draggable
  },
  data() {
    return {
      library: []
    };
  },
  mounted() {
    this.syncLibrary();
  },
  methods: {
    syncLibrary() {
      fetch("http://192.168.1.4:5000/available").then(res => {
        res.json().then(library => {
          this.library = JSON.parse(library);
        });
      });
    },
    getImage(path) {
      return images("./" + path);
    },
  }
};
</script>

<style scoped>
#library {
  width: 100%;
  min-height: 40vh;
  background: #eeeeee;
}

.item {
  height: 100%;
  padding: 1%;
  display: inline-flex;
}

img {
  width: 10vh;
  height: 10vh;
  object-fit: scale-down;
  background: black;
  align: left;
}
</style>