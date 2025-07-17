<script lang="ts">
	interface TileProps {
		letter: string;
		status: "empty" | "input" | "correct" | "present" | "absent";
		colIndex: number;
	}

	let { letter, status, colIndex }: TileProps = $props();
</script>

<div class="tile {status}">{letter}</div>

<style lang="scss">

@use "$lib/styles/theme.scss" as *;

.tile {
	display: inline-block;
	width: 50px;
	aspect-ratio: 1;
	text-align: center;
	font-size: 2rem;
	border: 2px solid $border-color;
	margin: 5px;

	&.input {
		border-color: $input-border-color;
	}

	&.correct {
		background-color: $correct-color;
		border-color: transparent;
		color: $invert-text-color;
	}

	&.present {
		background-color: $present-color;
		border-color: transparent;
		color: $invert-text-color;
	}

	&.absent {
		background-color: $absent-color;
		border-color: transparent;
		color: $invert-text-color;
	}
}

</style>
