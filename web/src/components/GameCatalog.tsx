"use client";

import { useState, useEffect, useMemo } from 'react';
import { Game } from '../types';
import { GameGrid } from './GameGrid';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

const GAMES_PER_PAGE = 36;

export function GameCatalog() {
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState<'rating' | 'newest'>('rating');
    const [page, setPage] = useState(1);

    useEffect(() => {
        fetch('/games.json')
            .then((res) => res.json())
            .then((data) => {
                setGames(data as Game[]);
                setLoading(false);
            });
    }, []);

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

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-4 rounded-xl border border-border">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search games..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1); // Reset to page 1 on search
                        }}
                        className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                    />
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value as 'rating' | 'newest')}
                        className="px-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                        <option value="rating">Top Rated</option>
                        <option value="newest">Newest</option>
                    </select>
                </div>
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Showing {filteredGames.length.toLocaleString()} games</span>
                <span>Page {page} of {totalPages}</span>
            </div>

            <GameGrid games={currentGames} />

            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="p-2 rounded-lg bg-card border border-border disabled:opacity-50 hover:bg-accent disabled:hover:bg-card transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-2 px-4">
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
                                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${page === p
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-card border border-border hover:bg-accent'
                                            }`}
                                    >
                                        {p}
                                    </button>
                                );
                            }
                            return null;
                        })}
                    </div>

                    <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="p-2 rounded-lg bg-card border border-border disabled:opacity-50 hover:bg-accent disabled:hover:bg-card transition-colors"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            )}
        </div>
    );
}
