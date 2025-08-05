import { type RequestHandler } from "@sveltejs/kit";
import { type TileStatus } from "$lib/types";

// Temporary hardcoded values
// Will be generated each day in the future
const WORD = "HELLO";
const LIES = [1, 2, 3, 2, 1, 0];

interface GuessRequest {
    guess: string;
    guessIndex: number;
}

export const POST: RequestHandler = async ({ request }) => {
    const { guess, guessIndex }: GuessRequest = await request.json();

    let statuses: TileStatus[] = [];
    for (let i = 0; i < WORD.length; i++) {
        if (guess[i] === WORD[i]) {
            statuses.push("correct");
        } else if (WORD.includes(guess[i])) {
            statuses.push("present");
        } else {
            statuses.push("absent");
        }
    }

    let indices = [0, 1, 2, 3, 4];
    for (let i = 0; i < LIES[guessIndex]; i++) {
        // Randomly select a index from the remaining indices
        const index = Math.floor(Math.random() * indices.length);
        // Remove it from the indices array to prevent picking it again
        const tileIndex = indices.splice(index, 1)[0];

        let allStatuses = ["correct", "present", "absent"];
        // Remove current status to avoid the lie being the same one
        allStatuses.splice(allStatuses.indexOf(statuses[tileIndex]), 1);
        // Randomly select a new status from the remaining two statuses
        const newStatus = allStatuses[Math.round(Math.random())];
        // Apply the lie
        statuses[tileIndex] = newStatus as TileStatus;
    }

    return new Response(JSON.stringify({
        statuses,
        lieCount: LIES[guessIndex]
    }), { headers: { "Content-Type": "application/json" } });
};
