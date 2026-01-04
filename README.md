# 4j Games Scraper

This project fetches game data from [4j.com](https://www.4j.com) and aggregates it into a JSON collection.

## Prerequisites

- [Bun](https://bun.sh/) is required to run the scripts.

## Installation

```bash
bun install
```

## Usage

### 1. Fetch Games
Fetch all games (approx 14,000+) and save them as individual JSON files in the `games/` directory.

```bash
bun run fetch
```

**Note**: This process fetches data from `https://www.4j.com/ajax_loadmoregames.php` and parses the HTML response.

### 2. Merge Games
Combine all individual JSON files from `games/` into a single `games.json` file.

```bash
bun run merge
```

## Output Format

### Individual Game (games/123.json)
```json
{
  "id": "22508",
  "name": "Magic Piano Online",
  "url": "https://www.4j.com/Magic-Piano-Online",
  "embedUrl": "https://www.4j.com/embed/Magic-Piano-Online",
  "image": "https://www.4j.com/cdn-cgi/image/quality=78,fit=cover,format=auto/thumb/201705/Magic-Piano-Online.jpg",
  "rating": "3.794875"
}
```

### Aggregated Data (games.json)
An array of game objects:
```json
[
  {
    "id": "22508",
    "name": "Magic Piano Online",
    ...
  },
  ...
]
```

## Project Structure

- `fetch_games.ts`: Script to fetch and parse game data.
- `merge_games.ts`: Script to combine JSON files.
- `games/`: Directory containing individual game JSON files (generated).
- `games.json`: Aggregated data file (generated).
