<script lang="ts">
	import { onMount } from "svelte";
	import Tile from "./Tile.svelte";
	import { type TileStatus } from "../types";
	import { getStatuses } from "./validation";

	const ROWS = 6;
	const COLS = 5;

	const board = $state(
		Array.from({ length: ROWS },
			() => Array.from({ length: COLS },
				() => ({
					letter: "",
					status: "empty" as TileStatus,
				})
			)
		)
	)
	let tiles: Tile[][] = Array.from(
		{ length: ROWS },
		() => Array(COLS).fill(null)
	);
	const lieCounters = $state(
		Array.from({ length: ROWS }, () => 0)
	);

	let row = $state(0);
	let col = $state(0);

	function handleKeyDown(event: KeyboardEvent) {
		const key = event.key;

		if (/^[a-zA-Z]$/.test(key)) {
			if (col < COLS) {
				const tile = board[row][col++];
				tile.letter = key.toUpperCase();
				tile.status = "input";
			}
		} else if (key === "Backspace") {
			if (col > 0) {
				const tile = board[row][--col];
				tile.letter = "";
				tile.status = "empty";
			}
		} else if (key === "Enter") {
			if (col === COLS) {
				checkWord(row);
				row++;
				col = 0;
			}
		}
	}

	async function checkWord(row: number) {
		let { statuses, lieCount } = await getStatuses(
			board[row].map(tile => tile.letter).join(""), row
		);
		lieCounters[row] = lieCount;

		// Flip each tile in the row with a delay
		tiles[row].forEach((tile, i) => setTimeout(() => {
			tile.flip(statuses[i], 800);
		}, 400 * i));
	}

	onMount(() => {
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	});
</script>





<div id="game-container">
	<div id="game">
		{#each board as row, i}
			<div class="tile-row-container">
				<div class="left-spacer"></div>
				<div class="tile-row">
					{#each row as tile, j}
						<Tile
						letter={tile.letter}
						status={tile.status}
						bind:this={tiles[i][j]}
						/>
					{/each}
				</div>
				<div class="lie-counter" class:visible={lieCounters[i] > 0}>
					{lieCounters[i]}
				</div>
			</div>
		{/each}
	</div>
	<div id="keyboard">

	</div>
</div>





<style lang="scss">

@use "$lib/styles/theme.scss" as *;

#game-container {
	display: flex;
	flex-direction: column;
	margin: 2rem;
}

#game {
	display: flex;
	flex-direction: column;
}

.tile-row-container {
	display: flex;
	flex-direction: row;
	gap: 10px;
}

.tile-row {
	display: flex;
	flex-direction: row;
}

.left-spacer,
.lie-counter {
	display: flex;
	align-items: center;
	align-self: center;
	justify-content: center;
	height: 15px;
	aspect-ratio: 1;
	padding: 0.5rem;
	background-color: $border-color;
	color: $text-color;
	font-size: 1.2rem;
	z-index: -1;
	opacity: 0; // Hidden normally, but there for alignment
}

.lie-counter {
	transition: opacity 0.4s ease;

	@keyframes slide-out {
		from {transform: translateX(-50px)}
		to {transform: translateX(0)}
	}

	&.visible {
		opacity: 1;
		animation: slide-out 0.8s;
	}
}

</style>
