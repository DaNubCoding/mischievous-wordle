import { type TileStatus } from "./types";

const WORD = "HELLO";

export function getStatuses(word: string, liesCount: number): TileStatus[] {
    // Temporary local checking logic
    // Will query the server in the future

    let statuses: TileStatus[] = [];
    for (let i = 0; i < WORD.length; i++) {
        if (word[i] === WORD[i]) {
            statuses.push("correct");
        } else if (WORD.includes(word[i])) {
            statuses.push("present");
        } else {
            statuses.push("absent");
        }
    }

    // Decide how many lies (1 to 3)
    let indices = [0, 1, 2, 3, 4];
    for (let i = 0; i < liesCount; i++) {
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

    return statuses;
}
