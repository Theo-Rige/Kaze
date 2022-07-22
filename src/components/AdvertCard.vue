<template>
	<div
		class="card"
		v-if="isShowing"
		ref="interactElement"
		:style="{ transform: transformString }"
		:class="{
			animating: isInteractAnimating,
			current: props.current,
		}"
	>
		<div class="card__wrapper">
			<img :src="'http://kaze.theorige.com' + props.card.attributes.covers.data[0].attributes.formats.medium.url" alt="Image de présentation" />
			<div class="card__content">
				<h2>{{ props.card.attributes.type === 'flat' ? 'Appartement' : 'Maison' }} de {{ props.card.attributes.area }} m²</h2>
				<span class="card__content_district">{{ props.card.attributes.adress }}</span>
				<div class="card__content_tags">
					<div class="tag">3 chambres</div>
					<div class="tag">34m²</div>
					<div class="tag">Festif</div>
				</div>
				<span class="card__content_price">400 € / mois</span>
				<div class="card__content_actions">
					<ButtonDefault round @click="playCard(SAVE_CARD)"><BookmarkIcon /></ButtonDefault>
					<ButtonLink label="Voir" gradient :target="'/advert/' + props.card.id" />
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { defineProps, defineEmits, ref, reactive, watch, computed, onMounted, onBeforeUnmount } from 'vue'
import ButtonDefault from '@/components/ButtonDefault.vue'
import ButtonLink from '@/components/ButtonLink.vue'
import { BookmarkIcon } from '@heroicons/vue/outline'
import interact from 'interactjs'

const props = defineProps({
	card: {
		type: Object,
		required: true,
	},
	action: {
		required: true,
	},
	current: {
		type: Boolean,
		required: true,
	},
})

const emit = defineEmits(['cardAccepted', 'cardRejected', 'cardSaved', 'hideCard'])

const interactElement = ref()
const isShowing = ref(true)
const isInteractAnimating = ref(true)
const isInteractDragged = ref(null)

const ACCEPT_CARD = 'cardAccepted'
const REJECT_CARD = 'cardRejected'
const SAVE_CARD = 'cardSaved'
const interactMaxRotation = 15
const interactOutOfSightXCoordinate = 500
const interactOutOfSightYCoordinate = 600
const interactYThreshold = 150
const interactXThreshold = 100

const interactPosition = reactive({
	x: 0,
	y: 0,
	rotation: 0,
})

const transformString = computed(() => {
	if (!isInteractAnimating.value || isInteractDragged.value) {
		const { x, y, rotation } = interactPosition
		return `translate3D(${x}px, ${y}px, 0) rotate(${rotation}deg)`
	}

	return null
})

const playCard = (interaction) => {
	interactUnsetElement()

	switch (interaction) {
		case ACCEPT_CARD:
			interactSetPosition({
				x: interactOutOfSightXCoordinate,
				rotation: interactMaxRotation,
			})
			emit(ACCEPT_CARD, props.card.id)
			break
		case REJECT_CARD:
			interactSetPosition({
				x: -interactOutOfSightXCoordinate,
				rotation: -interactMaxRotation,
			})
			emit(REJECT_CARD, props.card.id)
			break
		case SAVE_CARD:
			interactSetPosition({
				y: interactOutOfSightYCoordinate,
			})
			emit(SAVE_CARD, props.card.id)
			break
	}

	hideCard()
}

const hideCard = () => {
	setTimeout(() => {
		isShowing.value = false
		emit('hideCard', props.card)
	}, 300)
}

const interactUnsetElement = () => {
	interact(interactElement.value).unset()
	isInteractDragged.value = true
}

const interactSetPosition = (coordinates) => {
	const { x = 0, y = 0, rotation = 0 } = coordinates
	interactPosition.x = x
	interactPosition.y = y
	interactPosition.rotation = rotation
}

watch(
	() => props.action,
	(newAction) => {
		if (props.current) {
			switch (newAction) {
				case ACCEPT_CARD:
					playCard(ACCEPT_CARD)
					break
				case REJECT_CARD:
					playCard(REJECT_CARD)
					break
			}
		}
	}
)

const resetCardPosition = () => {
	interactSetPosition({ x: 0, y: 0, rotation: 0 })
}

onMounted(() => {
	const element = interactElement.value
	interact(element).draggable({
		onstart: () => {
			isInteractAnimating.value = false
		},
		onmove: (event) => {
			const x = interactPosition.x + event.dx
			const y = interactPosition.y + event.dy

			let rotation = interactMaxRotation * (x / interactXThreshold)

			if (rotation > interactMaxRotation) rotation = interactMaxRotation
			else if (rotation < -interactMaxRotation) rotation = -interactMaxRotation

			interactSetPosition({ x, y, rotation })
		},
		onend: () => {
			const { x, y } = interactPosition
			isInteractAnimating.value = true

			if (x > interactXThreshold) playCard(ACCEPT_CARD)
			else if (x < -interactXThreshold) playCard(REJECT_CARD)
			else if (y > interactYThreshold) playCard(SAVE_CARD)
			else resetCardPosition()
		},
	})
})

onBeforeUnmount(() => {
	interact(interactElement.value).unset()
})
</script>

<style lang="scss" scoped>
.card {
	overflow: hidden;
	width: 100%;
	border-radius: 20px;
	position: absolute;
	bottom: 0;
	touch-action: none;
	user-select: none;
	pointer-events: none;
	will-change: transform, opacity;
	background: $dark-green;
	transform-origin: 50%, 100%;
	@include flex(column, false, center, false);

	&::before,
	&::after {
		content: '';
		position: absolute;
		z-index: -1;
		width: 60vw;
		height: 60vw;
		border-radius: 50%;
		background: #42865b;
		filter: blur(20vw);
	}

	&::before {
		top: 0;
		right: -25%;
	}

	&::after {
		bottom: 10%;
		left: -25%;
	}

	&__wrapper {
		width: 100%;
		@include backdrop;
		@include flex(column, false, stretch);

		img,
		&_image {
			width: 100%;
			aspect-ratio: 16 / 9;
		}
		.card__content {
			width: 100%;
			padding: space(3);
			@include flex(column, false, stretch, space(2));

			h2 {
				font-size: 1.25rem;
			}

			&_district {
				font-size: 0.875rem;
				font-weight: 300;
				margin-top: space(-1);
			}

			&_tags {
				overflow: hidden;
				@include flex(false, false, center, space(2));
				.tag {
					flex-shrink: 0;
					padding: space(1) space(2);
					border-radius: 25px;
					font-weight: 500;
					font-size: 0.875rem;
					color: $dark-green;
					background: $gradient;
					@include flex(false, center, center);
					@include backdrop;
				}
			}

			p {
				display: -webkit-box;
				-webkit-line-clamp: 3;
				-webkit-box-orient: vertical;
				overflow: hidden;
				font-size: 0.875rem;
				font-weight: 300;
				line-height: 150%;
			}

			&_price {
				font-size: 1.125rem;
				text-align: right;
				font-weight: 500;
			}

			&_actions {
				@include flex(false, false, center, space(3));
			}
		}
	}

	&.current {
		pointer-events: auto;
	}

	&.animating {
		transition: transform 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275);
	}

	&:nth-child(2) {
		box-shadow: 0px 2.2px 2.2px rgba(0, 0, 0, 0.02), 0px 5.3px 5.3px rgba(0, 0, 0, 0.028), 0px 9.9px 10px rgba(0, 0, 0, 0.035), 0px 17.6px 17.9px rgba(0, 0, 0, 0.042),
			0px 33px 33.4px rgba(0, 0, 0, 0.05), 0px 79px 80px rgba(0, 0, 0, 0.07);
	}

	&:nth-child(3) {
		transform: translateY(55vh * 0.06 * 1) scale(calc(1 - (0.08 * 1)));
		box-shadow: 0px 2.2px 2.2px rgba(0, 0, 0, 0.02), 0px 5.3px 5.3px rgba(0, 0, 0, 0.028), 0px 9.9px 10px rgba(0, 0, 0, 0.035), 0px 17.6px 17.9px rgba(0, 0, 0, 0.042),
			0px 33px 33.4px rgba(0, 0, 0, 0.05), 0px 79px 80px rgba(0, 0, 0, 0.07);
	}

	&:nth-child(n + 4) {
		transform: translateY(55vh * 0.06 * 2) scale(calc(1 - (0.08 * 2)));
	}
}
</style>
