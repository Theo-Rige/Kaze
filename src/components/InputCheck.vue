<template>
	<label :for="props.id" class="input-check">
		<input :id="props.id" :name="props.id" type="checkbox" />
		<span class="input-check__mark"><CheckIcon /></span>
		{{ props.label }}
	</label>
</template>

<script setup>
import { defineProps } from 'vue'
import { CheckIcon } from '@heroicons/vue/solid'

const props = defineProps({
	id: {
		type: String,
		required: true,
	},
	label: {
		type: String,
		required: true,
	},
})
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
