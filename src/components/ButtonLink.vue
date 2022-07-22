<template>
	<router-link :to="props.target" :class="{ white: props.white, gradient: props.gradient }">{{ props.label }}</router-link>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
	label: {
		type: String,
		required: true,
	},
	target: {
		type: String,
		required: true,
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
a {
	all: unset;
	box-sizing: border-box;
	height: $input-height;
	width: 100%;
	padding: 0 space(3);
	border-radius: 25px;
	font-weight: 500;
	color: $white;
	@include flex(false, center, center);
	@include backdrop;

	&:hover {
		cursor: pointer;
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
