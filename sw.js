/* Scales Thesaurus service worker: install the complete local app before activation. */
const VERSION_BASE = 'st-3.2-theta-r43';
const SCOPE_SUFFIX = '-' + encodeURIComponent(new URL(self.registration.scope).pathname);
const VERSION = VERSION_BASE + SCOPE_SUFFIX;
const PRECACHE = [
    "./",
    "about-app.js",
    "about-data.js",
    "about.css",
    "about.html",
    "andalusian.html",
    "andalusian.css",
    "andalusian.js",
    "audio-preview.js",
    "offline-package.js",
    "advanced.csv",
    "app-events-core.js",
    "app-events-export-basic.js",
    "app-events-export-batch.js",
    "app-events-export-custom.js",
    "app-events-export.js",
    "app-events-main.js",
    "app-events-playback.js",
    "app-export.js",
    "app-init.js",
    "app-instrument-fretspan.js",
    "app-instrument-tuning.js",
    "app-instrument-ui.js",
    "app-instrument.js",
    "app-lessons-data.js",
    "app-media.js",
    "app-playback-cof.js",
    "app-playback.js",
    "app-settings.js",
    "app-state.js",
    "app-theory-info.js",
    "app-theory-lessons.js",
    "app-theory-panel.js",
    "app-theory-renderers.js",
    "app-ui-appearance.js",
    "app-ui-bottom-appearance.js",
    "app-ui-bottom-controls.js",
    "app-ui-bottom-export.js",
    "app-ui-bottom-instrument.js",
    "app-ui-bottom.js",
    "app-ui-layout.js",
    "app-ui-pattern-actions.js",
    "app-ui-pattern-pill.js",
    "app-ui-pattern-selectors.js",
    "app-ui-sidebar.js",
    "app-ui.js",
    "app.js",
    "asset_name.mp3",
    "chords-app.js",
    "chords.css",
    "chords.html",
    "components.css",
    "courses-app.js",
    "courses.html",
    "coursesexams.html",
    "coursesideas.html",
    "coursesquizzes.html",
    "coursestests.html",
    "data-app.js",
    "data.html",
    "daw.css",
    "daw.html",
    "daw.js",
    "daw-midi.js",
    "diagnostics-tests-logic.js",
    "diagnostics-tests-release.js",
    "diagnostics-tests-mobile.js",
    "diagnostics-tests-ui.js",
    "diagnostics-tests.js",
    "diagnostics.js",
    "dummy.html",
    "ebooks-app.js",
    "ebooks.html",
    "effects.css",
    "exporter-bulk.js",
    "exporter-chords.js",
    "exporter-cof.js",
    "exporter-gamuts.js",
    "exporter-info-pages.js",
    "exporter-intervals.js",
    "exporter-pdf.js",
    "exporter-scales.js",
    "exporter-word-chords-cof.js",
    "exporter-word-custom.js",
    "exporter-word-extended.js",
    "exporter-word-gamuts-cof.js",
    "exporter-word-intervals-circle.js",
    "exporter-word-patterns.js",
    "exporter-word-v1.js",
    "exporter-word-v2.js",
    "exporter-word-v3.js",
    "exporter-word-v4.js",
    "exporter-word-v5.js",
    "exporter-word-v6.js",
    "exporter.js",
    "favorites-app.js",
    "favorites.html",
    "fretboard.html",
    "fretboard-page.css",
    "fretboard-draw-grid.js",
    "fretboard-draw-notes.js",
    "fretboard-draw.js",
    "fretboard-effects.js",
    "fretboard-marker.js",
    "fretboard-menu-multi.js",
    "fretboard-menu.js",
    "fretboard-styles-extended.js",
    "fretboard-styles.js",
    "fretboard.css",
    "fretboard.js",
    "home.html",
    "home.css",
    "icon-192.png",
    "icon-512.png",
    "ideas-app.js",
    "index.html",
    "instrument-presets.js",
    "intervals-app.js",
    "intervals.css",
    "intervals.html",
    "layout.css",
    "lessons-app.js",
    "lessons.css",
    "lessons.html",
    "manifest.webmanifest",
    "markdown",
    "melodic-patterns-data.js",
    "melodic-patterns-player.js",
    "melodic-patterns-ui.js",
    "melodic-patterns.js",
    "mini-fretboard.css",
    "mini-fretboard.js",
    "music-theory-chords.js",
    "music-theory-data.js",
    "mode-intervals.js",
    "music-theory-descriptions.js",
    "music-theory-logic.js",
    "music-theory.js",
    "pages.css",
    "pattern-generator-export.js",
    "pattern-generator.js",
    "piano.js",
    "practice-app.js",
    "practice.html",
    "primer.html",
    "primer.css",
    "primer.js",
    "progress-app.js",
    "progress.html",
    "progressions-app.js",
    "progressions.css",
    "quiz-engine.js",
    "quiz.css",
    "release-notes.css",
    "release-notes.html",
    "release-notes.js",
    "scales-app.js",
    "scales-data-advanced-1.js",
    "scales-data-advanced-10.js",
    "scales-data-advanced-11.js",
    "scales-data-advanced-2.js",
    "scales-data-advanced-3.js",
    "scales-data-advanced-4.js",
    "scales-data-advanced-5.js",
    "scales-data-advanced-6.js",
    "scales-data-advanced-7a.js",
    "scales-data-advanced-7b.js",
    "scales-data-advanced-8.js",
    "scales-data-numeric.js",
    "scales-data-standard.js",
    "scales.html",
    "settings.html",
    "site-map.css",
    "site-map.html",
    "sidebar.css",
    "site.css",
    "site.js",
    "square-edges.css",
    "slideshow-csv.js",
    "slideshow-cycle.js",
    "slideshow-player.js",
    "slideshow.js",
    "styles.css",
    "sw.js",
    "theme-init.js",
    "themes-data-colors.js",
    "themes-data-exotic.js",
    "themes-data-extended.js",
    "themes-data-extra.js",
    "themes-data-misc.js",
    "themes-data-mono.js",
    "themes-data-nature.js",
    "themes-data-retro.js",
    "themes-data-wood.js",
    "themes-data.js",
    "themes.css",
    "theory-cards/index.html",
    "theory-cards/cards.css",
    "theory-cards/cards.js",
    "theory-decks/play.html",
    "theory-decks/style.css",
    "theory-decks/mobile.css",
    "theory-decks/mobile-view.js",
    "theory-decks/theory.js",
    "theory-decks/data/scales.js",
    "theory-decks/data/modes.js",
    "theory-decks/data/keys.js",
    "theory-decks/data/intervals.js",
    "theory-decks/data/chords.js",
    "theory-decks/data/strings.js",
    "theory-decks/data/techniques.js",
    "theory-decks/data/andalusian.js",
    "theory-decks/data/progressions.js",
    "theory-decks/data/deceptive.js",
    "theory-decks/data/majorminor.js",
    "theory-decks/data/blues.js",
    "theory-decks/data/romannumerals.js",
    "theory-decks/data/melodicpatterns.js",
    "theory-decks/data/lefthand.js",
    "theory-decks/data/righthand.js",
    "theory-decks/decks.js",
    "theory-decks/active.js",
    "theory-decks/themes.js",
    "theory-decks/cardstyles.js",
    "theory-decks/sound.js",
    "theory-decks/deal.js",
    "theory-decks/game-midi.js",
    "theory-decks/game.js",
    "theory-decks/tone.js",
    "theory-decks/fibonacci.js",
    "theory-decks/fibcombos.js",
    "theory-decks/progressiongames.js",
    "theory-decks/games.js",
    "theory-decks/app.js",
    "theory-decks/index.html",
    "theory-decks/reference.html",
    "theory-decks/about.html",
    "theory-decks/about.js",
    "theory-decks/release-notes.html",
    "theory-decks/author.html",
    "theory-decks/settings.html",
    "theory-decks/daw.html",
    "theory-decks/daw.css",
    "theory-decks/daw.js",
    "theory-decks/daw-core.js",
    "theory-decks/daw-presets.js",
    "theory-decks/daw-midi.js",
    "theory-decks/daw-pdf.js",
    "theory-decks/settings.js",
    "theory-decks/prefs.js",
    "theory-decks/lessons.js",
    "theory-decks/deckdocs.js",
    "theory-decks/home.css",
    "theory-decks/offline-support.js",
    "theory-decks/offline-assets.js",
    "theory-decks/service-worker.js",
    "theory-decks/reference.js",
    "theory-decks/gamedocs.js",
    "theory-decks/manifest.webmanifest",
    "theory-decks/icons/favicon-32.png",
    "theory-decks/icons/apple-touch-icon.png",
    "theory-decks/icons/icon-192.png",
    "theory-decks/icons/icon-512.png",
    "theory-decks/Fretboard%20Diagrams/index.html",
    "theory-decks/Fretboard%20Diagrams/fretboard.css",
    "theory-decks/Fretboard%20Diagrams/fretboard.js",
    "theory-decks/Fretboard%20Diagrams/export.js",
    "vendor/docx.js",
    "vendor/html2canvas.min.js",
    "vendor/jspdf.umd.min.js",
    "vendor/jszip.min.js",
    "vendor/tone.js",
    "vendor/xlsx.full.min.js"
];

self.addEventListener('install', (event) => {
    event.waitUntil((async () => {
        const cache = await caches.open(VERSION);
        try {
            const cacheOne = async (url) => {
                for (let attempt = 0; attempt < 3; attempt++) {
                    try {
                        await cache.add(new Request(url, { cache: 'reload' }));
                        return true;
                    } catch {
                        if (attempt < 2) await new Promise(resolve => setTimeout(resolve, 200 * (attempt + 1)));
                    }
                }
                return false;
            };
            const missing = [];
            for (let i = 0; i < PRECACHE.length; i += 8) {
                const batch = PRECACHE.slice(i, i + 8);
                const results = await Promise.all(batch.map(cacheOne));
                batch.forEach((url, index) => { if (!results[index]) missing.push(url); });
            }
            if (missing.length) throw new Error('Offline install incomplete: ' + missing.slice(0, 8).join(', '));
            await cache.put(new URL('__offline-ready__', self.registration.scope), new Response(VERSION));
            await self.skipWaiting();
        } catch (error) {
            await caches.delete(VERSION);
            throw error;
        }
    })());
});

self.addEventListener('activate', (event) => {
    event.waitUntil((async () => {
        const keys = await caches.keys();
        await Promise.all(keys.filter(k => k.startsWith('st-') && k.endsWith(SCOPE_SUFFIX) && k !== VERSION).map(k => caches.delete(k)));
        await self.clients.claim();
    })());
});

function bypass(url) {
    return url.origin !== self.location.origin || url.pathname.startsWith('/api/') || url.pathname.includes('/_embedded_host') || url.pathname.includes('/_websim') || url.searchParams.has('__td_offline_refresh');
}

self.addEventListener('fetch', (event) => {
    const req = event.request;
    if (req.method !== 'GET') return;
    const url = new URL(req.url);
    if (bypass(url)) return;
    event.respondWith((async () => {
        const cache = await caches.open(VERSION);
        const cached = await cache.match(req, { ignoreSearch: true });
        if (cached) return cached;
        try { return await fetch(req); } catch {}
        if (req.mode === 'navigate') {
            const directoryPath = url.pathname.endsWith('/') ? url.pathname : url.pathname + '/';
            const directoryIndex = await cache.match(new URL(directoryPath + 'index.html', url.origin), { ignoreSearch: true });
            if (directoryIndex) return directoryIndex;
        }
        if (req.mode === 'navigate') {
            return (await cache.match('index.html')) || (await cache.match('home.html')) || Response.error();
        }
        return Response.error();
    })());
});
