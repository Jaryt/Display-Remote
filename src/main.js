import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import Home from './components/Home.vue'
import Display from './components/Display.vue'
import Theatre from './components/Theatre.vue'
import Actions from './components/Actions.vue'
import Upload from './components/Upload.vue'
import Editor from './components/Editor.vue'
import Library from './components/Library.vue'
import Timeline from './components/Timeline.vue'
import VueRouter from 'vue-router'
import vuetify from '@/plugins/vuetify'

Vue.use(Vuex);
Vue.use(VueRouter);

Vue.component('ctrlr-display', Display); // Main display view, can be fit to any container
Vue.component('ctrlr-actions', Actions)
Vue.component('ctrlr-timeline', Timeline); // Allows for precise changes to display data
Vue.component('ctrlr-upload', Upload);
Vue.component('ctrlr-library', Library);
Vue.component('ctrlr-editor', Editor); // 
Vue.config.productionTip = false;
Vue.config.devtools = true;

const routes = [
  { path: '/', component: Home },
  { path: '/theatre', component: Theatre }
]

const store = new Vuex.Store({
  state: {
    timeline: {
      id: 0,
      media: [
        { path: "./20200705_142147.jpg", length: 2000 },
        { path: "./Snapchat-1850851168.jpg", length: 5000 },
      ]
    },
    media: [
      { path: "./20200705_142147.jpg", length: 2000 },
      { path: "./Snapchat-1850851168.jpg", length: 5000 },
      // { path: "./logo.png", length: 1500 }
    ],
    playback: {
      playing: true,
      index: 0,
      buffer: 0,
      prevBuffer: 0,
      timeout: null,
      lastUpdate: Date.now(),
      remaining: 0
    }
  },
  mutations: {
    update(state, payload) {
      let timeline = state.timeline;
      let playback = state.playback;
      let length = timeline.media.length;

      playback.index += payload.seek;

      if (playback.index < 0) {
        playback.index = timeline.media.length - 1;
      } else if (playback.index >= length) {
        playback.index = 0;
      }

      let duration = timeline.media[playback.index].length;

      if (payload.seek === 0) {
        playback.playing = !playback.playing;

        if (playback.playing) {
          let timeout = setTimeout(playback.timeout.play, playback.timeout.remaining);

          playback.timeout = { id: timeout, play: playback.timeout.play }
        } else {
          clearTimeout(playback.timeout.id);

          playback.timeout.remaining = duration - (Date.now() - playback.lastUpdate);
        }
      } else if (playback.playing) {
        if (!payload.play && playback.timeout) {
          clearTimeout(playback.timeout.id);
          let timeout = setTimeout(playback.timeout.play, duration);

          playback.timeout = { id: timeout, play: playback.timeout.play }
        } else {
          let timeout = setTimeout(payload.play, duration);

          playback.timeout = { id: timeout, play: payload.play }
        }

        playback.prevBuffer = playback.buffer;
        playback.buffer = (playback.buffer + 1) % 2;
      } else {
        playback.buffer = (playback.buffer) % 2;
        playback.prevBuffer = (playback.buffer + 1) % 2;
      }

      playback.lastUpdate = Date.now();
    },
    updateMedia(state, media) {
      state.timeline.media = media;
    }
  },
  actions: {
    update({ commit }, payload) {
      commit('update', payload)
    },
    updateMedia({ commit }, payload) {
      commit('updateMedia', payload)
    }
  }
})

const router = new VueRouter({ routes });

new Vue({
  store,
  router,
  vuetify,
  render: (h) => h(App),
}).$mount('#app')
