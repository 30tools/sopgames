import { promises as fs } from 'fs';
import path from 'path';
import { Game } from '../../../types';
import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeft, Star } from 'lucide-react';
import { GameInteractions } from '../../../components/GameInteractions';

const BASE_URL = 'https://sopgames.30tools.com';

async function getGames(): Promise<Game[]> {
    try {
        // Try file system first (Works at build time & local dev)
        const filePath = path.join(process.cwd(), 'public', 'games.json');
        const fileContents = await fs.readFile(filePath, 'utf8');
        return JSON.parse(fileContents);
    } catch (error) {
        // Fallback to network fetch (Works at runtime on Cloudflare)
        console.log('Falling back to network fetch for games.json');
        const res = await fetch(`${BASE_URL}/games.json`, { next: { revalidate: 3600 } });
        if (!res.ok) throw new Error('Failed to fetch game data');
        return res.json();
    }
}

export async function generateStaticParams() {
    const games = await getGames();
    // Build top 200 pages statically
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
            url: `${BASE_URL}/game/${slug}`,
            type: 'website',
        },
        alternates: {
            canonical: `${BASE_URL}/game/${slug}`,
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
            ratingCount: 100, // Placeholder
            bestRating: 5,
            worstRating: 1,
        },
        genre: ['Game', 'Arcade', 'Casual'],
        url: `${BASE_URL}/game/${slug}`,
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
            <main className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">
                {/* Cinematic Background */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-background/60 z-10" />
                    <div
                        className="w-full h-full opacity-30 blur-3xl scale-110"
                        style={{
                            backgroundImage: `url(${game.image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    />
                </div>

                <nav className="p-4 flex items-center justify-between border-b border-white/5 bg-background/40 backdrop-blur-md sticky top-0 z-50">
                    <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors group">
                        <div className="p-1 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
                            <ChevronLeft className="w-5 h-5" />
                        </div>
                        <span className="font-medium">Browse</span>
                    </Link>
                    <h1 className="font-bold text-lg hidden md:block text-white/90">{game.name}</h1>
                    <div className="w-20" />
                </nav>

                <div className="flex-1 flex flex-col items-center justify-start p-4 md:p-8 gap-8 relative z-20">
                    {/* Game Container */}
                    <div className="w-full max-w-6xl aspect-video bg-black/80 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 relative group">
                        <iframe
                            src={game.embedUrl}
                            className="w-full h-full border-0"
                            allowFullScreen
                            loading="lazy"
                            title={game.name}
                        />
                    </div>

                    {/* Metadata & Actions */}
                    <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-6">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight drop-shadow-lg">{game.name}</h1>

                                <div className="flex flex-wrap items-center gap-4 text-sm">
                                    <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full font-semibold shadow-lg shadow-primary/20">
                                        Free to Play
                                    </span>
                                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                                        <Star className="w-4 h-4 fill-current" />
                                        <span className="font-bold">{parseFloat(game.rating).toFixed(1)}</span>
                                        <span className="text-yellow-500/60 font-normal">/ 5.0</span>
                                    </div>
                                </div>
                            </div>

                            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                                Play <strong>{game.name}</strong> instantly in your browser. No downloads, no installation using SOP Games.
                                Experience seamless gameplay optimized for all devices.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-card/30 backdrop-blur-sm border border-white/5 h-fit">
                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Interactions</h3>
                            <GameInteractions game={game} />
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
