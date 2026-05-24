# travelogue

Live at `laguna-dream.github.io/travelogue`

## Run locally
```bash
python3 -m http.server 8000
# → localhost:8000
```

---

## Files

```
index.html        logs / dispatches
map.html          interactive map
archives.html     sensory grid
about.html
admin.html        entry builder — your tool, not linked publicly

style.css
data.js           shared utilities
player.js         YouTube player + ambient audio

config.json       title, place colors, playlist, ambient
dispatches.json   journal entries
places.json       map pins
sensory.json      sensory archive entries
field-notes.json  staging area for on-the-go captures (see below)

assets/images/
assets/sounds/
assets/gpx/
```

---

## Daily workflow

**Every evening:**
1. Open `admin.html` locally (`python3 -m http.server 8000 → localhost:8000/admin.html`)
2. Write dispatch → copy JSON → paste at top of `dispatches.json`
3. Add any new places → copy JSON → paste at top of `places.json`
4. Convert field notes → paste into `sensory.json`
5. `git add . && git commit -m "day X — place" && git push`

---

## Dispatches

```json
{
  "id": "day-1",
  "date": "2026-05-23",
  "title": "Day 1",
  "place": "dharamkot",
  "body": "Your text. **bold**, *italic*, > blockquotes.\n\nReference a place inline: {{shiva-cafe}}"
}
```

- `id` — used for map popup back-links and URL anchors. lowercase, hyphens.
- `date` — ISO format `YYYY-MM-DD`. Used for sort order.
- `place` — must match a key in `config.json → places` for color coding.
- Paste newest entries at the **top** of the array.

---

## Place chips and back-links

**Dispatch → Place** (chip in post body):
Write `{{place-id}}` anywhere in a dispatch body. Renders as a small colored chip. Clicking it opens the map centered on that place in a new tab. The `place-id` must match the `id` field of an entry in `places.json`.

**Place → Dispatch** (link in map popup):
In the place entry, set `"dispatchId": "day-1"`. The map popup will show a "read post →" link back to that dispatch. You wire these manually — add the `dispatchId` once you've written the post.

---

## Places (map pins)

```json
{
  "id": "shiva-cafe",
  "name": "Shiva Café",
  "type": "cafe",
  "area": "dharamkot",
  "lat": 32.2265,
  "lng": 76.3195,
  "note": "Ginger chai. Outdoor seating.",
  "date": "2026-05-23",
  "inPath": true,
  "dispatchId": "day-1"
}
```

- `id` — what you use in `{{double-braces}}` in dispatches.
- `area` — matches a key in `config.json → places` for color.
- `inPath: true` — connects this place to the journey path line, drawn in date order.
- `dispatchId` — optional, adds a "read post →" link in the map popup.
- Type options: `cafe`, `restaurant`, `stay`, `trail`, `spot`, `establishment`

**Trails with GPX:**
```json
{
  "id": "triund-trail",
  "name": "Triund Trail",
  "type": "trail",
  "area": "dharamkot",
  "lat": 32.2268,
  "lng": 76.3198,
  "gpx": "assets/gpx/triund.gpx",
  "date": "2026-05-24"
}
```
Export GPX from Strava, drop it in `assets/gpx/`, reference the path. `lat`/`lng` marks the trailhead pin.

---

## Sensory archive

```json
{
  "type": "taste",
  "title": "ginger chai, 6am",
  "description": "Too hot, slightly too sweet.",
  "place": "dharamkot",
  "location": "Shiva Café",
  "image": "assets/images/chai.jpg"
}
```

- Type options: `taste`, `sight`, `sound`, `smell`, `texture`, `sketch`
- `place` must match an `area` in `places.json` — this is how sensory pins appear on the map.

---

## On-the-go capture (iOS Shortcut)

Set up one Shortcut called **Field Note**. Steps:

1. **Get Current Location** → saves lat/lng
2. **Choose from menu** → taste / sight / sound / smell / texture / sketch
3. **Ask for input** → title (one line)
4. **Ask for input** → note (optional, can skip)
5. For photos: **Take Photo** (GPS is baked into EXIF automatically)
6. For sounds: attach from Voice Memos after recording
7. **Get file** `field-notes.json` from Working Copy repo
8. **Get Dictionary from JSON** → append new entry:
   ```
   {
     "type": [chosen type],
     "title": [title input],
     "note": [note input],
     "lat": [latitude],
     "lng": [longitude],
     "timestamp": [current date],
     "image": ""
   }
   ```
9. **Set file** back to Working Copy
10. **Open URL** `working-copy://x-callback-url/commit?repo=travelogue&message=field+note` → auto-commits

Each evening, `field-notes.json` has everything timestamped and location-tagged. Open admin.html, pull the data, move photos to `assets/images/`, fill in image paths, paste into `sensory.json`. Clear `field-notes.json` back to `[]` when done.

**Photos**: Camera app with Location on. GPS writes into EXIF. Just move the file to `assets/images/` — no extra step needed for location.

---

## Music playlist

In `config.json`:
```json
"playlist": [
  { "title": "Track — Artist", "videoId": "YOUTUBE_VIDEO_ID" }
]
```
Get video ID from YouTube URL: `youtube.com/watch?v=VIDEO_ID_HERE`

## Ambient sounds

Drop `.mp3` files in `assets/sounds/` and add to `config.json`:
```json
"ambient": [
  { "label": "forest", "src": "assets/sounds/forest.mp3" }
]
```
Free sounds: freesound.org (CC0 license filter)

## Mapbox tiles (optional, better maps)

1. Free token at mapbox.com
2. Add to `config.json`:
```json
"mapboxToken": "pk.your_token_here",
"mapboxStyle": "mapbox/outdoors-v12"
```
Style options: `mapbox/light-v11`, `mapbox/outdoors-v12`, `mapbox/satellite-streets-v12`
