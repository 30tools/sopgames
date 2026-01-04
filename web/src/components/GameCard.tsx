import Link from 'next/link';
import Image from 'next/image';
import { Game } from '../types';
import { Star } from 'lucide-react';

export function GameCard({ game }: { game: Game }) {
    // Parsing rating to 1 decimal place
    const rating = parseFloat(game.rating).toFixed(1);

    return (
        <Link href={`/game/${game.id}`} className="group relative block overflow-hidden rounded-xl bg-card border border-border transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/50">
            <div className="aspect-[4/3] w-full relative overflow-hidden">
                <Image
                    src={game.image}
                    alt={game.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            <div className="p-3">
                <h3 className="font-semibold text-sm truncate text-foreground group-hover:text-primary transition-colors">
                    {game.name}
                </h3>
                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span>{rating}</span>
                </div>
            </div>
        </Link>
    );
}
