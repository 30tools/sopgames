import { write } from "bun";
import { mkdir } from "node:fs/promises";

const URLs = [
    "https://www.4j.com/ajax_loadmoregames.php?from=0&num=120000&type=hot",
    "https://www.4j.com/ajax_loadmoregames.php?from=0&num=1000000002&type=best"
];
const OUTPUT_DIR = "games";

async function fetchFromUrl(url: string) {
    console.log(`Fetching data from ${url}...`);
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const htmlContent = await response.text();
        console.log(`Successfully fetched ${htmlContent.length} bytes of data.`);

        // Regex to match game data
        const pattern = /<div class="thumb" id='game-(\d+)'><a href="([^"]+)"><img src='([^']+)' alt="[^"]*"  \/><span class='GameName'>(.*?)<\/span><span class='GameRating'>([\d.]+)<\/span><\/a><\/div>/g;

        let match;
        let count = 0;

        while ((match = pattern.exec(htmlContent)) !== null) {
            const [_, gameId, gameUrlSuffix, imageUrl, gameName, rating] = match;

            const slug = gameUrlSuffix.startsWith('/') ? gameUrlSuffix.slice(1) : gameUrlSuffix;

            const gameData = {
                id: gameId,
                name: gameName,
                slug: slug,
                url: `https://www.4j.com${gameUrlSuffix}`,
                embedUrl: `https://www.4j.com/embed${gameUrlSuffix}`,
                image: imageUrl,
                rating: rating,
            };

            const outputPath = `${OUTPUT_DIR}/${gameId}.json`;
            await write(outputPath, JSON.stringify(gameData, null, 2));
            count++;
        }

        console.log(`Successfully processed ${count} games from URL.`);
        return count;

    } catch (error) {
        console.error(`Error fetching from ${url}:`, error);
        return 0;
    }
}

async function fetchAndSaveGames() {
    console.log(`Creating directory: ${OUTPUT_DIR}`);
    await mkdir(OUTPUT_DIR, { recursive: true });

    let totalGames = 0;
    for (const url of URLs) {
        totalGames += await fetchFromUrl(url);
    }

    console.log(`Finished. Processed potential total of ${totalGames} game entries (duplicates handled by file overwrite).`);
}

fetchAndSaveGames();
