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
import { get } from "../main.js";

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
      let sequence = this.$store.state.sequence;

      get("available", available => {
        if (sequence) {
          this.library = available.filter(media => !sequence.includes(media));
        } else {
          this.library = available;
        }
      });
    },
    getImage(path) {
      return images("./" + path);
    }
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
}
</style>