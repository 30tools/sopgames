import requests
import re
import json
import os
import sys

# Constants
URL = "https://www.4j.com/ajax_loadmoregames.php?from=0&num=120000&type=hot"
OUTPUT_DIR = "games"

def fetch_and_save_games():
    """Fetches games from 4j.com and saves them as JSON files."""
    
    # Create output directory if it doesn't exist
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
        print(f"Created directory: {OUTPUT_DIR}")

    print(f"Fetching data from {URL}...")
    try:
        response = requests.get(URL)
        response.raise_for_status()
    except requests.RequestException as e:
        print(f"Error fetching data: {e}")
        sys.exit(1)

    html_content = response.text
    print(f"Successfully fetched {len(html_content)} bytes of data.")

    # Regex patterns
    # Example structure:
    # <div class="thumb" id='game-22508'><a href="/Magic-Piano-Online"><img src='https://www.4j.com/cdn-cgi/image/quality=78,fit=cover,format=auto/thumb/201705/Magic-Piano-Online.jpg' alt="Magic Piano Online"  /><span class='GameName'>Magic Piano Online</span><span class='GameRating'>3.794875</span></a></div>
    
    # We will iterate through all matches
    # Pattern designed to be robust but capture necessary groups
    pattern = re.compile(r"<div class=\"thumb\" id='game-(\d+)'><a href=\"([^\"]+)\"><img src='([^']+)' alt=\"[^\"]*\"  /><span class='GameName'>(.*?)</span><span class='GameRating'>([\d.]+)</span></a></div>")
    
    matches = pattern.findall(html_content)
    
    print(f"Found {len(matches)} games.")

    count = 0
    for match in matches:
        game_id = match[0]
        game_url_suffix = match[1]
        image_url = match[2]
        game_name = match[3]
        rating = match[4]

        game_data = {
            "id": game_id,
            "name": game_name,
            "url": f"https://www.4j.com{game_url_suffix}",
            "image": image_url,
            "rating": rating
        }

        output_path = os.path.join(OUTPUT_DIR, f"{game_id}.json")
        try:
            with open(output_path, 'w') as f:
                json.dump(game_data, f, indent=2)
            count += 1
        except IOError as e:
            print(f"Error saving game {game_id}: {e}")

    print(f"Successfully saved {count} games to '{OUTPUT_DIR}/'.")

if __name__ == "__main__":
    fetch_and_save_games()
