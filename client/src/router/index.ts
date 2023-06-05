import Vue from "vue";
import VueRouter, {
  NavigationGuardNext,
  Route,
  RouteConfig,
  RouteMeta,
  RouterOptions,
} from "vue-router";
import Home from "../views/Home.vue";
import Routes from "./routes";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/proposal/:id",
    name: "proposal",
    component: () =>
      import(/* webpackChunkName: "proposal" */ "../views/Proposal.vue"),
  },
  {
    path: Routes.Admin,
    name: "admin",
    component: () =>
      import(/* webpackChunkName: "index" */ "../views/Admin/Index.vue"),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: Routes.NotFound,
    name: "404",
    component: () => import(/* webpackChunkName: "404" */ "../views/404.vue"),
  },
  { path: "*", redirect: "404" },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to: Route, from: Route, next: NavigationGuardNext) => {
  const isAuth = localStorage.getItem("token");
  const requiresAuth = to.matched.some((x) => x.meta.requiresAuth);

  if (requiresAuth && !isAuth) {
    next(Routes.Home);
  } else {
    next();
  }
});

export default router;
