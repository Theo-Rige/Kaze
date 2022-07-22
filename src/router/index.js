import { createRouter, createWebHistory } from 'vue-router'
import { nextTick } from 'vue'

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
		component: () => import('../views/LoginView.vue'),
	},
	{
		path: '/register',
		name: 'register',
		component: () => import('../views/RegisterView.vue'),
	},
	{
		path: '/bookmarks',
		name: 'bookmarks',
		component: () => import('../views/BookmarksView.vue'),
		meta: { title: 'Kaze - Mes favoris' },
	},
	{
		path: '/advert/:id',
		name: 'advert',
		component: () => import('../views/AdvertView.vue'),
	},
	{
		path: '/account',
		component: () => import('../views/AccountView.vue'),

		children: [
			{
				path: '',
				name: 'account',
				component: () => import('../views/account/AccountView.vue'),
				meta: { title: 'Kaze - Mon compte' },
			},
			{
				path: 'profile',
				name: 'profile',
				component: () => import('../views/account/ProfileView.vue'),
				meta: { title: 'Kaze - Mon profil' },
			},
			{
				path: 'search',
				name: 'search',
				component: () => import('../views/account/SearchView.vue'),
				meta: { title: 'Kaze - Ma recherche' },
			},
			{
				path: 'settings',
				name: 'settings',
				component: () => import('../views/account/SettingsView.vue'),
				meta: { title: 'Kaze - Mes Paramètres' },
			},
		],
	},
	{
		path: '/legal',
		name: 'legal',
		component: () => import('../views/LegalView.vue'),
		meta: { title: 'Kaze - Mentions légales' },
	},
]

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
})

router.beforeEach(async (to) => {
	if (!localStorage.getItem('jwt') && !['auth', 'login', 'register'].includes(to.name)) {
		return { name: 'auth' }
	}
})

const DEFAULT_TITLE = 'Kaze - Recherche de colocations'
router.afterEach((to) => {
	nextTick(() => {
		document.title = to.meta.title || DEFAULT_TITLE
	})
})

export default router
