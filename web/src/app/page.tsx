import { GameCatalog } from '../components/GameCatalog';

export default function Home() {
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

			<div className="container mx-auto px-4 -mt-20 relative z-20 pb-12">
				<GameCatalog />
			</div>
		</main>
	);
}
