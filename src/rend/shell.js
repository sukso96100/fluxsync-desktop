
// Setup Path for modules
module.paths.push(
  __dirname + '/../../rend');

// Load Vue.js and companions
const Vue = require('vue/dist/vue.js');
const VueRouter = require('vue-router');

// Setup Router
Vue.use(VueRouter)

const Device = require('../../rend/device');
const Clipboard = { template: require('./clipboard.html').layout };
const Sms = { template: require('./sms.html').layout };
const Settings = { template: require('./settings.html').layout };
const routes = [
  { path: '/', redirect: '/device' },
  { path:'/device', component:Device },
  { path:'/clipboard', component:Clipboard },
  { path:'/sms', component: Sms },
  { path:'/settings', component: Settings }
];

const router = new VueRouter({
  routes
});

const app = new Vue({
  router
}).$mount('#app');
