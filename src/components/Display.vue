<template>
  <div id="display">
    <div class="buffer" ref="buffer0">
      <img hidden ref="image" />
      <video hidden ref="video" />
    </div>

    <div class="buffer" ref="buffer1">
      <img hidden ref="image" />
      <video hidden ref="video" />
    </div>
  </div>
</template>

<script>
const library = require.context("../assets/media/");
import mime from "mime";
import { get } from "../main.js";

export default {
  data() {
    return {
      buffer: 0,
      curIndex: -1,
      index: 0,
      playing: false,
      curType: "",
      activeBuffer: Object,
      otherBuffer: Object
    };
  },
  mounted() {
    this.activeBuffer = this.$refs["buffer0"];
    this.otherBuffer = this.$refs["buffer1"];
    this.otherBuffer.classList.toggle("fade");

    const play = () => {
      this.update();

      setTimeout(play, 1000);
    };

    setTimeout(play, 5000);
  },
  methods: {
    update() {
      if (this.$store.state.isDirty) {
        let sequence = this.$store.state.sequence;
        this.index = ++this.index % sequence.length;

        this.playbackUpdate({ index: this.index, playing: this.playing });
      } else {
        get("playback", this.playbackUpdate);
      }
    },
    playbackUpdate(playback) {
      let sequence = this.$store.state.sequence;

      if (
        (playback.index == this.curIndex &&
          playback.playing == playback.playing) ||
        sequence.length == 0
      ) {
        return;
      }

      this.activeBuffer.classList.add("fade");
      this.activeBuffer.style.zIndex = 0;

      let media = sequence[playback.index];

      let nextBuffer = this.otherBuffer;

      let extension = media.split(".").pop();
      let mediaType = mime.getType(extension).split("/")[0];
      let source;

      if (mediaType === "image") {
        source = nextBuffer.firstChild;
        nextBuffer.lastChild.hidden = true;
      } else {
        source = nextBuffer.lastChild;
        nextBuffer.firstChild.hidden = true;
      }

      source.src = library(`./${media}`);
      source.hidden = false;

      nextBuffer.style.zIndex = 1;
      nextBuffer.classList.remove("fade");

      this.otherBuffer = this.activeBuffer;
      this.activeBuffer = nextBuffer;
      this.curType = mediaType;
      this.curIndex = playback.index;
      this.playing = playback.playing;
      this.buffer++;
    }
  }
};
</script>

<style scoped>
#display {
  background-color: black;
}

.buffer {
  transition: opacity 1s;
  position: absolute;
  width: inherit;
  height: inherit;
  margin: 0 auto;
  right: 0;
  left: 0;
  z-index: inherit;
}

img,
video {
  position: absolute;
  width: inherit;
  height: inherit;
  margin: 0 auto;
  right: 0;
  left: 0;
}

.buffer.fade {
  opacity: 0;
}
</style>
