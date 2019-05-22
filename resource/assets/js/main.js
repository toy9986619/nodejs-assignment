import Vue from 'vue';
import VueRouter from 'vue-router';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import App from './App.vue';
import Home from './component/Home.vue';
import ErrorPage from './component/ErrorPage.vue';
import { store } from './stores/userStore';

window.axios = require('axios');

Vue.use(VueRouter);

const routes = [
    { path: '/', component: Home },
    { path: '*', component: ErrorPage },
];

const router = new VueRouter({ 
    mode: 'history',
    base: __dirname,
    routes 
});
const app = new Vue(Vue.util.extend({ router, store }, App)).$mount('#app');

// hot reload
if(module.hot) {
    module.hot.accept();
}