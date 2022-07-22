<template>
	<main class="account">
		<div class="account__heading">
			<img :src="'https://source.boringavatars.com/beam/60/' + user.username + '?colors=AAFC95,89E8A9,0C8F8F,FFFFFF'" alt="Image du profile" />
			<div class="account__heading_right">
				<h2>{{ user.username }}</h2>
				<span>{{ user.publisher ? 'Annonceur' : 'Postulant' }}</span>
			</div>
		</div>
		<nav>
			<router-link to="/account/profile"><UserIcon />Mes infos</router-link>
			<router-link to="/account/advert" v-if="user.publisher"><MenuAlt1Icon />Ma colocation</router-link>
			<router-link to="/account/search" v-else><SearchIcon />Ma recherche</router-link>
			<router-link to="/account/settings"><CogIcon />Paramètres</router-link>
		</nav>
		<ButtonDefault label="Se deconnecter" class="account__logout" @click="logout" />
	</main>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { UserIcon, MenuAlt1Icon, SearchIcon, CogIcon } from '@heroicons/vue/solid'
import ButtonDefault from '@/components/ButtonDefault.vue'

const router = useRouter()
const user = JSON.parse(localStorage.getItem('user'))

const logout = () => {
	localStorage.removeItem('jwt')
	localStorage.removeItem('user')
	router.push({ name: 'auth' })
}
</script>

<style lang="scss" scoped>
.account {
	position: relative;
	height: 100%;
	width: 100%;
	@include flex(column, false, stretch);

	&__heading {
		width: 100%;
		padding-bottom: space(4);
		border-bottom: 1px solid $back-color;
		@include flex(false, false, center, space(3));

		&_right {
			@include flex(column, false, false, space(1));

			h2 {
				font-size: 1.5rem;
				font-weight: 500;
				width: fit-content;
			}
			span {
				font-size: 0.875rem;
				font-weight: 300;
				line-height: 150%;
				width: fit-content;
			}
		}
	}

	nav {
		@include flex(column, false, false);

		a {
			all: unset;
			display: block;
			box-sizing: border-box;
			height: space(10);
			flex-shrink: 0;
			font-size: 1.25rem;
			border-bottom: 1px solid $back-color;
			@include flex(false, false, center, space(3));

			svg {
				height: space(3);
			}
		}
	}

	&__logout {
		flex-grow: 0;
		margin-top: auto;
	}
}
</style>
