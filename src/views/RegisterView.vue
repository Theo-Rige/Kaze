<template>
	<main class="register">
		<LogoDefault />
		<form id="register__form" @submit.prevent="register">
			<InputText id="last_name" label="Quel est ton nom ?" required v-model:model="form.last_name" v-if="step === 0" ref="last_name" />
			<InputText id="first_name" label="Quel est ton prénom ?" required v-model:model="form.first_name" v-else-if="step === 1" ref="first_name" />
			<InputText id="age" label="Quel est ton âge ?" inputmode="numeric" pattern="[0-9]+" required v-model:model="form.age" v-else-if="step === 2" ref="age" />
			<template v-else-if="step === 3">
				<InputText
					id="password"
					label="Choisis un mot de passe"
					type="password"
					minlength="8"
					required
					v-model:model="form.password"
					@input="verify"
					ref="password"
					:class="{ warning: warning.warning_state }"
				/>
				<InputText
					id="password_confirm"
					label="Confirme ton mot de passe"
					type="password"
					minlength="8"
					required
					v-model:model="form.password_confirm"
					v-bind="warning"
					@input="verify"
					ref="password_confirm"
					:class="{ warning: warning.warning_state }"
				/>
			</template>
		</form>
		<div class="register__actions">
			<ButtonDefault transparent v-if="step > 0" @click="step--"><ArrowLeftIcon /></ButtonDefault>
			<ButtonDefault :label="button.label" :type="button.type" :white="button.back.white" :gradient="button.back.gradient" @click="next" form="register__form" />
		</div>
	</main>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { ArrowLeftIcon } from '@heroicons/vue/solid'

import LogoDefault from '@/components/LogoDefault.vue'
import InputText from '@/components/InputText.vue'
import ButtonDefault from '@/components/ButtonDefault.vue'

const last_name = ref()
const first_name = ref()
const age = ref()
const password = ref()
const password_confirm = ref()
const inputs = reactive([last_name, first_name, age, password, password_confirm])

const step = ref(0)
const init = ref(false)
const warning = reactive({ warning_state: false, warning_notice: '' })

const form = reactive({
	last_name: '',
	first_name: '',
	age: '',
	password: '',
	password_confirm: '',
})
const button = reactive({
	label: computed(() => {
		if (step.value > 3) {
			return "S'inscrire"
		} else {
			return 'Suivant'
		}
	}),
	type: 'button',
	back: {
		white: computed(() => {
			if (step.value > 2) {
				return false
			} else {
				return true
			}
		}),
		gradient: computed(() => {
			if (step.value > 2) {
				return true
			} else {
				return false
			}
		}),
	},
})

const next = () => {
	if (step.value < 3) {
		if (inputs[step.value].value.input.checkValidity()) {
			step.value++
		}
	} else {
		button.type = 'submit'
	}
}

const verify = () => {
	if (form.password != '' && form.password_confirm != '') {
		init.value = true
		if (form.password.length >= 8) {
			if (form.password === form.password_confirm) {
				warning.warning_state = false
				warning.warning_notice = ''
			} else {
				warning.warning_state = true
				warning.warning_notice = 'Les mots de passes ne correspondent pas'
			}
		} else {
			warning.warning_state = true
			warning.warning_notice = 'Le mot de passe doit contenir au minimum 8 caractères'
		}
	} else if (form.password != '' && form.password_confirm == '' && init.value === true) {
		warning.warning_state = true
	} else {
		warning.warning_state = false
	}
}

const register = () => {}
</script>

<style lang="scss" scoped>
.register {
	position: relative;
	padding: space(5);
	height: 100vh;
	@include flex(column, space-between, stretch);

	.logo {
		align-self: center;
	}

	form {
		@include flex(column, false, center, space(3));
		.input-text:not([for='password_confirm']) {
			@include h1;
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
