<template>
  <v-app>
    <router-view></router-view>
  </v-app>
</template>

<script>
export default {
  mounted() {
    this.loadSequence();
  },
  methods: {
    loadSequence() {
      fetch("http://localhost:5000/sequence")
        .then(res => res.json())
        .then(media => this.$store.commit("updateMedia", media[0].media));
    },
  },
};
</script>

<style scoped>
html {
  margin: 0;
}
</style>