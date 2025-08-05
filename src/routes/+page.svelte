<script lang="ts">
	import { Wordle } from "$lib";
</script>

<div id="main-container">
	<div id="topbar">
		<h1 id="title">Mischievous Wordle</h1>
	</div>

	<Wordle />
</div>



<style global lang="scss">

@use "$lib/styles/theme.scss" as *;

:root {
	background-color: $bg-color;
	color: $text-color;
	font-family: sans-serif;
	font-weight: 700;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}

#main-container {
	display: flex;
	flex-direction: column;
	align-items: center;
}

#topbar {
	display: flex;
	top: 0;
	left: 0;
	width: 100%;

	background-color: var(--bg-color);
	border-color: #dfdfdf;
	border-style: solid;
	border-width: 0 0 1px 0;
}

#title {
	text-align: center;
	flex: 1;
	font-size: 2.2rem;
	margin: 1rem;
}

</style>
