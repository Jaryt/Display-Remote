<template>
  <div class="timeline" align="center">
    <draggable v-model="media" draggable=".item">
      <div class="item" v-for="element in media" :width="element.length / 6000" :key="element.path">{{element}}</div>
    </draggable>
  </div>
</template>

<script>
import draggable from "vuedraggable";

export default {
  display: "Simple",
  order: 0,
  components: {
    draggable
  },
  mounted() {
  },
  methods: {},
  computed: {
    media: {
      get() {
        return this.$store.state.timeline.media;
      },
      set(media) {
        this.$store.commit("updateMedia", media);
      }
    }
  }
};
</script>

<style scoped>

</style>
