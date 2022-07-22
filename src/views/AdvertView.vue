<template>
	<main class="advert" v-if="advert">
		<img :src="'http://kaze.theorige.com' + advert.attributes.covers.data[0].attributes.formats.medium.url" alt="Couverture de l'annonce" />
		<div class="advert__content">
			<h1>{{ advert.attributes.type === 'flat' ? 'Appartement' : 'Maison' }} de {{ advert.attributes.area }} m²</h1>
			<span class="advert__content_district">{{ advert.attributes.adress }}</span>
			<div class="advert__content_tags">
				<div class="tag">3 chambres</div>
				<div class="tag">34m²</div>
				<div class="tag">Festif</div>
				<div class="tag">Calme</div>
			</div>
			<p>
				{{ advert.attributes.description }}
			</p>
			<span class="advert__content_price">à partir de {{ Math.min(...rooms.map((room) => room.rent)) }} € / mois</span>

			<h2>{{ rooms.length > 1 ? 'Les chambres' : 'La chambre' }}</h2>
			<table class="advert__content_rooms">
				<thead>
					<tr>
						<th>Superficie</th>
						<th>Loyer (HC)</th>
						<th>Dispo</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="room in rooms" :key="room">
						<td>{{ room.area }} m²</td>
						<td>{{ room.rent }} €</td>
						<td>{{ room.disponibility }}</td>
					</tr>
				</tbody>
			</table>

			<h2>{{ mates.length > 1 ? 'Les colocs' : 'Le coloc' }}</h2>
			<table class="advert__content_mates">
				<thead>
					<tr>
						<th>Nom</th>
						<th>Age</th>
						<th>Situation</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="mate in mates" :key="mate">
						<td>{{ mate.name }} {{ mate.gender !== '' ? '(' + mate.gender + ')' : '' }}</td>
						<td>{{ mate.age }}</td>
						<td>{{ situations[mate.situation] }}</td>
					</tr>
				</tbody>
			</table>
		</div>
	</main>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const token = localStorage.getItem('jwt')
// const user = JSON.parse(localStorage.getItem('user'))
const route = useRoute()
const advert = ref()

const rooms = [
	{ rent: 400, area: 20, disponibility: '2022-07-20' },
	{ rent: 300, area: 16, disponibility: '2022-07-20' },
]

const mates = [
	{ name: 'Rapheal', age: 22, gender: 'F', situation: 'student' },
	{ name: 'John', age: 25, gender: 'M', situation: 'apprentice' },
	{ name: 'Lorie', age: 28, gender: '', situation: 'apprentice' },
]

const situations = {
	student: 'Etudiant',
	apprentice: 'Alternant',
	worker: 'Alternant',
	unemployed: 'Sans emploi',
}

onBeforeMount(async () => {
	const { data } = await axios.get('http://kaze.theorige.com/api/colocations/' + route.params.id + '?populate=*', {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})
	advert.value = data.data
	document.title = 'Kaze - ' + (data.data.attributes.type === 'flat' ? 'Appartement' : 'Maison') + ' de ' + data.data.attributes.area + 'm²'
})
</script>

<style lang="scss">
.advert {
	position: relative;
	padding: 0 0 space(12) 0;
	width: 100%;
	@include flex(column, false, center, space(5));

	img {
		width: 100%;
		aspect-ratio: 16 / 9;
	}

	&__content {
		width: 100%;
		padding: 0 $main-space;
		@include flex(column, false, stretch, space(2));

		h1 {
			font-size: 1.25rem;
		}

		&_district {
			font-size: 0.875rem;
			font-weight: 300;
			margin-top: space(-1);
		}

		&_tags {
			overflow: auto;
			scrollbar-width: none;
			@include flex(false, false, center, space(2));
			width: calc(100% + space(6));
			margin-left: space(-3);
			padding: 0 space(3);
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

			&::-webkit-scrollbar {
				display: none;
			}
		}

		p {
			font-size: 0.875rem;
			font-weight: 300;
			line-height: 160%;
		}

		&_price {
			font-size: 1.125rem;
			text-align: right;
			font-weight: 500;
			margin-top: space(2);
		}

		h2 {
			font-size: 1.25rem;
			margin-top: space(3);
		}

		&_rooms,
		&_mates {
			thead {
				tr {
					height: space(4);

					th {
						text-align: left;
						font-size: 0.875rem;
						font-weight: 400;
						text-transform: uppercase;
						color: #bfbfbf;
					}
				}
			}

			tbody {
				tr {
					height: space(6);

					&:nth-child(1) {
						border-top: 1px solid $border-color;
					}

					td {
						border-bottom: 1px solid $border-color;

						&:nth-child(2) {
						}

						&:nth-child(3) {
						}
					}
				}
			}
		}
	}
}
</style>
