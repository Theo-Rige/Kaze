<template>
	<label class="input-select">
		{{ props.label }}
		<div class="input-select__wrapper" :class="{ active: focus }" tabindex="1" @click="focus = !focus" @blur="focus = false">
			<ChevronDownIcon />
			<span>{{ current }}</span>
			<hr />
			<fieldset>
				<InputCheck v-for="option in props.options" :key="option" :label="option[props.options_label]" />
			</fieldset>
		</div>
	</label>
</template>

<script setup>
import { defineProps, ref, computed } from 'vue'
import { ChevronDownIcon } from '@heroicons/vue/solid'

import InputCheck from '@/components/InputCheck.vue'

const props = defineProps({
	label: {
		type: String,
		required: true,
	},
	options: {
		type: Array,
		required: true,
	},
	// options_value: {
	// 	type: String,
	// 	required: true,
	// },
	options_label: {
		type: String,
		required: true,
	},
})

const value = ref()
const current = computed(() => {
	if (value.value != undefined) {
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
</script>

<style scoped lang="scss">
.input-select {
	width: 100%;
	font-style: normal;
	font-weight: 400;
	font-size: 1rem;

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

		fieldset {
			.input-check {
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
}
</style>
