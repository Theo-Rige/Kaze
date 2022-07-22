<template>
	<label class="input-range">
		<div class="input-range__label">
			<span class="input-range__label__name">{{ props.label }}</span>
			<input type="number" :min="props.min" :max="props.max" v-model="value" />
			<span class="unit">{{ props.unit }}</span>
		</div>
		<input type="range" :min="props.min" :max="props.max" v-model="value" />
	</label>
</template>

<script setup>
import { defineProps, computed, defineEmits } from 'vue'

const props = defineProps({
	label: {
		type: [String, Number, Boolean],
		required: true,
	},
	min: {
		type: Number,
		default: 0,
	},
	max: {
		type: Number,
		default: 100,
	},
	value: {
		type: [String, Number],
	},
	unit: {
		type: [String, Number],
		default: '',
	},
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
.input-range {
	width: 100%;
	font-style: normal;
	font-weight: 400;
	font-size: 1rem;

	&__label {
		@include flex(false, flex-start, center);
		&__name {
			width: 100%;
		}
		input[type='number'] {
			all: unset;
			text-align: end;
			min-width: 70px;
			width: 30%;
			-moz-appearance: textfield !important;
		}
	}

	input[type='range'] {
		all: unset;
		width: 100%;
		margin-top: 28px;
		height: 1px;
		background: $border-color;

		&::-webkit-slider-thumb {
			-webkit-appearance: none;
			height: 20px;
			width: 20px;
			border-radius: 50%;
			background: $gradient;
			cursor: ew-resize;
		}
		&::-moz-range-thumb {
			-webkit-appearance: none;
			height: 16px;
			width: 16px;
			border-radius: 50%;
			background: $gradient;
			cursor: ew-resize;
		}
	}
	.unit {
		margin-left: 5px;
	}
}
</style>
