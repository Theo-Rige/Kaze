<template>
	<main class="login">
		<h1>Bon retour parmis nous !</h1>
		<form class="form" @submit.prevent="login">
			<InputText label="Email">
				<input type="email" required placeholder=" " v-model="form.email" />
			</InputText>
			<InputText label="Mot de passe">
				<input type="password" required placeholder=" " v-model="form.password" />
			</InputText>
			<ButtonDefault label="Se connecter" type="submit" gradient />
		</form>
	</main>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

import InputText from '@/components/InputText.vue'
import ButtonDefault from '@/components/ButtonDefault.vue'

const router = useRouter()

const form = reactive({
	email: '',
	password: '',
})

const login = async () => {
	try {
		const request = await axios.post('https://theorige.com/api/auth/local', {
			identifier: form.email,
			password: form.password,
		})
		const { jwt, user } = request.data
		window.localStorage.setItem('jwt', jwt)
		window.localStorage.setItem('user', JSON.stringify(user))
		router.push({ name: 'home' })
	} catch (error) {
		if (error.response.status === 400) {
			// await toast.set('Le mot de passe ne correspond pas', 'warning')
		}
	}
}
</script>

<style lang="scss" scoped>
.login {
	position: relative;
	padding: $main-space;
	height: 100%;
	width: 100%;
	@include flex(column, center, stretch, space(3));

	h1 {
		@include h1;
	}

	.form {
		@include flex(column, false, center, space(3));
	}
}
</style>
