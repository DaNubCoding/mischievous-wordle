import { type TileStatus } from "$lib/types";

interface StatusResponse {
    statuses: TileStatus[];
    lieCount: number;
}

export async function getStatuses(guess: string, row: number): Promise<StatusResponse> {
    const res = await fetch("/api/check-word", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guess: guess, guessIndex: row })
    });

    return res.json();
}
