<template>
  <div id="timeline">
    <draggable
      id="sequence"
      :list="media"
      @end="e => { update(e,'sequence')}"
      group="media"
      draggable=".item"
    >
      <div class="item" v-for="element in media" :key="element">
        <img :src="getImage(element)" />
      </div>
    </draggable>
    <div :hidden="media.length != 0">
      <h1>Timeline is empty!</h1>
      <p>Click the "edit" button, and drag media from the library in the desired order.</p>
    </div>
    <button @click="save()">Save Sequence</button>
  </div>
</template>

<script>
import draggable from "vuedraggable";

const images = require.context("../assets/media/");

export default {
  components: {
    draggable
  },
  props: {
    update: Function
  },
  methods: {
    getImage(path) {
      return images("./" + path);
    },
    save() {
      const options = {
        method: "POST",
        body: JSON.stringify({ media: this.media }),
        headers: {
          "Content-Type": "application/json"
        }
      };

      fetch("http://localhost:5000/sequence", options)
        .then(res => res.json())
        .then(res => console.log(res));
    }
  },
  computed: {
    media() {
      return this.$store.state.media;
    }
  }
};
</script>

<style scoped>
#timeline {
  width: 100%;
  min-height: 40vh;
  background: #888888;
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
  display: inline-block;
}
</style>