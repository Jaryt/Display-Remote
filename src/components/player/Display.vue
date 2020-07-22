<template>
  <div id="display">
    <div class="buffer" ref="buffer0">
      <img hidden ref="image" />
      <video hidden ref="video" :paused="!playing">
        <!-- <source ref="source" v-if=test/> -->
      </video>
    </div>

    <div class="buffer" ref="buffer1">
      <img hidden ref="image" />
      <video hidden ref="video" :paused="!playing" />
    </div>
  </div>
</template>

<script>
import { get } from "@/main.js";

export default {
  data() {
    return {
      buffer: 0,
      curIndex: -1,
      index: 0,
      playing: false,
      curType: "",
      sequenceID: "",
      activeSource: Object,
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

    setTimeout(play, 2000);
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
      if (
        this.$store.state.tracker != playback.id &&
        !this.$store.state.isDirty
      ) {
        get("sequence", res => {
          this.$store.commit("updateSequence", {
            sequence: res.sequence || [],
            tracker: playback.id
          });
        });
      }

      let sequence = this.$store.state.sequence;

      if (sequence.length == 0) {
        return;
      }

      if (playback.playing != this.playing) {
        if (this.activeSource.nodeName === "VIDEO") {
          if (playback.playing) {
            this.activeSource.play();
          } else {
            this.activeSource.pause();
          }
        }

        this.playing = playback.playing;
      }

      if (playback.index != this.curIndex) {
        this.activeBuffer.classList.add("fade");
        this.activeBuffer.style.zIndex = 0;

        let media = sequence[playback.index];
        let mediaType = media.type;

        let nextBuffer = this.otherBuffer;
        let isImage = mediaType.startsWith("image");
        let source = isImage ? nextBuffer.firstChild : nextBuffer.lastChild;

        nextBuffer.firstChild.hidden = !isImage;
        nextBuffer.lastChild.hidden = isImage;

        source.src = this.$store.state.getMedia(`./${media.path}`);

        if (
          mediaType.startsWith("video") &&
          !source.playing &&
          playback.playing
        ) {
          source.play();
        }

        nextBuffer.style.zIndex = 1;
        nextBuffer.classList.remove("fade");

        this.activeSource = source;
        this.otherBuffer = this.activeBuffer;
        this.activeBuffer = nextBuffer;
        this.curType = mediaType;
        this.curIndex = playback.index;
        this.buffer++;
      }

      this.changeNum = playback.changeNum;
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
