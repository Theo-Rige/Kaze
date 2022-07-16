<template>
	<label :for="props.id" class="input-text">
		{{ props.label }}
		<input
			:id="props.id"
			:type="props.type"
			:minlength="props.minlength"
			:inputmode="props.inputmode"
			:pattern="props.pattern"
			:required="props.required"
			placeholder=" "
			v-model="value"
			ref="input"
		/>
		<span v-if="props.type === 'password' && props.warning_state" class="input-text__warning">{{ props.warning_notice }}</span>
	</label>
</template>

<script setup>
import { defineEmits, defineProps, defineExpose, ref, computed } from 'vue'

const props = defineProps({
	id: {
		type: String,
		required: true,
	},
	label: {
		type: String,
		required: true,
	},
	type: {
		type: String,
		default: 'text',
	},
	minlength: {
		default: false,
	},
	inputmode: String,
	warning_state: Boolean,
	warning_notice: String,
	required: Boolean,
	pattern: String,
	model: String,
})

const input = ref()

defineExpose({
	input,
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
.input-text {
	width: 100%;
	font-style: normal;
	font-weight: 400;
	font-size: 1rem;

	input {
		all: unset;
		height: 50px;
		width: 100%;
		margin-top: space(1);
		font-family: $poppins;
		font-style: normal;
		font-weight: 400;
		font-size: 1rem;
		caret-color: $white;
		border-bottom: 1px solid #ffffff33;
		@include transition(border-bottom);

		&:focus {
			border-bottom: 1px solid $white;
		}

		&:not(:focus):not(:placeholder-shown):valid {
			border-bottom: 1px solid $success-color;
		}

		&:not(:focus):not(:placeholder-shown):invalid {
			border-bottom: 1px solid $warning-color;
		}
	}

	&__warning {
		margin-top: space(1);
		font-size: 0.875rem;
		color: $warning-color;
	}

	&.warning {
		input {
			border-bottom: 1px solid $warning-color;

			&:not(:focus):not(:placeholder-shown):valid {
				border-bottom: 1px solid $warning-color;
			}
		}
	}
}
</style>
