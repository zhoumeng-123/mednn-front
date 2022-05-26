import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
// import XLSX from "xlsx";
import * as echarts from "echarts";
// import Vue from "vue";
//需要挂载到Vue原型上
// Vue.prototype.$echarts = echarts;
// app.config.globalProperties.$echarts = echarts

createApp(App).use(store).use(router).use(ElementPlus).mount("#app");
