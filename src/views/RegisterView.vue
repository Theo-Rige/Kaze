<template>
	<main class="register">
		<form v-if="step === 0" :ref="setFormRef">
			<InputText label="Quel est ton nom ?">
				<input id="last_name" type="text" required placeholder=" " v-model="data.last_name" />
			</InputText>
			<InputText label="Quel est ton prénom ?">
				<input id="first_name" type="text" required placeholder=" " v-model="data.first_name" />
			</InputText>
			<InputText label="Quel est ton âge ?" class="age">
				<input id="age" type="number" required placeholder=" " v-model="data.age" @keyup.enter="next" />
			</InputText>
		</form>
		<form v-else-if="step === 1" :ref="setFormRef">
			<InputText label="Quel est ton email ?">
				<input id="email" type="email" required placeholder=" " v-model="data.email" />
			</InputText>
			<InputText label="Quel est ton téléphone ?">
				<input id="phone" type="tel" required placeholder=" " v-model="data.phone" @keyup.enter="next" />
			</InputText>
		</form>

		<form v-if="step === 2" :ref="setFormRef">
			<InputSelect id="situation" label="Quel est ta situation ?" :options="situations" v-model:model="data.situation" />
			<fieldset id="publisher">
				<legend>Que cherches-tu ?</legend>
				<InputRadio label="Une colocation" value="false" name="publisher" required v-model:model="data.publisher" />
				<InputRadio label="Un colocataire" value="true" name="publisher" required v-model:model="data.publisher" />
			</fieldset>
		</form>

		<form v-else-if="step === 3" :ref="setFormRef">
			<InputText label="Choisis un mot de passe" :class="{ warning: warning.warning_state }">
				<input id="password" type="password" required placeholder=" " v-model="data.password" />
			</InputText>
			<InputText label="Confirme ton mot de passe" :class="{ warning: warning.warning_state }">
				<input id="password_confirm" type="password" required placeholder=" " v-model="data.password_confirm" />
			</InputText>
		</form>
		<div class="register__actions">
			<ButtonDefault transparent round v-if="step > 0" @click="step--"><ArrowLeftIcon /></ButtonDefault>
			<ButtonDefault :label="step > 2 ? 'S\'inscrire' : 'Suivant'" :white="step <= 2" :gradient="step > 2" @click="next" />
		</div>
	</main>
</template>

<script setup>
import { ref, reactive, onMounted, onUpdated } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeftIcon } from '@heroicons/vue/solid'
import axios from 'axios'
// import Pristine from 'pristinejs'
import JustValidate from 'just-validate'

import InputText from '@/components/InputText.vue'
import InputSelect from '@/components/InputSelect.vue'
import InputRadio from '@/components/InputRadio.vue'
import ButtonDefault from '@/components/ButtonDefault.vue'

const router = useRouter()

const step = ref(0)
const warning = reactive({ warning_state: false, warning_notice: '' })

const situations = [
	{
		label: 'Etudiant',
		value: 'student',
	},
	{
		label: 'Alternant',
		value: 'apprentice',
	},
	{
		label: 'Actif',
		value: 'worker',
	},
	{
		label: 'Sans emploi',
		value: 'unemployed',
	},
]

const form = reactive({
	ref: null,
	validity: null,
})

const setFormRef = (el) => {
	if (el) {
		form.ref = el
	}
}

const data = reactive({
	last_name: '',
	first_name: '',
	age: '',
	phone: '',
	email: '',
	situation: '',
	publisher: '',
	password: '',
	password_confirm: '',
})

onMounted(() => {
	form.validity = new JustValidate(form.ref)
	form.validity
		.addField('#last_name', [
			{
				rule: 'required',
				errorMessage: 'Merci de renseigner votre nom',
			},
		])
		.addField('#first_name', [
			{
				rule: 'required',
				errorMessage: 'Merci de renseigner votre prénom',
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

onUpdated(() => {
	form.validity = new JustValidate(form.ref)
	if (step.value === 1) {
		form.validity
			.addField('#email', [
				{
					rule: 'required',
					errorMessage: 'Merci de renseigner votre email',
				},
				{
					rule: 'email',
					errorMessage: "L'email n'est pas valide",
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
	} else if (step.value === 2) {
		form.validity
			.addField('#situation', [
				{
					rule: 'required',
					errorMessage: 'Merci de renseigner votre situation',
				},
			])
			.addRequiredGroup('#publisher', 'Merci de chosir une proposition')
	} else if (step.value === 3) {
		form.validity
			.addField('#password', [
				{
					rule: 'required',
					errorMessage: 'Merci de choisir un mot de passe',
				},
				{
					rule: 'strongPassword',
					errorMessage: 'Merci de choisir un mot de passe avec minimum huit caractères, au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial',
				},
			])
			.addField('#password_confirm', [
				{
					validator: (value, fields) => {
						if (fields['#password'] && fields['#password'].elem) {
							const repeatPasswordValue = fields['#password'].elem.value
							return value === repeatPasswordValue
						}
						return true
					},
					errorMessage: 'Les mots de passe ne sont pas identiques',
				},
			])
			.onSuccess(async () => {
				try {
					const request = await axios.post('http://kaze.theorige.com/api/auth/local/register', {
						username: data.first_name + ' ' + data.last_name,
						age: parseInt(data.age),
						email: data.email,
						phone: data.phone,
						situation: data.situation,
						publisher: data.publisher,
						password: data.password,
					})
					const { jwt, user } = request.data
					window.localStorage.setItem('jwt', jwt)
					window.localStorage.setItem('user', JSON.stringify(user))
					router.push({ name: 'home' })
					// await toast.set('Inscription réussie, vous allez être redirigé vers la page de connexion', 'success')
				} catch (error) {
					if (error.response.status === 400 && error.response.data.error.message) {
						// await toast.set(error.response.data.error.message, 'warning')
					}
				}
			})
	}
})

const next = async () => {
	if (await form.validity.revalidate()) {
		if (step.value < 3) {
			step.value++
		}
	}
}
</script>

<style lang="scss" scoped>
.register {
	position: relative;
	padding: 0 $main-space $main-space;
	height: 100%;
	width: 100%;
	@include flex(column, false, stretch);

	form {
		flex-grow: 1;
		@include flex(column, center, stretch, space(3));

		.age {
			position: relative;

			&::after {
				content: 'ans';
				position: absolute;
				right: 0;
				top: space(5);
			}
		}

		fieldset {
			all: unset;
			width: 100%;
			@include flex(column, false, false, space(2));

			legend {
				@include label;
				margin-bottom: space(2);
			}
		}

		.just-validate-error-label {
			margin-top: space(1);
			font-size: 0.875rem;
			color: $warning-color !important;
		}
	}

	&__actions {
		@include flex(false, false, center, space(5));

		button {
			svg {
				height: space(3);
				color: $white;
			}
		}
	}
}
</style>
