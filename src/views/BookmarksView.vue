<template>
	<main class="Bookmark">
		<ul class="Bookmark__list" v-if="bookmarks.length > 0">
			<li class="Bookmark__item" v-for="annonce in bookmarks" :key="annonce">
				<AdvertTinyCard
					:link="'/advert/' + annonce.id"
					:name="(annonce.type === 'flat' ? 'Appartement' : 'Maison') + ' de ' + annonce.area + ' m²'"
					:adress="annonce.adress"
					:price="Math.min(...annonce.rooms.map((room) => room.rent))"
					:thumbnail="'http://theorige.com' + annonce.covers[0].formats.small.url"
				/>
			</li>
		</ul>
		<div class="Bookmark__empty" v-else>
			<span class="Bookmark__empty__text">N'hésiter pas à enregistrer ou valider des annonces pour les voir içi</span>
			<ButtonLink label="Voir les annonces" gradient :target="'/'" />
		</div>
	</main>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue'
import AdvertTinyCard from '@/components/AdvertTinyCard.vue'
import ButtonLink from '@/components/ButtonLink.vue'

import axios from 'axios'

const token = localStorage.getItem('jwt')
const user = JSON.parse(localStorage.getItem('user'))
console.log(user)
const bookmarks = ref([])

onBeforeMount(async () => {
	if (user.publisher) {
		console.log('publisher')
	} else {
		// http://theorige.com/api/users?filters[username][$eq]=' + user.id

		const { data } = await axios.get('http://theorige.com/api/users/' + user.id + '?fields[0]=username&populate[bookmarks][populate][0]=covers', {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
		bookmarks.value = data.bookmarks
	}
})
</script>

<style lang="scss">
.Bookmark {
	width: 100%;
	display: flex;
	@include flex(column, stretch, center, false);
	&__empty {
		height: 70vh;
		@include flex(column, center, center, space(2));

		&__text {
			font-size: 1.5rem;
			line-height: 1.7rem;
			text-align: center;
		}
	}

	&__list {
		width: 100%;
		height: 100%;
		@include flex(row, false, stretch, space(3));
		flex-wrap: wrap;
	}
	&__item {
		width: 100%;
		@include flex(column, stretch, stretch, false);
		@media screen and (min-width: 280px) {
			width: calc(50% - space(1.5));
		}
	}
}
</style>
