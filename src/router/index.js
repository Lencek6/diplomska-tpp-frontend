import Vue from "vue";
import VueRouter from "vue-router";
import routes from "./routes";

Vue.use(VueRouter);

// configure router
const router = new VueRouter({
    routes,
    linkActiveClass: "active",
    mode: 'history'
});

// Before route resolve
router.beforeResolve((to, from, next) => {
    next();
})

// Router Guard logic
router.beforeEach((to, from, next) => {
 next();
});


export default router;