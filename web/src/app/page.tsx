import { promises as fs } from 'fs';
import path from 'path';
import { Game } from '../types';
import { GameGrid } from '../components/GameGrid';

async function getGames(): Promise<Game[]> {
	const filePath = path.join(process.cwd(), 'data', 'games.json');
	const fileContents = await fs.readFile(filePath, 'utf8');
	const games: Game[] = JSON.parse(fileContents);

	// Sort by rating desc
	return games.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
}

export default async function Home() {
	const games = await getGames();
	const displayGames = games.slice(0, 100); // Show top 100 for now to keep DOM light

	return (
		<main className="min-h-screen pb-20">
			<div className="relative h-[40vh] w-full flex items-center justify-center bg-gradient-to-b from-purple-900/20 to-background overflow-hidden">
				<div className="absolute inset-0 bg-[url('https://www.4j.com/cdn-cgi/image/quality=78,fit=cover,format=auto/thumb/201705/Magic-Piano-Online.jpg')] bg-cover bg-center opacity-10 blur-xl scale-110" />
				<div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />

				<div className="relative z-10 text-center space-y-4 px-4">
					<h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
						SOP GAMES
					</h1>
					<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
						Discover thousands of free online games. Play instantly, no download required.
					</p>
				</div>
			</div>

			<div className="container mx-auto px-4 -mt-20 relative z-20">
				<div className="flex items-center justify-between mb-6 px-4">
					<h2 className="text-2xl font-semibold tracking-tight">Top Rated Games</h2>
					<span className="text-sm text-muted-foreground">{games.length.toLocaleString()} items</span>
				</div>

				<GameGrid games={displayGames} />

				<div className="mt-12 text-center text-muted-foreground text-sm">
					Showing top 100 games. Search feature coming soon.
				</div>
			</div>
		</main>
	);
}
