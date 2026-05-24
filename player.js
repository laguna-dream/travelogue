// ── player.js — YouTube audio player + ambient layer ───────────────────
// Music persists across page navigations via localStorage.
// Ambient is per-session (resets on navigation — by design, it's atmospheric).

const PlayerModule = (() => {
  let yt = null;
  let playlist = [];
  let idx = 0;
  let playing = false;
  let ticker = null;
  const STORE_KEY = 'travelogue-player';

  // ── YouTube setup ──
  function load() {
    if (!playlist.length) return;
    if (window.YT && window.YT.Player) { _create(); return; }
    const s = document.createElement('script');
    s.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(s);
    window.onYouTubeIframeAPIReady = _create;
  }

  function _create() {
    if (!document.getElementById('yt-player')) return;
    yt = new YT.Player('yt-player', {
      height: '0', width: '0',
      videoId: playlist[idx].videoId,
      playerVars: { autoplay: 0, controls: 0, rel: 0, disablekb: 1 },
      events: { onReady: _onReady, onStateChange: _onState }
    });
  }

  function _onReady() {
    // Resume from saved position
    const saved = _load();
    if (saved && saved.i < playlist.length) {
      idx = saved.i;
      yt.loadVideoById({ videoId: playlist[idx].videoId, startSeconds: saved.t || 0 });
      yt.pauseVideo();
    }
    _updateTrack();
  }

  function _onState(e) {
    const S = YT.PlayerState;
    if (e.data === S.ENDED)   { _next(); return; }
    if (e.data === S.PLAYING) { playing = true;  _startTick(); }
    if (e.data === S.PAUSED)  { playing = false; clearInterval(ticker); }
    _updateBtn();
  }

  function _startTick() {
    clearInterval(ticker);
    ticker = setInterval(() => {
      if (!yt || !yt.getDuration) return;
      const dur = yt.getDuration();
      const cur = yt.getCurrentTime();
      if (!dur) return;
      const pct = (cur / dur) * 100;
      const fill = document.getElementById('progress-fill');
      const time = document.getElementById('player-time');
      if (fill) fill.style.width = pct + '%';
      if (time) time.textContent = formatTime(cur) + ' / ' + formatTime(dur);
      _save({ i: idx, t: cur });
    }, 1000);
  }

  function _next() {
    idx = (idx + 1) % playlist.length;
    if (yt) yt.loadVideoById(playlist[idx].videoId);
    _updateTrack();
  }

  function _prev() {
    if (yt && yt.getCurrentTime() > 3) { yt.seekTo(0, true); return; }
    idx = (idx - 1 + playlist.length) % playlist.length;
    if (yt) yt.loadVideoById(playlist[idx].videoId);
    _updateTrack();
  }

  function _toggle() {
    if (!yt) return;
    playing ? yt.pauseVideo() : yt.playVideo();
  }

  function _scrub(e) {
    if (!yt || !yt.getDuration) return;
    const bar = e.currentTarget;
    const pct = Math.max(0, Math.min(1, e.offsetX / bar.offsetWidth));
    yt.seekTo(yt.getDuration() * pct, true);
  }

  function _updateTrack() {
    const el = document.getElementById('player-track');
    if (!el) return;
    const span = document.createElement('span');
    span.className = 'marquee-inner';
    span.textContent = playlist[idx]?.title || '—';
    el.innerHTML = '';
    el.appendChild(span);
    requestAnimationFrame(() => {
      const overflow = span.offsetWidth - el.offsetWidth;
      if (overflow > 0) {
        span.style.setProperty('--scroll-px', `-${overflow}px`);
        span.style.animationDuration = Math.max(4, Math.round(overflow / 20)) + 's';
        span.classList.add('scrolling');
      }
    });
  }

  function _updateBtn() {
    const btn = document.getElementById('play-btn');
    if (btn) btn.textContent = playing ? '⏸' : '▶';
  }

  function _save(state) { try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch {} }
  function _load()       { try { return JSON.parse(localStorage.getItem(STORE_KEY)); } catch { return null; } }

  function init(data) {
    playlist = data;
    document.getElementById('play-btn')?.addEventListener('click', _toggle);
    document.getElementById('next-btn')?.addEventListener('click', _next);
    document.getElementById('prev-btn')?.addEventListener('click', _prev);
    document.getElementById('player-progress')?.addEventListener('click', _scrub);
    load();
  }

  return { init };
})();


// ── Ambient layer ─────────────────────────────────────────────────────────
const AmbientModule = (() => {
  const active = {};

  function init(sounds) {
    const grid = document.getElementById('ambient-grid');
    if (!grid || !sounds.length) return;
    grid.innerHTML = '';

    sounds.forEach(s => {
      const audio = new Audio(s.src);
      audio.loop = true;
      audio.volume = 0.35;

      const btn = document.createElement('button');
      btn.className = 'ambient-btn';
      btn.textContent = s.label;
      btn.addEventListener('click', () => {
        if (active[s.label]) {
          audio.pause();
          audio.currentTime = 0;
          delete active[s.label];
          btn.classList.remove('on');
        } else {
          audio.play().catch(() => {
            console.warn('Ambient audio blocked — user interaction may be needed first.');
          });
          active[s.label] = audio;
          btn.classList.add('on');
        }
      });
      grid.appendChild(btn);
    });
  }

  return { init };
})();
