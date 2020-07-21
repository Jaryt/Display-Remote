<template>
  <div id="timeline">
    <p style="
  text-align: left;">Timeline</p>
    <draggable
      id="sequence"
      :list="sequence"
      @end="e => { update(e,'sequence')}"
      group="media"
      draggable=".item"
    >
      <div class="item" v-for="element in sequence" :key="element.path">
        <img :src="getImage(element)" />
      </div>
    </draggable>
    <div :hidden="sequence.length != 0">
      <h1>Timeline is empty!</h1>
      <p>Click the "edit" button, and drag media from the library in the desired order.</p>
    </div>
    <button @click="save()">Save Sequence</button>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import { post } from "@/main.js";
import videoThumb from "@/assets/video.png";

export default {
  components: {
    draggable
  },
  props: {
    update: Function
  },
  methods: {
    getImage(media) {
      if (media.type.startsWith("video")) {
        return videoThumb;
      }

      return this.$store.state.getMedia(`./${media.path}`);
    },
    save() {
      post(
        "sequence",
        JSON.stringify({ sequence: this.sequence }),
        undefined,
        "application/json"
      );

      this.$store.commit("setTimelineDirty", false);
    }
  },
  computed: {
    sequence() {
      return this.$store.state.sequence;
    },
    displaySequence() {
      return this.$store.state.sequence;
    }
  }
};
</script>

<style scoped>
#timeline {
  width: 100%;
  min-height: 50vh;
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