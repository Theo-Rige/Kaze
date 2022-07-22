<template>
	<header class="container-mobile">
		<ArrowLeftIcon @click="router.push({ name: 'account' })" />
		<h1>Mes Paramètres</h1>
	</header>
	<main class="setting">
		<form id="form-setting">
			<div class="setting__item">
				<span class="name">Type de compte</span>
				<ul class="list-h setting__item-center">
					<li>
						<InputRadio
							@change="checkUpdate()"
							:label="'Postulant'"
							:name="'publisher'"
							:value="false"
							v-model:model="form.publisher"
							:ischecked="form.publisher == false ? true : false"
						/>
					</li>
					<li>
						<InputRadio @change="checkUpdate()" :label="'Annonceur'" :name="'publisher'" :value="true" v-model:model="form.publisher" :ischecked="form.publisher == true ? true : false" />
					</li>
				</ul>
			</div>

			<ButtonDefault class="mt-auto" label="Sauvegarder" @click="updateProfile()" white :disabled="form.canUpdate == true ? false : true" />
		</form>
		<hr />
		<router-link to="/legal" class="mentions-legale">Mentions légales</router-link>
	</main>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeftIcon } from '@heroicons/vue/solid'

import axios from 'axios'

import InputRadio from '@/components/InputRadio.vue'
import ButtonDefault from '@/components/ButtonDefault.vue'

const router = useRouter()
const token = localStorage.getItem('jwt')
const user = JSON.parse(localStorage.getItem('user'))

const form = reactive({
	publisher: user.publisher,
	canUpdate: false,
})

const checkUpdate = () => {
	form.canUpdate = true
}

const updateProfile = async () => {
	try {
		const request = await axios.put(
			'http://theorige.com/api/users/' + user.id,
			{
				publisher: form.publisher,
			},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		)
		if (request.statusText == 'OK') {
			form.canUpdate = false
			user.publisher = form.publisher
			window.localStorage.setItem('user', JSON.stringify(user))
		}

		// await toast.set('Inscription réussie, vous allez être redirigé vers la page de connexion', 'success')
	} catch (error) {
		if (error.response.status === 400 && error.response.data.error.message) {
			// await toast.set(error.response.data.error.message, 'warning')
		}
	}
}
</script>

<style lang="scss" scoped>
.mentions-legale {
	text-align: center;
	display: flex;
	justify-content: center;
}
header {
	height: space(10);
	width: 100%;
	padding: 0 space(5);
	@include flex(false, flex-start, center, space(3));
	svg {
		height: space(3);
	}
	h1 {
		font-size: 1.125rem;
	}
}
.setting {
	position: relative;
	height: 100%;
	width: 100%;
	@include flex(column, false, stretch, space(3));

	form {
		@include flex(column, false, stretch, space(3));
		height: 100%;
	}

	hr {
		all: unset;
		width: calc(100% - space(20));
		height: 1px;
		align-self: center;
		background: $border-color;
	}
	&__item {
		@include flex(column, false, stretch, space(2));
		color: #bfbfbf;
		&-center {
			justify-content: center;
		}
	}

	button {
		flex-grow: 0;
	}
}
.mt-auto {
	margin-top: auto;
}
</style>
