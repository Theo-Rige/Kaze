<template>
	<button :type="props.type" :class="{ round: props.round, transparent: props.transparent, white: props.white, gradient: props.gradient }">
		<slot>{{ props.label }}</slot>
	</button>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
	label: {
		type: String,
	},
	type: {
		type: String,
		default: 'button',
	},
	round: {
		type: Boolean,
		default: false,
	},
	transparent: {
		type: Boolean,
		default: false,
	},
	white: {
		type: Boolean,
		default: false,
	},
	gradient: {
		type: Boolean,
		default: false,
	},
})
</script>

<style lang="scss">
button {
	all: unset;
	box-sizing: border-box;
	height: $input-height;
	padding: 0 space(3);
	border-radius: 25px;
	font-weight: 500;
	color: $white;
	flex-shrink: 0;
	flex-grow: 1;
	@include flex(false, center, center);
	@include backdrop;
	// @include transition(background);

	&:hover {
		cursor: pointer;
	}

	&:disabled {
		filter: brightness(0.7);
	}

	&.transparent {
		background: none;
		backdrop-filter: none;
	}

	&.white,
	&.gradient {
		color: $dark-green;
	}

	&.white {
		background: $white;
	}

	&.gradient {
		background: $gradient;
	}

	&.round {
		padding: 0;
		width: $input-height;
		flex-grow: 0;
	}

	svg {
		height: 20px;
	}
}
</style>
