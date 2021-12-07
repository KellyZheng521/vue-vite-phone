import Vue from "vue";
import App from "./App.vue";
import router from "@/router";
import store from "@/store";

// 全局引入vant
import Vant from "vant";
Vue.use(Vant);
import "@vant/touch-emulator";

// 移动端引入amfe-flexible依赖，并在postcss.config.js中打开相关插件
// import "amfe-flexible";

import wxTitle from "vue-wechat-title";
Vue.use(wxTitle);

console.log(import.meta.env);

import util from "@/utils/util";
import compute from "@/utils/compute";
import validate from "@/utils/validate";

const prototype = {
  $util: util, // 工具函数
  $compute: compute, //浮点运算
  $validate: validate, //正则校验
};

// 挂载原型
for (const [key, value] of Object.entries(prototype)) {
  Vue.prototype[key] = value;
}

if (process.env.NODE_ENV === "development") {
  eruda.init();
}

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
