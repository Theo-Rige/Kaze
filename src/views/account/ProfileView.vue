<template>
	<header class="container-mobile">
		<ArrowLeftIcon @click="router.push({ name: 'account' })" />
		<h1>Mon profil</h1>
	</header>
	<main class="profile">
		<form id="form-profile">
			<InputText label="Nom d'utilisateur">
				<input type="text" id="username" required v-model="form.username" @change="checkForm()" />
			</InputText>
			<InputText label="Email">
				<input type="text" id="email" required v-model="form.email" @change="checkForm()" />
			</InputText>
			<InputText label="Téléphone">
				<input type="tel" id="phone" required placeholder=" " v-model="form.phone" @change="checkForm()" />
			</InputText>
			<InputText label="Age">
				<input type="number" id="age" inputmode="numeric" min="12" max="100" required placeholder=" " v-model="form.age" @change="checkForm()" />
			</InputText>
			<ButtonDefault label="Sauvegarder" @click="saveProfile()" white :disabled="form.canUpdate == true ? false : true" />
		</form>
		<hr />
		<ButtonDefault label="Changer mot de passe" />
	</main>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeftIcon } from '@heroicons/vue/solid'

import JustValidate from 'just-validate'
import axios from 'axios'

import InputText from '@/components/InputText.vue'
import ButtonDefault from '@/components/ButtonDefault.vue'

const router = useRouter()
const token = localStorage.getItem('jwt')
const user = JSON.parse(localStorage.getItem('user'))

const form = reactive({
	username: user.username,
	age: user.age,
	email: user.email,
	phone: user.phone,
	publisher: user.publisher,
	validity: null,
	canUpdate: false,
})

onMounted(() => {
	form.validity = new JustValidate('#form-profile')
	form.validity
		.addField('#username', [
			{
				rule: 'required',
				errorMessage: 'Merci de renseigner votre nom et prénom',
			},
		])
		.addField('#phone', [
			{
				rule: 'required',
				errorMessage: 'Merci de renseigner votre téléphone',
			},
			{
				rule: 'customRegexp',
				value: /^[0]{1}[0-9]{9}$/,
				errorMessage: 'Numéro de téléphone invalide',
			},
		])
		.addField('#age', [
			{
				rule: 'required',
				errorMessage: 'Merci de renseigner votre âge',
			},
			{
				rule: 'minNumber',
				value: 12,
				errorMessage: "L'âge minimum requis est de 12 ans",
			},
			{
				rule: 'maxNumber',
				value: 100,
				errorMessage: 'Merci de rentrer un âge inferieur à 100',
			},
		])
})
const checkForm = async () => {
	if (await form.validity.revalidate()) {
		if (form.validity.isValid) {
			form.canUpdate = true
		} else {
			form.canUpdate = false
		}
	}
}
const saveProfile = () => {
	if (!form.canUpdate) {
		checkForm()
	} else {
		updateProfile()
	}
}

const updateProfile = async () => {
	try {
		const request = await axios.put(
			'http://kaze.theorige.com/api/users/' + user.id,
			{
				username: form.username,
				age: form.age,
				email: form.email,
				phone: form.phone,
			},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		)
		if (request.statusText == 'OK') {
			form.canUpdate = false;
			user.username = form.username;
			user.age = form.age;
			user.email = form.email;
			user.phone = form.phone;
			window.localStorage.setItem('user', JSON.stringify(user));

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
.profile {
	position: relative;
	height: 100%;
	width: 100%;
	@include flex(column, false, stretch, space(3));

	form {
		@include flex(column, false, stretch, space(3));
	}

	hr {
		all: unset;
		width: calc(100% - space(20));
		height: 1px;
		align-self: center;
		background: $border-color;
	}

	button {
		flex-grow: 0;
	}
}
</style>
