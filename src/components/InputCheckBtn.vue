<template>
	<label class="input-check-btn">
		<input type="checkbox" :value="props.value" :name="props.name" v-model="value" :required="props.required" :checked="props.ischecked" />
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
.input-check-btn {
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
