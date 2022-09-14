import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

import VueSweetalert2 from 'vue-sweetalert2';

import 'sweetalert2/dist/sweetalert2.min.css';

import infiniteScroll from 'vue3-infinite-scroll-good'

import ToastPlugin from 'vue-toast-notification';

import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'

import 'vue-toast-notification/dist/theme-sugar.css';

import { store } from "./data/store"

createApp(App).use(router).use(VueSweetalert2).use(store).use(ToastPlugin).use(infiniteScroll).mount('#app')
