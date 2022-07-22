<template>
	<label class="input-text form-group">
		{{ props.label }}
		<slot>
			<input type="text" />
		</slot>
	</label>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
	label: {
		type: String,
		required: true,
	},
})
</script>

<style lang="scss">
.input-text {
	width: 100%;
	position: relative;
	@include label;

	input {
		all: unset;
		height: $input-height;
		width: 100%;
		margin-top: space(1);
		font-family: $poppins;
		font-style: normal;
		font-weight: 400;
		font-size: 1rem;
		color: $white;
		caret-color: $white;
		border-bottom: 1px solid $border-color;
		@include transition(border-bottom);

		&:focus {
			border-bottom: 1px solid $white;
		}

		// &:not(:focus):not(:placeholder-shown):valid {
		// 	border-bottom: 1px solid $success-color;
		// }

		&:not(:focus):not(:placeholder-shown):invalid {
			border-bottom: 1px solid $warning-color;
		}
	}

	.just-validate-error-label {
		margin-top: space(1);
		font-size: 0.875rem;
		color: $warning-color !important;
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
