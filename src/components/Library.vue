<template>
  <div id="library">
    <ctrlr-upload :complete="syncLibrary" />
    <draggable
      id="library"
      :list="library"
      @end="e => { update(e, 'library') }"
      group="media"
      draggable=".item"
    >
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
    update: Function
  },
  components: {
    draggable
  },
  data() {
    return {
      library: this.syncLibrary()
    };
  },
  updated() {
    setTimeout(this.syncLibrary, 1000);
  },
  methods: {
    syncLibrary() {
      let sequence = this.$store.state.media;

      fetch("http://localhost:5000/available")
        .then(res => res.json())
        .then(available => {
          let wholeLib = JSON.parse(available);

          this.library = wholeLib.filter(media => !sequence.includes(media));
        }).catch(e =>console.log(e));
    },
    getImage(path) {
      return images("./" + path);
    }
  },
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