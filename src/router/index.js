import { createRouter, createWebHistory } from 'vue-router'

const routes = [
	{
		path: '/',
		name: 'home',
		component: () => import('../views/HomeView.vue'),
	},
	{
		path: '/auth',
		name: 'auth',
		component: () => import('../views/AuthView.vue'),
	},
	{
		path: '/login',
		name: 'login',
		component: () => import('../views/AuthView.vue'),
	},
	{
		path: '/register',
		name: 'register',
		component: () => import('../views/RegisterView.vue'),
	},
]

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
})

export default router
