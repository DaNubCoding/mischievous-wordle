<script lang="ts">
	import { Wordle } from "$lib";
</script>

<div id="main-container">
	<div id="topbar">
		<h1 id="title">Mischievous Wordle</h1>
	</div>

	<Wordle />
</div>



<style lang="scss">

@use "$lib/styles/theme.scss" as *;

@font-face {
	font-family: "WordleFont";
	src: url("neue-helvetica-75-bold.otf") format("opentype");
	font-weight: 400;
	font-style: normal;
	font-display: swap;
}

:root {
	background-color: $bg-color;
	color: $text-color;
	font-family: "WordleFont", sans-serif;
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
