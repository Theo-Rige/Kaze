<template>
	<label class="input-check">
		<input type="checkbox" :value="props.value" :name="props.name" v-model="value" :required="props.required" :checked="props.ischecked" />
		<span class="input-check__mark"><CheckIcon /></span>
		{{ props.label }}
	</label>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'
import { CheckIcon } from '@heroicons/vue/solid'

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
.input-check {
	width: 100%;
	position: relative;
	font-style: normal;
	font-weight: 400;
	font-size: 1rem;
	cursor: pointer;
	user-select: none;
	@include flex(false, false, center, space(2));

	input {
		display: none;
	}

	&__mark {
		height: 20px;
		width: 20px;
		flex-shrink: 0;
		border-radius: 50%;
		border: 1px solid $white;
		@include flex(false, center, center);
		@include transition(background);

		svg {
			color: $dark-green;
			height: space(2);
			opacity: 0;
			@include transition(opacity);
		}
	}

	input:checked ~ .input-check__mark {
		background: $white;

		svg {
			opacity: 1;
		}
	}
}
</style>
