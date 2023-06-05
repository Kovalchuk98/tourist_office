import Vue from "vue";
import VueRouter, {
  NavigationGuardNext,
  Route,
  RouteConfig,
  RouteRecord,
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
    path: Routes.Admin,
    name: "admin",
    component: () =>
      import(/* webpackChunkName: "signin" */ "../views/Admin/Index.vue"),

    children: [
      {
        path: "signin",
        component: () =>
          import(/* webpackChunkName: "signin" */ "../views/Admin/SignIn.vue"),
      },
    ],
  },
  {
    path: Routes.NotFound,
    name: "404",
    component: () =>
      import(/* webpackChunkName: "signin" */ "../views/404.vue"),
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
  const requiresAuth = to.matched.some((x: RouteRecord) => x.meta.requiresAuth);

  if (requiresAuth && !isAuth) {
    next(Routes.Home);
  } else {
    next();
  }
});

export default router;
