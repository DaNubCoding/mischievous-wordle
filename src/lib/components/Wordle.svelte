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
					flipping: false,
				})
			)
		)
	)
	const lieCounters = $state(
		Array.from({ length: ROWS }, () => 0)
	);

	let row = $state(0);
	let col = $state(0);

	let animating = false;

	function handleKeyDown(event: KeyboardEvent) {
		if (animating) return;

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
				determineLies(row);
				playFlipAnimation(row);

				row++;
				col = 0;

				animating = true;
				setTimeout(() => {
					animating = false;
				}, 500 * COLS + 500);
			}
		}
	}

	function checkWord(row: number) {
		// Store the statuses first
		board[row].forEach((tile, i) => {
			if (tile.letter === WORD[i]) {
				statuses[i] = "correct";
			} else if (WORD.includes(tile.letter)) {
				statuses[i] = "present";
			} else {
				statuses[i] = "absent";
			}
		});

		board[row].forEach((tile, i) => setTimeout(() => {
			if (i in lies) {
				tile.status = lies[i];
				return;
			}
			tile.status = statuses[i];
		}, 500 * i + 500));
		// + 500 to apply the class right at the middle of the flip animation
	}

	let statuses: { [key: number]: "correct" | "present" | "absent" } = {};
	let lies: { [key: number]: "correct" | "present" | "absent" } = {};

	function determineLies(row: number) {
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
			console.log(statuses[tileIndex]);
			allStatuses.splice(allStatuses.indexOf(statuses[tileIndex]), 1);
			// Randomly select a new status from the remaining two statuses
			const newStatus = allStatuses[Math.round(Math.random())];
			console.log(`Letter ${board[row][tileIndex].letter} at ${tileIndex} changed from ${statuses[tileIndex]} to ${newStatus}`);
			lies[tileIndex] = newStatus as "correct" | "present" | "absent";
		}

		lieCounters[row] += liesCount;
	}

	function playFlipAnimation(row: number) {
		board[row].forEach((tile, i) => setTimeout(() => {
			tile.flipping = true;
			setTimeout(() => {
				tile.flipping = false;
			}, 1000); // undo flag after 100ms of animation
		}, 500 * i));
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
						<Tile letter={tile.letter} status={tile.status} flipping={tile.flipping} />
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
