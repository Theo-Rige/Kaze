<template>
	<div class="home">
		<InputText id="test1" label="Exemple de label" />
		<InputCheck id="test2" label="Exemple de label" />
		<InputRange id="test3" label="Exemple de label" :max="3000" />
		<InputSelect id="test4" label="Exemple de label" :options="array" options_value="value" options_label="label" />
		<InputMultiSelect id="test5" label="Exemple de label" :options="array" options_label="label" />
	</div>
</template>

<script setup>
import InputText from '@/components/InputText.vue'
import InputCheck from '@/components/InputCheck.vue'
import InputRange from '@/components/InputRange.vue'
import InputSelect from '@/components/InputSelect.vue'
import InputMultiSelect from '@/components/InputMultiSelect.vue'

const array = [
	{
		label: 'Etudiant',
		value: 'student',
	},
	{
		label: 'Alternant',
		value: 'interner',
	},
	{
		label: 'Actif',
		value: 'employee',
	},
	{
		label: 'Sans emploi',
		value: 'jobless',
	},
]
</script>

<style lang="scss">
.home {
	padding-top: space(5);
	@include flex(column, false, center, space(5));
}
</style>
