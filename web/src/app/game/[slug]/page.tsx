import { promises as fs } from 'fs';
import path from 'path';
import { Game } from '../../../types';
import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeft, Star } from 'lucide-react';
import { GameInteractions } from '../../../components/GameInteractions';

async function getGames(): Promise<Game[]> {
    const filePath = path.join(process.cwd(), 'public', 'games.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContents);
}

export async function generateStaticParams() {
    const games = await getGames();
    // Build top 500 pages statically to save build time, others dynamic/on-demand if supported
    // But for full static export, we usually need all. 
    // Given cloudflare pages limit, let's limit to 200 for this demo build.
    return games.slice(0, 200).map((game) => ({
        slug: game.slug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const games = await getGames();
    const game = games.find((g) => g.slug === slug);

    if (!game) return { title: 'Game Not Found' };

    return {
        title: `${game.name} - Play Online for Free`,
        description: `Play ${game.name} online for free. No download required. Rated ${parseFloat(game.rating).toFixed(1)}/5.`,
        openGraph: {
            images: [game.image],
            url: `https://sopgames.30tools.com/game/${slug}`,
            type: 'website',
        },
        alternates: {
            canonical: `https://sopgames.30tools.com/game/${slug}`,
        },
    };
}

export default async function GamePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const games = await getGames();
    const game = games.find((g) => g.slug === slug);

    if (!game) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <h1 className="text-2xl">Game not found</h1>
            </div>
        );
    }

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'VideoGame',
        name: game.name,
        description: `Play ${game.name} online for free on SOP Games.`,
        image: game.image,
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: game.rating,
            ratingCount: 100, // Placeholder as we only have rating value
            bestRating: 5,
            worstRating: 1,
        },
        genre: ['Game', 'Arcade', 'Casual'], // Generic genres
        url: `https://sopgames.30tools.com/game/${slug}`,
        applicationCategory: 'Game',
        operatingSystem: 'Any',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <main className="min-h-screen bg-background text-foreground flex flex-col">

                <nav className="p-4 flex items-center justify-between border-b border-white/5 bg-background/50 backdrop-blur-md sticky top-0 z-50">
                    <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                        <span>Back to Browse</span>
                    </Link>
                    <h1 className="font-bold text-lg hidden md:block">{game.name}</h1>
                    <div className="w-20" /> {/* Spacer */}
                </nav>

                <div className="flex-1 flex flex-col items-center justify-start p-4 md:p-8 gap-6">
                    <div className="w-full max-w-6xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 relative group">
                        <iframe
                            src={game.embedUrl}
                            className="w-full h-full border-0"
                            allowFullScreen
                            loading="lazy"
                            title={game.name}
                        />
                    </div>

                    <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-bold mb-2">{game.name}</h1>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <span className="bg-primary/10 text-primary px-2 py-1 rounded-md border border-primary/20">Free to Play</span>
                                        <div className="flex items-center gap-1 text-yellow-500">
                                            <Star className="w-4 h-4 fill-current" />
                                            <span>{parseFloat(game.rating).toFixed(1)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <GameInteractions game={game} />
                    </div>
                </div>
            </main>
        </>
    );
}
