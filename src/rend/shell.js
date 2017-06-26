module.paths.push(
  __dirname,
  __dirname + '/../res/img',
__dirname + '/../res/layout');

const Vue = require('vue/dist/vue.js');
const VueRouter = require('vue-router');

Vue.use(VueRouter)

const Device = { template: require('./device.html').layout };
const Clipboard = { template: require('./clipboard.html').layout };
const Sms = { template: require('./sms.html').layout };
const Settings = { template: require('./settings.html').layout };
const routes = [
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
