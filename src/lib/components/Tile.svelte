<script lang="ts">
	import { type TileStatus } from "./types";

	interface TileProps {
		letter: string;
		status: TileStatus;
	}

	let { letter, status }: TileProps = $props();
	let flipping = $state(false);

	export function flip(newStatus: TileStatus, duration: number) {
		flipping = true;

		setTimeout(() => {
			status = newStatus;
			console.log("hi");
		}, duration / 2);

		setTimeout(() => {
			flipping = false;
		}, duration);
	}

</script>





<div class="tile {status}" class:flipping={flipping}>{letter}</div>





<style lang="scss">

@use "$lib/styles/theme.scss" as *;

@keyframes pop {
	0% {transform: scale(1)}
	50% {transform: scale(1.05)}
	100% {transform: scale(1)}
}

@keyframes unpop {
	0% {
		transform: scale(1);
		rotate: 0deg;
	}
	50% {
		transform: scale(0.95);
		rotate : -5deg;
	}
	100% {
		transform: scale(1);
		rotate: 0deg;
	}
}

.tile {
	display: inline-block;
	width: 50px;
	aspect-ratio: 1;
	text-align: center;
	align-content: center;
	font-size: 2rem;
	border: 2px solid $border-color;
	margin: 5px;

	&.empty {
		background-color: $bg-color;

		animation: unpop 0.1s ease;
	}

	&.input {
		background-color: $bg-color;
		border-color: $input-border-color;

		animation: pop 0.1s ease;
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

	@keyframes flip {
		0% {
			transform: scale(1, 1)
		}
		50% {
			transform: scale(1, 0);
		}
		100% {
			transform: scale(1, 1);
		}
	}

	&.flipping {
		animation: flip 0.8s ease-in-out;
	}
}

</style>
