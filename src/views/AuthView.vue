<template>
	<main class="auth">
		<LogoDefault />
		<nav>
			<ButtonLink label="Se connecter" target="/login" white />
			<ButtonLink label="S'inscrire" target="/register" />
		</nav>
	</main>
</template>

<script setup>
import LogoDefault from '@/components/LogoDefault.vue'
import ButtonLink from '@/components/ButtonLink.vue'
</script>

<style lang="scss" scoped>
.auth {
	position: relative;
	padding: $main-space;
	height: 100vh;
	@include flex(column, center, center);
	.logo {
		position: absolute;
		top: space(5);
	}

	nav {
		@include flex(column, false, center, space(2));
	}
}
</style>
