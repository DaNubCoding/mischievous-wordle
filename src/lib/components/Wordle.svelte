<script lang="ts">
	import { onMount } from "svelte";
	import Tile from "./Tile.svelte";

	const WORD = "HELLO"; // Testing word

	const ROWS = 6;
	const COLS = 5;

	const board = $state(
		Array.from({ length: ROWS },
			() => Array.from({ length: COLS },
				() => ({
					letter: "",
					status: "empty" as "empty" | "input" | "correct" | "present" | "absent",
				})
			)
		)
	)
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
				applyLies(row);
				row++;
				col = 0;
			}
		}
	}

	function checkWord(row: number) {
		board[row].forEach((tile, i) => {
			if (tile.letter === WORD[i]) {
				tile.status = "correct";
			} else if (WORD.includes(tile.letter)) {
				tile.status = "present";
			} else {
				tile.status = "absent";
			}
		});
	}

	function applyLies(row: number) {
		// Decide how many lies (1 to 3)
		const liesCount = Math.floor(Math.random() * 3 + 1);
		let indices = [0, 1, 2, 3, 4];

		for (let i = 0; i < liesCount; i++) {
			// Randomly select a index from the remaining indices
			const index = Math.floor(Math.random() * indices.length);
			// Remove it from the indices array to prevent picking it again
			const tileIndex = indices.splice(index, 1)[0];

			let allStatuses = ["correct", "present", "absent"];
			// Remove current status to avoid the lie being the same one
			allStatuses.splice(allStatuses.indexOf(board[row][tileIndex].status), 1);
			// Randomly select a new status from the remaining two statuses
			const newStatus = allStatuses[Math.round(Math.random())];
			console.log(`Letter ${board[row][tileIndex].letter} at ${tileIndex} changed from ${board[row][tileIndex].status} to ${newStatus}`);
			// Apply the new status to the tile
			board[row][tileIndex].status = newStatus as "correct" | "present" | "absent";
		}

		lieCounters[row] += liesCount;
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
						<Tile letter={tile.letter} status={tile.status} colIndex={j} />
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
	justify-content: space-between;
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
