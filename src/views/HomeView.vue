<template>
	<main class="home">
		<template v-if="cards.length == 0">
			<div class="empty-cards">
				<span>Aucune annonce disponible pour le moment ...</span>
				<ButtonDefault round white @click="resetProfile()"><RefreshIcon /></ButtonDefault>
			</div>
		</template>
		<template v-else>
			<div class="home__cards" v-if="user.publisher">
				<div class="card placeholder">
					<div class="card__wrapper">
						<div class="card__content_image"></div>
						<div class="card__content">
							<h2>Placeholder card</h2>
							<span class="card__content_district">Lorem</span>
							<div class="card__content_tags">
								<div class="tag">3 chambres</div>
								<div class="tag">34m²</div>
								<div class="tag">Festif</div>
								<div class="tag">Calme</div>
							</div>
							<span class="card__content_price">400 € / mois</span>
							<div class="card__content_actions">
								<ButtonDefault round></ButtonDefault>
								<ButtonDefault label="Voir" gradient />
							</div>
						</div>
					</div>
				</div>
				<AdvertCard
					v-for="(card, index) in cards"
					:key="card"
					:card="card"
					:current="index === 0"
					:action="action"
					:style="{ zIndex: cards.length - index }"
					@cardAccepted="$emit('update', 'postuled', parseInt(card.id)), (action = null)"
					@cardRejected="$emit('update', 'rejected', parseInt(card.id), false, true), (action = null)"
					@cardSaved="$emit('update', 'bookmarks', parseInt(card.id)), (action = null)"
					@hideCard="removeCardFromDeck"
				/>
			</div>

			<div class="home__actions" v-if="user.publisher">
				<ButtonDefault round @click="action = 'cardRejected'"><XIcon /></ButtonDefault>
				<ButtonDefault round gradient @click="action = 'cardAccepted'"><CheckIcon /></ButtonDefault>
			</div>
			<span class="empty" v-else>Le dashboard de l'annonceur arrive très prochainement</span>
		</template>
	</main>
</template>

<script setup>
import { ref, reactive, onBeforeMount } from 'vue'
import { XIcon, CheckIcon, RefreshIcon } from '@heroicons/vue/outline'
import AdvertCard from '@/components/AdvertCard.vue'
import ButtonDefault from '@/components/ButtonDefault.vue'

import axios from 'axios'

const token = localStorage.getItem('jwt')
const user = JSON.parse(localStorage.getItem('user'))

const excludes = reactive({
	postuled: {
		data: [],
	},
	rejected: {
		data: [],
	},
	bookmarks: {
		data: [],
	},
	query: '',
})
const cards = ref([])
const action = ref('')

const removeCardFromDeck = () => {
	cards.value.shift()
}

onBeforeMount(async () => {
	if (user.publisher) {
		console.log('publisher')
	} else {
		const getExcludes = await axios.get('http://theorige.com/api/users/' + user.id + '?fields[0]=rejected&populate[postuled][fields][0]=id&populate[bookmarks][fields][0]=id', {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})

		if (getExcludes.data.rejected !== null) {
			excludes.rejected.data = getExcludes.data.rejected
		}

		getExcludes.data.postuled.forEach((coloc) => {
			excludes.postuled.data.push(coloc.id)
		})

		getExcludes.data.bookmarks.forEach((bookmark) => {
			excludes.bookmarks.data.push(bookmark.id)
		})

		let index = 0
		excludes.rejected.data.forEach((id) => {
			excludes.query += `&filters[id][$notIn][${index}]=${id}`
			index++
		})

		excludes.postuled.data.forEach((id) => {
			excludes.query += `&filters[id][$notIn][${index}]=${id}`
			index++
		})

		excludes.bookmarks.data.forEach((id) => {
			excludes.query += `&filters[id][$notIn][${index}]=${id}`
			index++
		})

		const getColocations = await axios.get('http://theorige.com/api/colocations?populate=*' + excludes.query, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
		cards.value = getColocations.data.data
	}
})
const resetProfile = async () => {
	await axios.put(
		'http://theorige.com/api/users/' + user.id,
		{
			rejected: [],
			postuled: [],
			bookmarks: [],
		},
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}
	)
}
</script>

<style lang="scss">
.home {
	position: relative;
	padding: space(3) $main-space space(12) $main-space;
	height: 100%;
	width: 100%;
	@include flex(column, center, center, space(8));

	&__cards {
		position: relative;
		display: flex;
		width: 100%;

		.placeholder {
			position: relative;
			visibility: hidden;
			overflow: hidden;
			width: 100%;
			border-radius: 20px;
			@include flex(column, false, center, false);

			.card__wrapper {
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
					@include backdrop;
					@include flex(column, false, stretch, space(2));

					img,
					&_image {
						width: 100%;
						border-radius: 10px;
						aspect-ratio: 16 / 9;
					}

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
		}
	}

	&__actions {
		width: 100%;
		z-index: 20;
		@include flex(false, space-around, center);

		button {
			height: space(8);
			width: space(8);
			border-radius: space(8);

			svg {
				height: space(4);
			}
		}
	}
}

.empty-cards {
	span {
		text-align: center;
		font-size: 1.2rem;
		line-height: 1.5rem;
	}
	@include flex(column, center, center, space(4));
}
</style>
