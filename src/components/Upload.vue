<template>
  <div class="container">
    <label>
      {{ status }}
      <input type="file" id="files" ref="files" multiple @change="onSelect()" />
    </label>
    <button @click="submitFiles()">Submit</button>
  </div>
</template>

<script>
import { post } from "../main.js";
// import axios from "axios";

export default {
  data() {
    return {
      status: "Upload media:",
      files: []
    };
  },
  props: {
    complete: Function
  },
  methods: {
    submitFiles() {
      let formData = new FormData();

      this.files.forEach(file => {
        formData.append(`files`, file);
      });

      this.status = "Uploading... Please wait.";

      // axios.post('http://localhost:5000/upload', formData,)

      post(
        "upload",
        formData,
        (e) => {
          console.log(e);

          this.status = "Upload complete.";
          setTimeout(() => {
            this.status = "Upload media:";
          }, 10000);
          setTimeout(this.complete, 1000);
        },
        undefined
      );
    },

    onSelect() {
      this.files = this.$refs.files.files;
    }
  }
};
</script>
