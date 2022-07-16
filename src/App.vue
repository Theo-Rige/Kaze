<template>
	<img src="@/assets/noise.webp" class="background" alt="Noise baqckground" />
	<router-view />
</template>

<script></script>

<style lang="scss">
* {
	box-sizing: border-box;
}

html {
	position: relative;
	margin: 0;
	padding: 0;
	width: 100vw;
	height: 100%;
	overflow: hidden;
}

body {
	position: relative;
	margin: 0;
	padding: 0;
	width: 100vw;
	height: 100%;
	overflow: hidden;
	font-family: $poppins;
	font-size: 100%;
	color: $white;
	background: $dark-green;
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
		filter: blur(30vw);
	}

	&::before {
		top: 0;
		right: -25%;
	}

	&::after {
		bottom: 10%;
		left: -25%;
	}

	.background {
		position: absolute;
		z-index: -1;
		top: 0;
		height: 100vh;
		aspect-ratio: 16/9;
		opacity: 0.4;
	}
}
</style>
