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
    sequence: [
    ],
    isDirty: false
  },
  mutations: {
    updateSequence(state, sequence) {
      state.sequence = sequence;
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
  fetch(`http://localhost:5000/${location}`).then(res => res.json()).then(retrieved);
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

  fetch(`http://localhost:5000/${location}`, options)
    .then(res => res.json())
    .then(retrieved)
    .catch(e => console.log(e));
}