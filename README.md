# travelogue v2

## Structure
```
index.html        logs / dispatches (main page)
map.html          interactive map
archives.html     sensory archive grid
about.html        about page

css/style.css     all shared styles — edit this to style everything
js/data.js        shared data loading utilities
js/player.js      YouTube music player + ambient layer

data/config.json      trip info, playlist, ambient, media, place colors
data/dispatches.json  journal entries
data/places.json      map pins
data/sensory.json     sensory archive entries

assets/sounds/    drop ambient .mp3 files here
assets/images/    photos
assets/gpx/       trail GPX files (for future map integration)
```

## Run locally
```bash
python3 -m http.server 8000
# → open http://localhost:8000
```

## Adding content

### Dispatch entry
```json
{
  "date": "may 24 2026",
  "title": "Day 2",
  "place": "bir",
  "body": "Your text here. Markdown works — **bold**, *italic*.\n\nReference a map place inline like this: {{shiva-cafe}}",
  "tags": ["walking"]
}
```
`place` must match a key in `config.json → places` for colour coding.

### Place (map pin)
```json
{
  "id": "shiva-cafe",
  "name": "Shiva Café",
  "type": "cafe",
  "area": "dharamkot",
  "lat": 32.2265,
  "lng": 76.3195,
  "note": "Your note.",
  "date": "may 23",
  "inPath": true
}
```
`id` is what you use in `{{double-braces}}` in dispatch bodies.
`area` should match a key in `config.json → places` for colour coding.
`inPath: true` connects this place to the route line (in array order).

### Sensory entry
```json
{
  "type": "taste",
  "title": "ginger chai",
  "description": "Your description.",
  "place": "dharamkot",
  "location": "Shiva Café, upper dharamkot",
  "image": "assets/images/chai.jpg"
}
```
`type` options: `taste`, `sight`, `sound`, `smell`, `texture`, `feeling`
`place` should match an `area` in places.json to get sensory pins on the map.

### Music playlist
In `config.json`:
```json
"playlist": [
  { "title": "Track — Artist", "videoId": "YOUTUBE_VIDEO_ID" }
]
```
Get the video ID from the YouTube URL: `youtube.com/watch?v=VIDEO_ID_HERE`

### Ambient sounds
Drop `.mp3` files in `assets/sounds/` and list them in `config.json`:
```json
"ambient": [
  { "label": "forest", "src": "assets/sounds/forest.mp3" }
]
```
Free sources: freesound.org (filter by CC0 license)

### Mapbox (better map tiles)
1. Get a free token at mapbox.com (no credit card needed)
2. Add to `config.json`:
```json
"mapboxToken": "pk.your_token_here",
"mapboxStyle": "mapbox/light-v11"
```
Style options: `mapbox/light-v11`, `mapbox/outdoors-v12`, `mapbox/satellite-streets-v12`

## Styling the header
The `.site-header` in `index.html` has a `<style>` block at the top of the file.
Design your parallax mountain layers there — it won't affect other pages.

## Deploying to GitHub Pages
Push to GitHub → Settings → Pages → Branch: main, folder: root.
Live at `https://yourusername.github.io/repo-name`
