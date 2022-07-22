<template>
	<header class="container-mobile">
		<ArrowLeftIcon @click="router.push({ name: 'account' })" />
		<h1>Ma recherche</h1>
	</header>
	<main class="search">
		<form id="form-search">
			<template v-for="item in data.search" :key="item">
				<InputText v-if="item.inputType == 'text'" :label="item.label">
					<input type="text" :id="item.name" v-model="item.value" @change="checkUpdate()" />
				</InputText>

				<InputRange
					@change="checkUpdate()"
					v-else-if="item.inputType == 'range'"
					:label="item.label"
					:name="item.name"
					:min="item.minValue"
					:max="item.maxValue"
					v-model:model="item.value"
					:unit="item.unit"
				/>

				<div class="search__item" v-else-if="item.inputType == 'radio-number'">
					<span class="name"> {{ item.label }}</span>
					<ul class="list-h">
						<li v-for="n in item.maxValue - (item.minValue - 1)" :key="n">
							<InputRadio
								@change="checkUpdate()"
								:label="n + item.minValue - 1 == item.maxValue ? n + item.minValue - 1 + '+' : n + item.minValue - 1"
								:name="item.name"
								:value="n + item.minValue - 1"
								v-model:model="item.value"
								:ischecked="n + item.minValue - 1 == item.value ? true : false"
							/>
						</li>
					</ul>
				</div>

				<div class="search__item" v-else-if="item.inputType == 'radio'">
					<span class="name" v-if="item.label != ''"> {{ item.label }}</span>
					<ul class="list-h">
						<li v-for="option in item.options" :key="option">
							<InputRadio
								@change="checkUpdate()"
								:label="option.label"
								:name="item.name"
								:value="option.value"
								v-model:model="item.value"
								:ischecked="option.value == item.value ? true : false"
							/>
						</li>
					</ul>
				</div>

				<div class="search__item" v-else-if="item.inputType == 'checkbox'">
					<span class="name" v-if="item.label != ''"> {{ item.label }}</span>
					<ul class="list-h">
						<li v-for="option in item.options" :key="option">
							<InputCheck
								@change="checkUpdate()"
								:label="option.label"
								:name="item.name"
								:value="option.value"
								v-model:model="option.value"
								:ischecked="option.value == item.value ? true : false"
							/>
						</li>
					</ul>
				</div>

				<div class="search__item" v-else-if="item.inputType == 'checkbox-btn'">
					<span class="name" v-if="item.label != ''"> {{ item.label }}</span>
					<ul class="list-h">
						<li v-for="option in item.options" :key="option">
							<InputCheckBtn
								@change="checkUpdate()"
								:label="option.label"
								:name="item.name"
								:value="option.value"
								v-model:model="option.value"
								:ischecked="option.value == item.value ? true : false"
							/>
						</li>
					</ul>
				</div>
			</template>

			<ButtonDefault label="Sauvegarder" @click="updateSearch()" white :disabled="canUpdate == true ? false : true" />
		</form>
	</main>
</template>

<script setup>
import { ref, reactive, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeftIcon } from '@heroicons/vue/solid'

import axios from 'axios'

import InputText from '@/components/InputText.vue'
import ButtonDefault from '@/components/ButtonDefault.vue'
import InputRange from '@/components/InputRange.vue'
import InputRadio from '@/components/InputRadio.vue'
import InputCheck from '@/components/InputCheck.vue'
import InputCheckBtn from '@/components/InputCheckBtn.vue'

const router = useRouter()
const token = localStorage.getItem('jwt')
const user = JSON.parse(localStorage.getItem('user'))
console.log(user)
const data = reactive({
	search: [],
})
const canUpdate = ref(false)
// const form = reactive({
// 	username: user.username,
// 	age: user.age,
// 	email: user.email,
// 	publisher: user.publisher,
// })

const defaultDataSearch = [
	{
		label: 'Ville de recherche',
		name: 'ville-search',
		value: '',
		inputType: 'text',
	},
	{
		label: 'Loyer max',
		name: 'loyer-max',
		value: false,
		unit: '€',
		minValue: 0,
		maxValue: 1000,
		inputType: 'range',
	},
	{
		label: 'Superficie min. de la chambre',
		name: 'size',
		value: false,
		minValue: 0,
		maxValue: 100,
		unit: 'm²',
		inputType: 'range',
	},
	{
		label: 'Nombre de colocataire',
		name: 'nombre-colocataire',
		value: 2,
		unit: false,
		minValue: 2,
		maxValue: 5,
		inputType: 'radio-number',
	},
	{
		label: 'Mixité',
		name: 'mixite',
		value: false,
		inputType: 'radio',
		options: [
			{
				label: 'Hommes',
				value: 'hommes',
			},
			{
				label: 'Femmes',
				value: 'femmes',
			},
			{
				label: 'Peu importe',
				value: 'all',
			},
		],
	},
	{
		label: '',
		name: 'non-fumeur',
		value: false,
		inputType: 'checkbox',
		options: [
			{
				label: 'Je ne tolère pas les fumeurs',
				value: false,
			},
		],
	},
	{
		label: '',
		name: 'animal',
		value: false,
		inputType: 'checkbox',
		options: [
			{
				label: "J'ai un animal",
				value: false,
			},
		],
	},
	{
		label: '',
		name: 'pmr',
		value: false,
		inputType: 'checkbox',
		options: [
			{
				label: 'Je suis une personne à mobilitée réduite (PMR)',
				value: false,
			},
		],
	},
	{
		label: 'Équipements requis',
		name: 'equipements',
		value: false,
		inputType: 'checkbox-btn',
		options: [
			{
				label: 'Fibre',
				value: 'fibre',
			},
			{
				label: 'Machine à laver',
				value: 'machine-a-laver',
			},
			{
				label: 'Parking',
				value: 'parking',
			},
			{
				label: 'Lave vaiselle',
				value: 'lave-vaiselle',
			},
			{
				label: 'SDB privé',
				value: 'sdb-prive',
			},
			{
				label: 'Sèche linge',
				value: 'seche-linge',
			},
			{
				label: 'Télé',
				value: 'television',
			},
			{
				label: 'Jardin',
				value: 'jardin',
			},
		],
	},
]
onBeforeMount(() => {
	// console.log(user)
	// console.log(user.value.search)
	if (user.search == null || user.search.length == 0) {
		console.log('ouuuiiii')
		user.search = defaultDataSearch
	}
	data.search = user.search
})

const checkUpdate = () => {
	canUpdate.value = true
	// form.canUpdate = false
}

const updateSearch = async () => {
	try {
		const request = await axios.put(
			'https://theorige.com/api/users/' + user.id,
			{
				search: data.search,
			},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		)
		if (request.statusText == 'OK') {
			canUpdate.value = false
			user.search = data.search

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
.search {
	position: relative;
	width: 100%;
	@include flex(column, false, stretch, space(3));
	form {
		color: #bfbfbf;
		@include flex(column, false, stretch, space(4));
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
	}
}
</style>
