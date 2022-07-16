<template>
	<label :for="props.id" class="input-range">
		<div class="input-range__label">
			<span>{{ props.label }}</span>
			<input type="number" min="0" :max="props.max" v-model="value" />
		</div>
		<input :id="props.id" type="range" min="0" :max="props.max" v-model="value" />
	</label>
</template>

<script setup>
import { defineProps, ref } from 'vue'

const props = defineProps({
	id: {
		type: String,
		required: true,
	},
	label: {
		type: String,
		required: true,
	},
	max: {
		type: Number,
		default: 100,
	},
})

const value = ref(0)
</script>

<style scoped lang="scss">
.input-range {
	width: 100%;
	font-style: normal;
	font-weight: 400;
	font-size: 1rem;

	&__label {
		@include flex(false, space-between, center);

		input[type='number'] {
			all: unset;
			text-align: end;
		}
	}

	input[type='range'] {
		all: unset;
		width: 100%;
		margin-top: 28px;
		height: 1px;
		background: #ffffff33;

		&::-webkit-slider-thumb {
			-webkit-appearance: none;
			height: 20px;
			width: 20px;
			border-radius: 50%;
			background: $gradient;
			cursor: ew-resize;
		}
	}
}
</style>
