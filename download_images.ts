import { promises as fs } from 'fs';
import path from 'path';

const CONCURRENCY_LIMIT = 50;
const GAMES_JSON_PATH = path.join(process.cwd(), 'web/public/games.json');
const IMAGES_DIR = path.join(process.cwd(), 'images');

interface Game {
    id: string;
    slug: string;
    image: string;
}

async function downloadImage(game: Game) {
    const ext = path.extname(game.image) || '.jpg';
    const filename = `${game.slug}${ext}`;
    const filePath = path.join(IMAGES_DIR, filename);

    // Check if exists
    try {
        await fs.access(filePath);
        return; // Skip if exists
    } catch { }

    try {
        const response = await fetch(game.image);
        if (!response.ok) throw new Error(`Failed to fetch ${game.image}: ${response.statusText}`);

        const buffer = await response.arrayBuffer();
        await fs.writeFile(filePath, Buffer.from(buffer));
        // console.log(`Downloaded: ${filename}`);
    } catch (error) {
        console.error(`Error downloading ${game.slug}:`, error);
    }
}

async function main() {
    console.log(`Reading games from ${GAMES_JSON_PATH}...`);
    const data = await fs.readFile(GAMES_JSON_PATH, 'utf8');
    const games: Game[] = JSON.parse(data);

    console.log(`Found ${games.length} games. Starting download to ${IMAGES_DIR}...`);

    let activeDownloads = 0;
    let completed = 0;
    const total = games.length;

    // Process in chunks or a queue to limit concurrency
    for (let i = 0; i < games.length; i += CONCURRENCY_LIMIT) {
        const chunk = games.slice(i, i + CONCURRENCY_LIMIT);
        await Promise.all(chunk.map(async (game) => {
            await downloadImage(game);
            completed++;
            if (completed % 100 === 0) {
                process.stdout.write(`\rProgress: ${completed}/${total} (${((completed / total) * 100).toFixed(1)}%)`);
            }
        }));
    }

    console.log('\nDownload complete!');
}

main().catch(console.error);
