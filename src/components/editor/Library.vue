<template>
  <div id="library">
    <p style="
  text-align: left;">Media Library</p>
    <ctrlr-upload :complete="syncLibrary" />
    <draggable
      id="library"
      :list="library"
      @end="e => { update(e, 'library') }"
      group="media"
      draggable=".item"
    >
      <div class="item" v-for="element in library" :key="element.path">
        <img :src="getImage(element)" />
      </div>
    </draggable>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import { get } from "../../main.js";
import videoThumb from "@/assets/video.png";

export default {
  props: {
    update: Function
  },
  components: {
    draggable
  },
  data() {
    return {
      library: [],
      id: String
    };
  },
  mounted() {
    setTimeout(this.syncLibrary, 2000);
  },
  methods: {
    syncLibrary() {
      let sequence = this.$store.state.sequence;

      get("available", available => {
        if (this.id != available.id) {
          this.id = available.id;
          this.$store.commit("updateMedia");
        }

        let usedMedia = sequence.map(media => media.path);

        if (sequence) {
          this.library = available.media.filter(
            media => !usedMedia.includes(media.path)
          );
        } else {
          this.library = available.media;
        }
      });
    },
    getImage(media) {
      if (media.type.startsWith("video")) {
        return videoThumb;
      }

      return this.$store.state.getMedia(`./${media.path}`);
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