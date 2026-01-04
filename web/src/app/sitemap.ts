import { MetadataRoute } from 'next';
import { Game } from '../types';

const BASE_URL = 'https://sopgames.30tools.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    let games: Game[] = [];
    try {
        const response = await fetch(`${BASE_URL}/games.json`, { next: { revalidate: 3600 } });
        if (response.ok) {
            games = await response.json();
        }
    } catch (error) {
        console.error('Failed to fetch games for sitemap:', error);
    }

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
