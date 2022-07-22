<template>
	<label class="input-radio">
		<input type="radio" :name="props.name" :value="props.value" v-model="value" :required="props.required" :checked="props.ischecked" />
		<span>{{ props.label }}</span>
	</label>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'

const props = defineProps({
	label: {
		type: [String, Number, Boolean],
		required: true,
	},
	value: {
		type: [String, Number, Boolean],
		required: true,
	},
	ischecked: {
		type: Boolean,
		required: false,
		default: false,
	},
	name: {
		default: false,
	},
	required: Boolean,
	model: [String, Number, Boolean],
})

const value = computed({
	get() {
		return props.model
	},
	set(value) {
		emit('update:model', value)
	},
})

const emit = defineEmits(['update:model'])
</script>

<style scoped lang="scss">
.input-radio {
	width: 100%;

	input {
		display: none;

		&:checked ~ span {
			color: $dark-green;
			background: $gradient;
		}
	}

	span {
		height: $input-height;
		width: 100%;
		padding: 0 space(3);
		border-radius: 25px;
		font-weight: 500;
		color: $white;
		@include backdrop;
		@include flex(false, center, center);
		@include backdrop;
	}
}
</style>
