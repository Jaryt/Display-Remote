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
const mime = require("mime");

export default {
  data() {
    return {
      buffer: 0,
      curIndex: -1,
      curType: "",
      playing: true,
      activeBuffer: Object
    };
  },
  mounted() {
    this.activeBuffer = this.$refs["buffer0"];
    this.$refs.buffer1.classList.toggle("fade");

    const play = () => {
      this.update();

      setTimeout(play, 1000);
    };

    setTimeout(play, 1000);
  },
  methods: {
    update() {
      fetch("http://localhost:5000/playback")
        .then(res => res.json())
        .then(playback => {
          if (
            playback.index == this.curIndex &&
            playback.playing == playback.playing
          ) {
            return;
          }

          let sequence = this.$store.state.media;

          this.activeBuffer.classList.add("fade");
          this.activeBuffer.style.zIndex = 0;

          let media = sequence[playback.index];
          let nextBuffer = this.otherBuffer();

          nextBuffer.style.zIndex = 1;

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

          nextBuffer.classList.remove("fade");

          this.activeBuffer = nextBuffer;
          this.curType = mediaType;
          this.curIndex = playback.index;
          this.playing = playback.playing;
          this.buffer++;
        })
        .catch(e => console.log(e));
    },
    otherBuffer() {
      return this.$refs[`buffer${(this.buffer + 1) % 2}`];
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
