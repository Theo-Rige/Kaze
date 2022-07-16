<template>
	<label :for="props.id" class="input-select">
		{{ props.label }}
		<select :id="props.id" v-model="value">
			<option v-for="option in props.options" :key="option" :value="option[props.options_value]"></option>
		</select>
		<div class="input-select__wrapper" :class="{ active: focus }" tabindex="1" @click="focus = !focus" @blur="focus = false">
			<ChevronDownIcon />
			<span>{{ current }}</span>
			<hr />
			<ul>
				<li v-for="option in props.options" :key="option" @click="value = option[props.options_value]">{{ option[props.options_label] }}</li>
			</ul>
		</div>
	</label>
</template>

<script setup>
import { defineProps, ref, computed } from 'vue'
import { ChevronDownIcon } from '@heroicons/vue/solid'

const props = defineProps({
	id: {
		type: String,
		required: true,
	},
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
		required: true,
	},
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
		max-height: 50px;
		overflow: hidden;
		@include backdrop;
		@include transition(max-height);

		svg {
			position: absolute;
			color: $white;
			height: space(4);
			top: calc((50px - space(4)) / 2);
			right: space(2);
			@include transition(transform);
		}

		span {
			display: block;
			margin: 0 space(3);
			height: 50px;
			line-height: 50px;
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
				height: 50px;
				padding: 0 space(3);
				line-height: 50px;
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
