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

	onMount(() => {
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	});
</script>

<div id="game-container">
	<div id="game">
		{#each board as row, i}
			{#each row as tile, j}
				<Tile letter={tile.letter} status={tile.status} colIndex={j} />
			{/each}
		{/each}
	</div>
	<div id="keyboard">

	</div>
</div>

<style lang="scss">

#game-container {
	display: flex;
	flex-direction: column;
	margin: 2rem;
}

#game {
	display: grid;
	grid-template-columns: repeat(5, 50px);
	grid-template-rows: repeat(6, 50px);
	gap: 10px;
}

</style>
