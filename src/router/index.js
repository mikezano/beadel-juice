import Vue from "vue";
import VueRouter from "vue-router";
import Beadz from "../views/Beadz.vue";

Vue.use(VueRouter);

const routes = [
	{
		path: "/",
		redirect: "/beadz"
	},
	{
		path: "/beadz",
		name: "beadz",
		component: Beadz
	}
];

const router = new VueRouter({
	routes
});

export default router;
