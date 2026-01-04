"use client";

import { useState, useMemo } from 'react';
import { Game } from '../types';
import { GameGrid } from './GameGrid';
import { Search, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

const GAMES_PER_PAGE = 36;

interface GameCatalogProps {
    initialGames: Game[];
}

export function GameCatalog({ initialGames }: GameCatalogProps) {
    const [games] = useState<Game[]>(initialGames);
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState<'rating' | 'newest'>('rating');
    const [page, setPage] = useState(1);

    // Derived state, no need for loading state as data is passed from server


    const filteredGames = useMemo(() => {
        let result = [...games];

        if (search) {
            const lowerSearch = search.toLowerCase();
            result = result.filter((game) =>
                game.name.toLowerCase().includes(lowerSearch)
            );
        }

        if (sort === 'rating') {
            result.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
        } else {
            // Assuming higher ID means newer as a proxy since we don't have date
            result.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        }

        return result;
    }, [games, search, sort]);

    const totalPages = Math.ceil(filteredGames.length / GAMES_PER_PAGE);
    const currentGames = filteredGames.slice(
        (page - 1) * GAMES_PER_PAGE,
        page * GAMES_PER_PAGE
    );



    return (
        <div className="space-y-8 animate-fade-in-up delay-300">
            {/* Controls Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card/50 backdrop-blur-xl p-2 rounded-2xl border border-white/10 shadow-xl ring-1 ring-white/5">
                {/* Search */}
                <div className="relative w-full md:w-96 group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search 14,000+ games..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        className="block w-full pl-10 pr-3 py-3 border-none rounded-xl leading-5 bg-white/5 text-foreground placeholder-muted-foreground focus:outline-none focus:bg-white/10 focus:ring-0 transition-all sm:text-sm"
                    />
                </div>

                {/* Sort & Stats */}
                <div className="flex items-center gap-4 w-full md:w-auto px-2">
                    <span className="hidden md:inline text-sm font-medium text-muted-foreground bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                        {filteredGames.length.toLocaleString()} Games
                    </span>

                    <div className="relative">
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value as 'rating' | 'newest')}
                            className="appearance-none w-full md:w-40 bg-white/5 border border-white/10 text-foreground py-3 pl-4 pr-10 rounded-xl leading-tight focus:outline-none focus:bg-white/10 transition-colors cursor-pointer text-sm font-medium"
                        >
                            <option value="rating">Before: Top Rated</option>
                            <option value="newest">Newest Added</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-muted-foreground">
                            <ChevronRight className="h-4 w-4 rotate-90" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="min-h-[600px]">
                <GameGrid games={currentGames} />
            </div>

            {/* Pagination - Glass Style */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="p-3 rounded-xl bg-card/50 border border-white/10 disabled:opacity-30 hover:bg-white/10 transition-all active:scale-95 backdrop-blur-md"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="hidden md:flex items-center gap-2 px-4 bg-card/30 backdrop-blur-md py-2 rounded-xl border border-white/5 mx-4">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let p = page;
                            if (page < 3) p = i + 1;
                            else if (page > totalPages - 2) p = totalPages - 4 + i;
                            else p = page - 2 + i;

                            if (p > 0 && p <= totalPages) {
                                return (
                                    <button
                                        key={p}
                                        onClick={() => setPage(p)}
                                        className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${page === p
                                            ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-110'
                                            : 'text-muted-foreground hover:bg-white/10 hover:text-foreground'
                                            }`}
                                    >
                                        {p}
                                    </button>
                                );
                            }
                            return null;
                        })}
                    </div>

                    {/* Mobile Page Indicator */}
                    <span className="md:hidden text-sm font-medium text-muted-foreground">
                        Page {page} / {totalPages}
                    </span>

                    <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="p-3 rounded-xl bg-card/50 border border-white/10 disabled:opacity-30 hover:bg-white/10 transition-all active:scale-95 backdrop-blur-md"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            )}
        </div>
    );
}
