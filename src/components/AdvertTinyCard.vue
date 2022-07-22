<template>
	<a :href="props.link" class="TinyCard__link">
		<article class="TinyCard">
			<figure class="TinyCard__img-container">
				<img :src="props.thumbnail" class="TinyCard__img" />
			</figure>
			<div class="TinyCard__content">
				<h2 class="TinyCard__name">{{ props.name }}</h2>
				<span class="TinyCard__adress">{{ props.adress }}</span>
				<span class="TinyCard__price">{{ props.price }} €</span>
			</div>
		</article>
	</a>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
	name: {
		type: String,
		required: true,
	},
	adress: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	thumbnail: {
		type: String,
		required: true,
	},
	link: {
		type: String,
		required: true,
	},
	required: Boolean,
	model: String,
})

// const emit = defineEmits(['update:model'])
</script>

<style scoped lang="scss">
.TinyCard {
	@include flex(column, flex-start, stretch, false);
	@include backdrop;
	border-radius: 10px;
	width: 100%;
	height: 100%;
	overflow: hidden;

	&__link {
		display: flex !important;
		height: 100%;
	}
	
	&__img {
		&-container {
			width: 100%;
		}

		-o-object-fit: cover;
		-o-object-position: center;
		object-fit: cover;
		object-position: center;
		height: auto;
		width: 100%;
		aspect-ratio: 16/9;
	}

	&__content {
		@include flex(column, flex-start, flex-start, 0.5rem);
		padding: space(2) space(1.5);
		flex-grow: 1;
	}

	&__name {
		font-size: 0.95rem;
		line-height: 1.3rem;
	}

	&__adress {
		font-weight: 300;
		font-size: 0.7rem;
		margin-bottom: space(1);
	}

	&__price {
		align-self: flex-end;
		margin-top: auto;
		font-size: 0.8em;
	}
}
</style>
