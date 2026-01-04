import { MetadataRoute } from 'next';
import { promises as fs } from 'fs';
import path from 'path';
import { Game } from '../types';

const BASE_URL = 'https://sopgames.30tools.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const filePath = path.join(process.cwd(), 'public', 'games.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const games: Game[] = JSON.parse(fileContents);

    const gameUrls = games.map((game) => ({
        url: `${BASE_URL}/game/${game.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    }));

    return [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        ...gameUrls,
    ];
}
