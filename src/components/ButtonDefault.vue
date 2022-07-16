<template>
	<button :type="props.type" :class="{ transparent: props.transparent, white: props.white, gradient: props.gradient }">
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

<style scoped lang="scss">
button {
	all: unset;
	box-sizing: border-box;
	height: 50px;
	width: 100%;
	padding: 0 space(3);
	border-radius: 25px;
	font-weight: 500;
	color: $white;
	@include flex(false, center, center);
	@include backdrop;
	// @include transition(background);

	&:hover {
		cursor: pointer;
	}

	&.transparent {
		padding: 0;
		width: 50px;
		background: none;
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
}
</style>
