import { write } from "bun";
import { mkdir } from "node:fs/promises";

const URL = "https://www.4j.com/ajax_loadmoregames.php?from=0&num=120000&type=hot";
const OUTPUT_DIR = "games";

async function fetchAndSaveGames() {
    console.log(`Creating directory: ${OUTPUT_DIR}`);
    await mkdir(OUTPUT_DIR, { recursive: true });

    console.log(`Fetching data from ${URL}...`);
    try {
        const response = await fetch(URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const htmlContent = await response.text();
        console.log(`Successfully fetched ${htmlContent.length} bytes of data.`);

        // Regex to match game data
        // <div class="thumb" id='game-22508'><a href="/Magic-Piano-Online"><img src='https://www.4j.com/cdn-cgi/image/quality=78,fit=cover,format=auto/thumb/201705/Magic-Piano-Online.jpg' alt="Magic Piano Online"  /><span class='GameName'>Magic Piano Online</span><span class='GameRating'>3.794875</span></a></div>
        const pattern = /<div class="thumb" id='game-(\d+)'><a href="([^"]+)"><img src='([^']+)' alt="[^"]*"  \/><span class='GameName'>(.*?)<\/span><span class='GameRating'>([\d.]+)<\/span><\/a><\/div>/g;

        let match;
        let count = 0;

        while ((match = pattern.exec(htmlContent)) !== null) {
            const [_, gameId, gameUrlSuffix, imageUrl, gameName, rating] = match;

            const gameData = {
                id: gameId,
                name: gameName,
                url: `https://www.4j.com${gameUrlSuffix}`,
                image: imageUrl,
                rating: rating,
            };

            const outputPath = `${OUTPUT_DIR}/${gameId}.json`;
            await write(outputPath, JSON.stringify(gameData, null, 2));
            count++;
        }

        console.log(`Successfully saved ${count} games to '${OUTPUT_DIR}/'.`);

    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

fetchAndSaveGames();
