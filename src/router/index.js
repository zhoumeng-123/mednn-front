import { createRouter, createWebHashHistory } from "vue-router";
import MeDNNShow from "../views/Multi-exitDNNShow.vue";
const routes = [
  {
    path: "/",
    name: "FLshow",
    component: MeDNNShow,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
