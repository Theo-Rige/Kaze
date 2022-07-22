<template>
	<div class="background">
		<img src="@/assets/noise.webp" alt="Noise baqckground" />
	</div>
	<header class="container-mobile" v-if="['login', 'register'].includes(route.name)">
		<router-link to="/"><LogoDefault /></router-link>
	</header>
	<router-view @update="update" />
	<footer class="bottom-bar-container" v-if="!['auth', 'login', 'register'].includes(route.name)">
		<div class="bottom-bar container-mobile">
			<router-link :to="!['advert'].includes(route.name) ? '/' : '/bookmarks'">
				<HomeIcon v-if="!['advert'].includes(route.name)" />
				<ArrowLeftIcon v-else />
			</router-link>
			<router-link to="/bookmarks">
				<PencilIcon v-if="user.publisher" />
				<BookmarkIconOutline v-else-if="!isBookmarked && ['advert'].includes(route.name)" @click="update('bookmarks', route.params.id)" />
				<BookmarkIconSolid v-else @click="update('bookmarks', route.params.id, true)" />
			</router-link>
			<router-link :to="!['advert'].includes(route.name) ? '/account' : '#postuled'">
				<UserIcon v-if="!['advert'].includes(route.name)" />
				<CheckIcon v-else-if="!user.publisher" @click="update('postuled', route.params.id)" />
				<TrashIcon v-else />
			</router-link>
			<div class="border-top-bar" v-if="!['advert'].includes(route.name)"></div>
		</div>
	</footer>
</template>

<script setup>
import { ref, reactive, onBeforeMount, watch } from 'vue'
import { useRoute } from 'vue-router'
import LogoDefault from '@/components/LogoDefault.vue'
import { HomeIcon, BookmarkIcon as BookmarkIconSolid, UserIcon, ArrowLeftIcon, CheckIcon, PencilIcon, TrashIcon } from '@heroicons/vue/solid'
import { BookmarkIcon as BookmarkIconOutline } from '@heroicons/vue/outline'

import axios from 'axios'

const user_local = JSON.parse(localStorage.getItem('user'))
const token = localStorage.getItem('jwt')
const route = useRoute()
const user = reactive({ data: {} })
const isBookmarked = ref(false)

const update = async (field, value, remove = false, json = false) => {
	if (typeof user.data[field] === 'object' && !json) {
		if (remove) {
			user.data[field] = user.data[field].filter((item) => item.id !== parseInt(value))
		} else {
			user.data[field].push({ id: parseInt(value) })
		}
		value = user.data[field].map((item) => item.id)
	} else if (json) {
		if (remove) {
			user.data[field] = user.data[field].filter((item) => item !== parseInt(value))
		} else {
			user.data[field].push(parseInt(value))
		}
		value = user.data[field]
	}

	await axios.put(
		'http://theorige.com/api/users/' + user_local.id,
		{
			[field]: value,
		},
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}
	)
}

onBeforeMount(async () => {
	const getUser = await axios.get('http://theorige.com/api/users/' + user_local.id + '?populate=*', {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})

	user.data = getUser.data
	console.log(user.data)

	const test = (id) => {
		if (user.data.bookmarks.filter((bookmark) => bookmark.id === parseInt(id)).length > 0) {
			isBookmarked.value = true
		} else {
			isBookmarked.value = false
		}
	}
	test(route.params.id)

	watch(
		() => route.params.id,
		(id) => {
			test(id)
		}
	)
})
</script>

<style lang="scss">
* {
	box-sizing: border-box;
}

html {
	position: relative;
	margin: 0;
	padding: 0;
	width: 100vw;
	height: 100%;
	overflow: hidden;
}
.container-mobile {
	max-width: 450px;
	@media screen and (min-width: 450px) {
		max-width: 400px;
	}
	margin: 0 auto;
}
main {
	padding: $main-space $main-space space(11);
	@extend .container-mobile;
}

body {
	position: relative;
	overflow: auto;
	margin: 0;
	padding: 0;
	width: 100vw;
	height: 100%;
	font-family: $poppins;
	font-size: 100%;
	color: $white;
	background: $dark-green;
	@include flex(column, false, center, false);

	.background {
		position: fixed;
		overflow: hidden;
		z-index: -1;
		inset: 0;
		height: 100vh;
		img {
			aspect-ratio: 16/9;
			opacity: 0.4;
		}

		&::before,
		&::after {
			content: '';
			position: absolute;
			z-index: -1;
			width: 60vw;
			height: 60vw;
			border-radius: 50%;
			background: #42865b;
			filter: blur(30vw);
		}

		&::before {
			top: 0;
			right: -25%;
		}

		&::after {
			bottom: 10%;
			left: -25%;
		}
	}

	header {
		width: 100%;
		height: space(6);
		flex-shrink: 0;
		@include flex(false, center, center);

		svg {
			height: space(4) !important;
		}
	}

	.bottom-bar {
		&-container {
			position: fixed;
			bottom: 0;
			width: 100%;
			height: space(8);
			background: #274039;
			z-index: 9999;
			// &::after {
			// 	position: absolute;
			// 	// content: '';
			// 	top: 0;
			// 	height: 1px;
			// 	left: 0;
			// 	right: 0;
			// 	background-color: rgba(255, 255, 255, 0.4);
			// 	z-index: 1;
			// }
		}
		position: relative;
		width: 100%;
		height: 100%;
		// margin: $main-space;
		flex-shrink: 0;
		// border-radius: space(5);
		@include flex(false, space-around, center);

		a {
			all: unset;
			box-sizing: border-box;
			height: space(8);
			width: space(8);
			// border-radius: 50%;
			@include flex(false, center, center);

			svg {
				height: space(3);
				// color: $back-color;
			}

			&.router-link-active {
				// @include backdrop;
				// border-top: 1px solid $green;
				svg {
					color: $green;
				}
			}
		}
	}

	$nbElementNavbar: 3;
	$size-border-bar: calc(100% / $nbElementNavbar);

	.border-top-bar {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		z-index: 1;

		&::after {
			will-change: transform;
			position: absolute;
			content: '';
			top: 0;
			left: 0;
			height: 2px;
			width: $size-border-bar;
			background-color: $green;
			z-index: 2;
			transform: translate(0);
			@include transition(all);
		}
	}
	// Translate border barre
	@for $i from 0 to 6 {
		.router-link-active:nth-child(#{$i}) ~ .border-top-bar::after {
			transform: translate(calc(100% * ($i - 1)));
		}
	}
}

.list-h {
	display: flex;
	gap: 1rem;
	align-items: flex-start;
	justify-content: flex-start;
	flex-wrap: wrap;
}
</style>
