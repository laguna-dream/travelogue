// ── data.js — shared utilities ───────────────────────────────────────────

async function loadJSON(path) {
  try {
    const r = await fetch(path + '?_=' + Date.now());
    if (!r.ok) return null;
    return await r.json();
  } catch { return null; }
}

// Write CSS color variables for each place onto :root
function applyPlaceColors(places) {
  const root = document.documentElement;
  Object.entries(places).forEach(([name, cfg]) => {
    root.style.setProperty('--color-' + name, cfg.color);
  });
}

// Render markdown body text
function renderMarkdown(text) {
  if (typeof marked !== 'undefined' && marked.parse) return marked.parse(text || '');
  return '<p>' + (text || '').replace(/\n\n/g, '</p><p>') + '</p>';
}

// Replace {{place-id}} in body HTML with clickable inline chips
// placesArr = array from places.json
function processPlaceRefs(html, placesArr) {
  if (!placesArr) return html;
  const byId = {};
  placesArr.forEach(p => { if (p.id) byId[p.id] = p; });

  return html.replace(/\{\{([^}]+)\}\}/g, (match, id) => {
    const place = byId[id];
    const label = place ? place.name : id;
    // color: use area color if available, else neutral
    const color = place ? `var(--color-${place.area}, #888)` : '#888';
    return `<span class="place-chip"
      style="color:${color};border-color:${color}"
      data-id="${id}"
      onclick="goToPlace('${id}')"
    >${label}</span>`;
  });
}

// Navigate to map page highlighting a specific place — opens in new tab
function goToPlace(id) {
  window.open('map.html?place=' + encodeURIComponent(id), '_blank', 'noopener');
}

// Parse ISO dates (2026-05-23) → Date object
function parseDate(str) {
  if (!str) return new Date(0);
  return new Date(str.trim());
}

// Format seconds → m:ss
function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return m + ':' + String(sec).padStart(2, '0');
}
