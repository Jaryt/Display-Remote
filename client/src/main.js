import Vue from 'vue'
import Vuex from 'vuex'
import mime from "mime";
import App from './App'
import Home from './components/Home.vue'
import Display from './components/player/Display.vue'
import Theatre from './components/player/Theatre.vue'
import Actions from './components/player/Actions.vue'
import Upload from './components/editor/Upload.vue'
import Editor from './components/editor/Editor.vue'
import Library from './components/editor/Library.vue'
import Timeline from './components/editor/Timeline.vue'
import VueRouter from 'vue-router'

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

const server = "http://localhost:5000/";
// const server = "http://192.168.4.1:5000/";

const routes = [
  { path: '/', component: Home },
  { path: '/theatre', component: Theatre }
]

const store = new Vuex.Store({
  state: {
    sequence: [
    ],
    tracker: "",
    isDirty: false,
    getMedia() {
      console.log('No media loaded!');
    }
  },
  mutations: {
    updateSequence(state, res) {
      state.sequence = res.sequence;
      state.tracker = res.tracker;
    },
    updateMedia(state) {
      state.getMedia = (path) => {
        return `${server}static/${path}`
      };
    },
    setTimelineDirty(state, isDirty) {
      state.isDirty = isDirty;
    }
  },
})

const router = new VueRouter({ routes });

new Vue({
  store,
  router,
  render: (h) => h(App),
}).$mount('#app')

export function get(location, retrieved) {
  fetch(server + location)
    .then(res => res.json())
    .then(retrieved)
    .catch(e => console.log(`FROM get: ${location}`, e));
}

export function post(location, obj, retrieved, type) {
  const options = {
    method: "POST",
    body: obj,
    headers: {
      'Accept': 'application/json',
    }
  };

  if (type) {
    options.headers['Content-Type'] = type;
  }

  fetch(server + location, options)
    .then(res => res.json())
    .then(e => {
      console.log(e, location)
      retrieved(e);
    })
    .catch(e => console.log(e));
}

export function getType(media) {
  return mime.getType(media);
}