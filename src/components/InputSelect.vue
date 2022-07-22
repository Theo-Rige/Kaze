<template>
	<label class="input-select">
		{{ props.label }}
		<select :id="props.id" v-model="value">
			<option v-for="option in props.options" :key="option" :value="option[props.options_value]"></option>
		</select>
		<div class="input-select__wrapper" :class="{ active: focus }" tabindex="1" @blur="focus = false">
			<ChevronDownIcon />
			<span @click="focus = !focus">{{ current }}</span>
			<hr />
			<ul>
				<li v-for="option in props.options" :key="option" @click="select(option)">
					{{ option[props.options_label] }}
				</li>
			</ul>
		</div>
	</label>
</template>

<script setup>
import { defineProps, defineEmits, ref, computed } from 'vue'
import { ChevronDownIcon } from '@heroicons/vue/solid'

const props = defineProps({
	label: {
		type: String,
		required: true,
	},
	options: {
		type: Array,
		required: true,
	},
	options_value: {
		type: String,
		default: 'value',
	},
	options_label: {
		type: String,
		default: 'label',
	},
	id: String,
	model: String,
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

const current = computed(() => {
	if (value.value != undefined && value.value != '') {
		return props.options
			.filter((option) => {
				return option[props.options_value] === value.value
			})
			.shift()[props.options_label]
	} else {
		return value.value
	}
})
const focus = ref(false)

const select = (option) => {
	value.value = option[props.options_value]
	focus.value = false
}
</script>

<style scoped lang="scss">
.input-select {
	width: 100%;
	@include label;

	select {
		display: none;
	}

	&__wrapper {
		position: relative;
		margin-top: space(2);
		border-radius: 25px;
		max-height: $input-height;
		overflow: hidden;
		@include backdrop;
		@include transition(max-height);

		svg {
			position: absolute;
			color: $white;
			height: space(4);
			top: calc(($input-height - space(4)) / 2);
			right: space(2);
			@include transition(transform);
		}

		span {
			display: block;
			margin: 0 space(3);
			height: $input-height;
			line-height: $input-height;
		}

		hr {
			all: unset;
			display: block;
			height: 1px;
			width: calc(100% - space(6));
			margin: 0 space(3);
			background: $back-color;
		}

		ul {
			li {
				height: $input-height;
				padding: 0 space(3);
				line-height: $input-height;
				font-size: 0.875rem;

				&:hover {
					cursor: pointer;
					color: $green;
				}
			}
		}

		&.active {
			max-height: 400px;

			svg {
				transform: rotate(180deg);
			}
		}
	}

	.just-validate-error-label {
		margin-top: space(1);
		font-size: 0.875rem;
		color: $warning-color !important;
	}
}

.just-validate-error-label {
	margin-top: space(1);
	font-size: 0.875rem;
	color: $warning-color !important;
}
</style>
