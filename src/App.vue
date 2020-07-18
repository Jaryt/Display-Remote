<template>
  <router-view />
</template>

<script>
import { get } from "./main.js";

export default {
  mounted() {
    setTimeout(this.loadSequence(), 2000);
  },
  methods: {
    loadSequence() {
      get("sequence", res => {
        this.$store.commit("updateSequence", res.sequence || []);
      });
    }
  }
};
</script>

<style scoped>
html {
  margin: 0;
}
</style>