(function () {
    'use strict';

    const theory = new MusicTheory();
    const root = document;
    const KEYS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const STORAGE_SETTINGS = 'st_primer_settings_v1';
    const STORAGE_MAP = 'st_primer_map_v1';
    const INSTRUMENTS = {
        guitar: { label: 'Guitar', tuning: 'E A D G B E', strings: [{ note: 'E', octave: 2 }, { note: 'A', octave: 2 }, { note: 'D', octave: 3 }, { note: 'G', octave: 3 }, { note: 'B', octave: 3 }, { note: 'E', octave: 4 }] },
        dropd: { label: 'Drop D guitar', tuning: 'D A D G B E', strings: [{ note: 'D', octave: 2 }, { note: 'A', octave: 2 }, { note: 'D', octave: 3 }, { note: 'G', octave: 3 }, { note: 'B', octave: 3 }, { note: 'E', octave: 4 }] },
        bass: { label: 'Bass', tuning: 'E A D G', strings: [{ note: 'E', octave: 1 }, { note: 'A', octave: 1 }, { note: 'D', octave: 2 }, { note: 'G', octave: 2 }] },
        ukulele: { label: 'Ukulele', tuning: 'G C E A', strings: [{ note: 'G', octave: 4 }, { note: 'C', octave: 4 }, { note: 'E', octave: 4 }, { note: 'A', octave: 4 }] }
    };
    const DEFAULT_SETTINGS = { key: 'C', instrument: 'guitar', waveform: 'triangle', volume: 0.38, tone: 58, bpm: 80, sustain: 1.5 };
    const INTRO = [
        { title: 'Meet the instrument', description: 'Identify the body, neck, headstock, bridge, nut and strings before learning a shape.', text: 'A fretted string instrument turns a vibrating string into notes. The body supports the bridge, the neck carries the frets, and the headstock holds the tuning machines. Learn the names of the parts first; it makes setup and technique instructions precise.', steps: ['Point to the body, bridge, neck, nut and tuning machines.', 'Trace one string from its tuning machine to the bridge.', 'Check that each string sits in its nut slot and crosses the bridge cleanly.'] },
        { title: 'Hold it comfortably', description: 'Set a stable posture before the hands begin repeating movements.', text: 'Balance the instrument so both hands can move without gripping. Keep the shoulder loose, wrist near neutral and thumb relaxed behind the neck. Stop if a position causes pain or tingling.', steps: ['Sit or stand with the instrument supported rather than held up by the fretting hand.', 'Relax the shoulders and let the picking arm rest lightly on the body.', 'Move the fretting thumb until the fingers can reach without squeezing.'] },
        { title: 'Name the strings', description: 'Use string names as dependable landmarks on a guitar-family instrument.', text: 'Standard guitar strings are tuned E-A-D-G-B-E from the lowest-pitched, thickest string to the highest-pitched, thinnest string. Bass and ukulele use different string sets; Setup lets you select a matching instrument.', steps: ['Say the guitar strings from low to high: E, A, D, G, B, E.', 'Point to each string without plucking and say its name.', 'Reverse the order from high E back to low E.'] },
        { title: 'Make one clear sound', description: 'Start with a single open string and listen for a steady, clean tone.', text: 'An open string sounds without a fretting finger. Pluck gently near the sound hole or pickups, then let the note ring. A clean note has a clear beginning and no accidental buzz from neighboring strings.', steps: ['Choose one open string and pluck it once with a relaxed motion.', 'Let the sound ring until it fades; do not touch another string.', 'Repeat with a lighter touch and compare the attack.'] },
        { title: 'Tune before practice', description: 'A stable reference pitch makes every later comparison meaningful.', text: 'Tune one string at a time and recheck strings after adjusting others. Turn tuning machines in small increments. Primer can sound the expected open notes for guitar, Drop D, bass and ukulele; use a tuner to compare pitch.', steps: ['Select the correct instrument in Setup or Tuning.', 'Play one reference string and compare it with a tuner.', 'Adjust in small turns, then play the string again to verify.'] },
        { title: 'Understand frets', description: 'Each neighboring fret raises a note by one semitone.', text: 'A fret is the space between two metal fret wires. Moving one fret toward the body raises the pitch by a half step; two frets make a whole step. The same pattern of distances appears on every string.', steps: ['Play an open string, then fret the first fret on the same string.', 'Move up one fret at a time and listen for each half step.', 'Compare a one-fret move with a two-fret move.'] },
        { title: 'Find the pulse', description: 'Coordinate a repeated movement with a steady beat before increasing speed.', text: 'Pulse is the regular beat beneath a piece of music. A metronome makes timing visible and audible. Begin slowly enough to keep each note even; accuracy is more useful than a fast, uneven run.', steps: ['Tap four even beats with your foot or hand.', 'Set the Primer mixer to a comfortable tempo and count aloud.', 'Pluck one open string on each beat for four bars.'] },
        { title: 'Play a first phrase', description: 'Build a tiny melody from clear timing and a small number of notes.', text: 'A phrase is a short musical thought. Use a few neighboring notes, repeat a rhythm, and leave a little silence. Singing the phrase helps connect what you hear to where the notes sit on the instrument.', steps: ['Choose two notes on one string and alternate them evenly.', 'Repeat the rhythm but change the final note.', 'Sing the phrase once, then play it back.'] },
        { title: 'Change between notes', description: 'Move one finger at a time and listen for gaps, buzzes and unwanted strings.', text: 'A useful change is relaxed and deliberate. Prepare the next finger close to the string, release excess pressure, and mute strings that should remain silent. On bass or ukulele, use the same idea with the selected tuning.', steps: ['Choose two nearby fretted notes and move between them slowly.', 'Keep the unused strings quiet with a light touch.', 'Repeat the change until both notes begin cleanly on the beat.'] },
        { title: 'Build a practice loop', description: 'Turn one clear goal into a short, repeatable practice session.', text: 'A good practice loop names one skill, a small amount of material and a way to check the result. Work in short sets, rest when tension builds, and finish by using the skill in a musical phrase.', steps: ['Write one goal that can be checked, such as four even repetitions.', 'Practice a short fragment slowly and note what needs attention.', 'Finish by making one phrase with the skill you practiced.'] }
    ];
    const STAGE_NAMES = [
        'Instrument and first sounds', 'Notes, fretboard and first scales', 'Intervals and scale logic', 'Chords and harmonic foundations', 'Modes and chord color',
        'Application and musicianship', 'Connect scales across the neck', 'Advanced scale colors', 'Chord craft and voice leading', 'Rhythm, composition and virtuosity'
    ];
    const FOCUS = [
        'Prepare your instrument and name the target before playing.',
        'Sing the target sound first, then find it on the instrument.',
        'Play five slow, even repetitions and keep the motion relaxed.',
        'Isolate the hardest movement and repeat only that small part.',
        'Play the material ascending and descending without losing the pulse.',
        'Use the metronome at the listed tempo; keep every attack even.',
        'Move the same idea to a neighboring string set or fretboard position.',
        'Make a short call-and-response phrase using the idea you just practiced.',
        'Transpose the idea to the listed key while keeping its musical function.',
        'Check intonation, timing and clean muting; record one accurate take.'
    ];
    const FOUNDATION_FOCUS = [
        'Point to each instrument part and say its name before playing.',
        'Trace one string from tuning machine to bridge without touching another string.',
        'Pluck one open string and let it ring without an accidental buzz.',
        'Compare two open strings and name which pitch sounds higher.',
        'Play the same open string three times with an even, relaxed motion.',
        'Tap four steady beats, then pluck the open string once on each beat.',
        'Move between two neighboring strings while keeping the unused string quiet.',
        'Fret one of the first three frets, release, and listen for a clean change.',
        'Repeat the action after checking the instrument tuning and hand position.',
        'Self-check: relaxed posture, clear tone, steady timing and quiet unused strings.'
    ];
    const INTRO_CONCEPTS = INTRO.map(function (item) {
        return { title: item.title, description: item.description, text: item.text, tasks: item.steps, source: 'Instrument foundations', foundation: true };
    });
    const lessons = typeof window.createLessonsData === 'function' ? window.createLessonsData() : [];
    const lessonConcepts = lessons.map(function (lesson) {
        return { title: lesson.title, description: lesson.description, text: lesson.text, tasks: lesson.steps, source: 'Music Lessons', patternType: lesson.patternType, patternId: lesson.patternId };
    });
    const courses = Array.isArray(window.STCourses) ? window.STCourses : [];
    const courseConcepts = courses.slice(4).map(function (course) {
        return { title: course.title, description: course.text, text: course.text, tasks: (course.learn || []).concat((course.steps || []).map(function (step) { return step.label; })), source: 'Courses' };
    });
    const CONCEPTS = INTRO_CONCEPTS.concat(lessonConcepts, courseConcepts).slice(0, 100);
    const MAP_TOTAL = 10000;

    function readJson(key, fallback) {
        try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback; } catch (error) { return fallback; }
    }
    function cleanSettings(raw) {
        const next = Object.assign({}, DEFAULT_SETTINGS, raw && typeof raw === 'object' ? raw : {});
        if (!KEYS.includes(next.key)) next.key = 'C';
        if (!INSTRUMENTS[next.instrument]) next.instrument = 'guitar';
        if (!['sine', 'triangle', 'square', 'sawtooth'].includes(next.waveform)) next.waveform = 'triangle';
        next.volume = Math.max(0, Math.min(0.8, Number(next.volume) || 0));
        next.tone = Math.max(0, Math.min(100, Number(next.tone) || 0));
        next.bpm = Math.max(40, Math.min(200, Number(next.bpm) || 80));
        next.sustain = Math.max(0.25, Math.min(5, Number(next.sustain) || 1.5));
        return next;
    }
    const settings = cleanSettings(readJson(STORAGE_SETTINGS, {}));
    const storedMap = readJson(STORAGE_MAP, {});
    let mapStep = Number.isInteger(storedMap.current) ? Math.max(1, Math.min(MAP_TOTAL, storedMap.current)) : 1;
    let completed = new Set(Array.isArray(storedMap.completed) ? storedMap.completed.filter(function (n) { return Number.isInteger(n) && n >= 1 && n <= MAP_TOTAL; }) : []);
    let panel = { type: 'intro', index: 0 };
    let windowState = 'open';
    let practiceSections = null;
    let practicePromise = null;
    let audioContext = null;
    let audioFilter = null;
    let audioMaster = null;
    let audioGeneration = 0;
    const voices = new Set();
    let patternMode = 'major';
    let patternIndex = 0;
    let patternKey = settings.key;
    let playPatternId = '';

    const windowEl = root.getElementById('primer-window');
    const indexEl = root.getElementById('primer-index');
    const pageEl = root.getElementById('primer-page');
    const windowTitleEl = root.getElementById('primer-window-title');
    const statusEl = root.getElementById('primer-status');
    const countEl = root.getElementById('primer-status-count');
    const taskbarEl = root.getElementById('primer-taskbar');
    const restoreButton = root.getElementById('primer-restore');
    const taskbarState = root.getElementById('primer-taskbar-state');
    const neckEl = root.getElementById('primer-neck');
    const neckTitle = root.getElementById('primer-neck-title');
    const neckInstrument = root.getElementById('primer-neck-instrument');

    function element(tag, className, text) {
        const node = root.createElement(tag);
        if (className) node.className = className;
        if (text !== undefined && text !== null) node.textContent = String(text);
        return node;
    }
    function saveSettings() {
        try { localStorage.setItem(STORAGE_SETTINGS, JSON.stringify(settings)); } catch (error) { setStatus('Settings could not be saved on this device.'); }
        updateAudioChain();
    }
    function saveMap() {
        try { localStorage.setItem(STORAGE_MAP, JSON.stringify({ current: mapStep, completed: Array.from(completed) })); } catch (error) { setStatus('Map progress could not be saved on this device.'); }
        countEl.textContent = completed.size + ' / ' + MAP_TOTAL.toLocaleString() + ' steps complete';
    }
    function setStatus(message) { statusEl.textContent = message; }
    function setPanel(next) {
        panel = next;
        if (windowState !== 'open') restoreWindow(false);
        render();
    }
    function showTool(action) {
        if (action === 'stop') { stopAudio(); setStatus('All Primer audio stopped.'); return; }
        const types = { play: 'play', read: 'read', map: 'map', pattern: 'pattern', mixer: 'mixer', setup: 'setup', tuning: 'tuning', help: 'help' };
        if (types[action]) {
            if (action === 'read') setPanel({ type: 'read', category: '', index: 0 });
            else setPanel({ type: types[action] });
        }
    }
    function updateToolState() {
        const active = panel.type === 'read' ? 'read' : panel.type;
        root.querySelectorAll('.primer-tool[data-action]').forEach(function (button) {
            button.setAttribute('aria-pressed', String(button.dataset.action === active));
        });
    }
    function render() {
        updateToolState();
        windowTitleEl.textContent = 'Primer / ' + panelTitle();
        indexEl.replaceChildren();
        pageEl.replaceChildren();
        if (panel.type === 'intro') renderIntro();
        else if (panel.type === 'read') renderRead();
        else if (panel.type === 'map') renderMap();
        else if (panel.type === 'play') renderPlay();
        else if (panel.type === 'pattern') renderPattern();
        else if (panel.type === 'mixer') renderMixer();
        else if (panel.type === 'setup') renderSetup();
        else if (panel.type === 'tuning') renderTuning();
        else if (panel.type === 'help') renderHelp();
        renderNeck();
    }
    function panelTitle() {
        if (panel.type === 'intro') return panel.index ? INTRO[panel.index].title : 'First sounds';
        if (panel.type === 'read') return panel.category ? ({ courses: 'Courses', lessons: 'Music Lessons', practice: 'Practice Room' }[panel.category] || 'Read') : 'Read';
        return ({ map: 'Learning Map', play: 'Play from a DAW', pattern: 'Chord Patterns', mixer: 'Mixer', setup: 'Setup', tuning: 'Tuning', help: 'Help' })[panel.type] || 'Reader';
    }
    function addIndexHeading(text) { indexEl.appendChild(element('h2', 'primer-index-heading', text)); }
    function addIndexButton(text, onClick, selected, extraClass) {
        const button = element('button', extraClass || '', text);
        button.type = 'button';
        if (selected) button.classList.add('is-selected');
        if (selected) button.setAttribute('aria-current', 'true');
        button.addEventListener('click', onClick);
        indexEl.appendChild(button);
        return button;
    }
    function addKicker(text) { pageEl.appendChild(element('p', 'primer-kicker', text)); }
    function addHeading(text, tag) { const heading = element(tag || 'h1', '', text); pageEl.appendChild(heading); return heading; }
    function addParagraph(text, className) { const p = element('p', className || '', text); pageEl.appendChild(p); return p; }
    function addLink(parent, href, label) {
        const a = element('a', '', label);
        a.href = href;
        parent.appendChild(a);
        return a;
    }
    function addList(parent, items, ordered) {
        const list = element(ordered ? 'ol' : 'ul', ordered ? 'primer-step-list' : '');
        (items || []).forEach(function (item) { list.appendChild(element('li', '', item)); });
        parent.appendChild(list);
        return list;
    }
    function actionButton(parent, text, handler, primary) {
        const button = element('button', primary ? 'primer-primary-button' : '', text);
        button.type = 'button';
        button.addEventListener('click', handler);
        parent.appendChild(button);
        return button;
    }
    function addMeta(parent, values) {
        const row = element('div', 'primer-page-meta');
        values.filter(Boolean).forEach(function (value) { row.appendChild(element('span', 'primer-chip', value)); });
        parent.appendChild(row);
    }
    function renderIntro() {
        const item = INTRO[Math.max(0, Math.min(INTRO.length - 1, Number(panel.index) || 0))];
        addIndexHeading('Instrument foundations');
        INTRO.forEach(function (chapter, index) {
            addIndexButton(String(index + 1).padStart(2, '0') + '  ' + chapter.title, function () { setPanel({ type: 'intro', index: index }); }, index === Number(panel.index));
        });
        addParagraph('Fretted string instruments / a guitar-first route with bass and ukulele setups', 'primer-index-note');
        addKicker('Primer / instrument foundations');
        addHeading(item.title);
        addParagraph(item.text, 'primer-lede');
        addHeading('First practice', 'h2');
        addList(pageEl, item.steps, true);
        const cards = element('div', 'primer-columns');
        const cardA = element('section', 'primer-card');
        cardA.appendChild(element('h2', '', 'A clear first sound'));
        cardA.appendChild(element('p', '', 'Tune one open string, pluck once, and let it ring. Keep the motion small and listen for a clean attack without string buzz.'));
        const cardB = element('section', 'primer-card');
        cardB.appendChild(element('h2', '', 'Continue the route'));
        cardB.appendChild(element('p', '', 'The map connects instrument setup to the existing lesson and course library, with each idea expanded into deliberate practice steps.'));
        cards.append(cardA, cardB);
        pageEl.appendChild(cards);
        const row = element('div', 'primer-action-row');
        actionButton(row, 'Open 10,000-step map', function () { setPanel({ type: 'map' }); }, true);
        actionButton(row, 'Tune open strings', function () { setPanel({ type: 'tuning' }); }, false);
        pageEl.appendChild(row);
    }
    function readTabs(selected) {
        const tabs = element('div', 'primer-tabs');
        [['courses', 'Courses'], ['lessons', 'Music Lessons'], ['practice', 'Practice Room']].forEach(function (entry) {
            const button = element('button', '', entry[1]);
            button.type = 'button';
            button.setAttribute('aria-pressed', String(selected === entry[0]));
            button.addEventListener('click', function () { openReadCategory(entry[0]); });
            tabs.appendChild(button);
        });
        pageEl.appendChild(tabs);
    }
    function openReadCategory(category) {
        setPanel({ type: 'read', category: category, index: 0 });
        if (category === 'practice') {
            loadPracticeSections().then(function () { if (panel.type === 'read' && panel.category === 'practice') render(); });
        }
    }
    function renderRead() {
        const category = panel.category;
        if (!category) {
            addIndexHeading('Read');
            [['courses', 'Courses'], ['lessons', 'Music Lessons'], ['practice', 'Practice Room']].forEach(function (entry) {
                addIndexButton(entry[1], function () { openReadCategory(entry[0]); }, false);
            });
            addKicker('Read / choose a library');
            addHeading('Read from the app library');
            addParagraph('Choose an existing course, a full Music Lesson, or a chapter from the Practice Room. Primer keeps the selected material in this reader and links back to its original page.');
            const cards = element('div', 'primer-source-list');
            const sources = [
                ['Courses', courses.length + ' guided course paths', 'courses'],
                ['Music Lessons', lessons.length + ' lessons with full explanations and practice steps', 'lessons'],
                ['Practice Room', 'Principles, tool guidance and example routines', 'practice']
            ];
            sources.forEach(function (source) {
                const button = element('button', '');
                button.type = 'button';
                button.appendChild(element('strong', '', source[0]));
                button.appendChild(element('small', '', source[1]));
                button.addEventListener('click', function () { openReadCategory(source[2]); });
                cards.appendChild(button);
            });
            pageEl.appendChild(cards);
            return;
        }
        readTabs(category);
        if (category === 'courses') {
            addIndexHeading('Courses (' + courses.length + ')');
            courses.forEach(function (course, index) { addIndexButton(course.title, function () { panel.index = index; render(); }, index === Number(panel.index)); });
            renderCourse(courses[Math.max(0, Math.min(courses.length - 1, Number(panel.index) || 0))]);
        } else if (category === 'lessons') {
            addIndexHeading('Music Lessons (' + lessons.length + ')');
            lessons.forEach(function (lesson, index) { addIndexButton(lesson.title, function () { panel.index = index; render(); }, index === Number(panel.index)); });
            renderLesson(lessons[Math.max(0, Math.min(lessons.length - 1, Number(panel.index) || 0))], Number(panel.index) || 0);
        } else {
            if (!practiceSections) {
                addIndexHeading('Practice Room');
                addIndexButton('Loading practice chapters...', function () {}, false);
                addKicker('Read / Practice Room');
                addHeading('Loading Practice Room');
                addParagraph('The chapter text is being read from practice.html.');
                return;
            }
            addIndexHeading('Practice Room (' + practiceSections.length + ')');
            practiceSections.forEach(function (section, index) { addIndexButton(section.title, function () { panel.index = index; render(); }, index === Number(panel.index)); });
            renderPracticeSection(practiceSections[Math.max(0, Math.min(practiceSections.length - 1, Number(panel.index) || 0))]);
        }
    }
    async function loadPracticeSections() {
        if (practiceSections) return practiceSections;
        if (practicePromise) return practicePromise;
        practicePromise = fetch('practice.html').then(function (response) {
            if (!response.ok) throw new Error('Practice Room could not be loaded.');
            return response.text();
        }).then(function (html) {
            const doc = new DOMParser().parseFromString(html, 'text/html');
            const source = doc.querySelector('.practice-text');
            if (!source) throw new Error('Practice Room content was not found.');
            const result = [];
            let current = { title: 'Introduction', paragraphs: [], bullets: [] };
            Array.from(source.children).forEach(function (child) {
                if (child.tagName === 'H3') {
                    if (current.paragraphs.length || current.bullets.length) result.push(current);
                    current = { title: child.textContent.trim(), paragraphs: [], bullets: [] };
                } else if (child.tagName === 'P') current.paragraphs.push(child.textContent.trim());
                else if (child.tagName === 'UL' || child.tagName === 'OL') Array.from(child.querySelectorAll(':scope > li')).forEach(function (li) { current.bullets.push(li.textContent.trim()); });
            });
            if (current.paragraphs.length || current.bullets.length) result.push(current);
            practiceSections = result;
            return result;
        }).catch(function () {
            practiceSections = [{ title: 'Practice Room', paragraphs: ['The Practice Room explains focused practice, steady timing, slow repetition, instrument setup, and example routines.'], bullets: ['Set one measurable goal.', 'Start slowly and use a metronome.', 'Pause when technique becomes tense.', 'Apply the drill in a short musical phrase.'] }];
            return practiceSections;
        });
        return practicePromise;
    }
    function renderCourse(course) {
        if (!course) { addKicker('Read / Courses'); addHeading('No course data is available'); return; }
        addKicker('Read / Courses / ' + course.level);
        addHeading(course.title);
        addParagraph(course.text, 'primer-lede');
        addHeading('Learning outcomes', 'h2');
        addList(pageEl, course.learn || [], false);
        addHeading('Course contents', 'h2');
        const list = element('ol', 'primer-course-steps');
        (course.steps || []).forEach(function (step) {
            const li = element('li');
            addLink(li, step.href || 'courses.html', step.label || step.kind || 'Open course item');
            li.appendChild(element('small', '', '  ' + (step.kind || 'Study')));
            list.appendChild(li);
        });
        pageEl.appendChild(list);
        const row = element('div', 'primer-action-row');
        addLink(row, 'courses.html', 'Open Courses');
        pageEl.appendChild(row);
    }
    function renderLesson(lesson, index) {
        if (!lesson) { addKicker('Read / Music Lessons'); addHeading('No lesson data is available'); return; }
        addKicker('Read / Music Lessons / Lesson ' + (index + 1) + ' of ' + lessons.length);
        addHeading(lesson.title);
        addParagraph(lesson.description, 'primer-lede');
        addParagraph(lesson.text);
        addMeta(pageEl, [lesson.patternType + ': ' + lesson.patternId, 'Key ' + settings.key]);
        const preview = element('div', 'primer-fretboard-preview');
        pageEl.appendChild(preview);
        if (window.MiniFretboard && lesson.patternType && lesson.patternId) {
            renderFretboard(preview, { key: settings.key, type: lesson.patternType, id: lesson.patternId, tuning: settings.instrument, labels: 'notes', frets: 12, title: lesson.title });
        }
        addHeading('Practice steps', 'h2');
        addList(pageEl, lesson.steps || [], true);
        if (Array.isArray(lesson.relatedSlides) && lesson.relatedSlides.length) {
            addHeading('Related patterns', 'h2');
            addParagraph(lesson.relatedSlides.join(' / '));
        }
        const row = element('div', 'primer-action-row');
        actionButton(row, 'Hear ' + (lesson.patternType === 'chord' ? 'chord' : 'scale'), async function () {
            const ok = await playArrangement([{ kind: lesson.patternType, item: lesson.patternId, key: settings.key, offset: 0, beats: 4 }], settings.key, settings.bpm);
            setStatus(ok ? 'Playing ' + lesson.title : 'Audio could not start. Check browser audio support.');
        }, true);
        addLink(row, 'lessons.html#lesson-' + index, 'Open in Music Lessons');
        pageEl.appendChild(row);
    }
    function renderPracticeSection(section) {
        if (!section) return;
        addKicker('Read / Practice Room');
        addHeading(section.title);
        (section.paragraphs || []).forEach(function (text) { addParagraph(text); });
        if (section.bullets && section.bullets.length) {
            addHeading('Practice notes', 'h2');
            addList(pageEl, section.bullets, false);
        }
        const row = element('div', 'primer-action-row');
        addLink(row, 'practice.html', 'Open Practice Room');
        pageEl.appendChild(row);
    }
    function renderMap() {
        const unitIndex = Math.floor((mapStep - 1) / 100);
        const stageIndex = Math.floor(unitIndex / 10);
        const concept = CONCEPTS[unitIndex] || CONCEPTS[0];
        addIndexHeading('10 chapters / 100 objectives');
        const tree = element('div', 'primer-map-tree');
        STAGE_NAMES.forEach(function (name, stage) {
            const details = element('details');
            if (stage === stageIndex) details.open = true;
            const summary = element('summary', '', String(stage + 1).padStart(2, '0') + '  ' + name + '  /  1,000 steps');
            details.appendChild(summary);
            const units = element('div', 'primer-map-units');
            for (let offset = 0; offset < 10; offset++) {
                const conceptIndex = stage * 10 + offset;
                const item = CONCEPTS[conceptIndex];
                if (!item) continue;
                const button = element('button', conceptIndex === unitIndex ? 'is-selected' : '', item.title);
                button.type = 'button';
                button.addEventListener('click', function () { setMapStep(conceptIndex * 100 + 1); });
                units.appendChild(button);
            }
            details.appendChild(units);
            tree.appendChild(details);
        });
        indexEl.appendChild(tree);
        const head = element('div', 'primer-map-head');
        head.appendChild(element('div', 'primer-kicker', 'Learning Map / Chapter ' + (stageIndex + 1) + ' / Objective ' + (unitIndex + 1)));
        head.appendChild(element('div', 'primer-chip', completed.size + ' complete'));
        const seek = element('label', 'primer-map-seek');
        seek.appendChild(element('span', '', 'Step 1'));
        const range = root.createElement('input');
        range.type = 'range'; range.min = '1'; range.max = String(MAP_TOTAL); range.value = String(mapStep); range.setAttribute('aria-label', 'Jump to learning step');
        const value = element('output', '', mapStep.toLocaleString());
        range.addEventListener('input', function () { value.value = Number(range.value).toLocaleString(); });
        range.addEventListener('change', function () { setMapStep(Number(range.value)); });
        seek.append(range, value, element('span', '', '10,000'));
        head.appendChild(seek);
        pageEl.appendChild(head);
        addHeading(concept.title, 'h1');
        addParagraph(concept.description, 'primer-lede');
        addMeta(pageEl, [concept.source, 'Step ' + mapStep.toLocaleString() + ' of ' + MAP_TOTAL.toLocaleString(), 'Pass ' + (Math.floor(((mapStep - 1) % 100) / 10) + 1) + ' / 10']);
        const task = element('section', 'primer-map-task');
        task.appendChild(element('div', 'primer-map-task-label', 'Deliberate practice / rep ' + (((mapStep - 1) % 10) + 1) + ' of 10'));
        const taskParts = mapTask(concept, unitIndex, mapStep);
        task.appendChild(element('p', '', taskParts.action));
        task.appendChild(element('p', '', taskParts.constraint));
        task.appendChild(element('p', '', taskParts.check));
        pageEl.appendChild(task);
        addHeading('Objective notes', 'h2');
        addParagraph(concept.text || concept.description);
        if (concept.tasks && concept.tasks.length) {
            addHeading('Source practice steps', 'h2');
            addList(pageEl, concept.tasks.slice(0, 8), true);
        }
        const pct = Math.round(completed.size * 100 / MAP_TOTAL);
        const progress = element('div', 'primer-map-progress');
        const fill = element('span'); fill.style.width = pct + '%'; progress.appendChild(fill); pageEl.appendChild(progress);
        const row = element('div', 'primer-action-row');
        actionButton(row, completed.has(mapStep) ? 'Completed' : 'Mark complete and continue', function () {
            completed.add(mapStep);
            saveMap();
            if (mapStep < MAP_TOTAL) setMapStep(mapStep + 1); else render();
        }, true).disabled = completed.has(mapStep);
        actionButton(row, 'Previous', function () { setMapStep(Math.max(1, mapStep - 1)); }, false).disabled = mapStep <= 1;
        actionButton(row, 'Next', function () { setMapStep(Math.min(MAP_TOTAL, mapStep + 1)); }, false).disabled = mapStep >= MAP_TOTAL;
        pageEl.appendChild(row);
        const origin = element('p', 'primer-index-note', 'Built from 10 instrument foundations, 50 existing Music Lessons and 40 focused course modules. Each objective has 10 passes with 10 practice constraints.');
        indexEl.appendChild(origin);
    }
    function mapTask(concept, unitIndex, step) {
        const within = (step - 1) % 100;
        const pass = Math.floor(within / 10);
        const rep = within % 10;
        const taskList = concept.tasks && concept.tasks.length ? concept.tasks : [concept.description];
        const base = taskList[(pass + rep) % taskList.length];
        const keyStart = Math.max(0, KEYS.indexOf(settings.key));
        const key = KEYS[(keyStart + unitIndex * 7 + pass * 5 + rep * 3) % KEYS.length];
        const stage = Math.floor(unitIndex / 10);
        const bpm = Math.min(174, 48 + stage * 10 + pass * 4);
        const instrument = INSTRUMENTS[settings.instrument].label;
        const focus = concept.foundation ? FOUNDATION_FOCUS[rep] : FOCUS[rep];
        return {
            action: 'Base action: ' + base,
            constraint: concept.foundation
                ? 'Use ' + instrument + ' with open strings and the first three frets. ' + focus
                : 'Practice on ' + instrument + ' in ' + key + ', around position ' + (1 + ((stage * 3 + pass) % 12)) + ', at ' + bpm + ' BPM. ' + focus,
            check: 'Complete this step when you can make three clean attempts in a row without losing the pulse or adding unwanted string noise.'
        };
    }
    function setMapStep(value) {
        mapStep = Math.max(1, Math.min(MAP_TOTAL, Math.round(Number(value) || 1)));
        saveMap();
        if (panel.type === 'map') render();
    }
    function savedPatterns() {
        const raw = readJson('st_daw_patterns_v1', []);
        const list = Array.isArray(raw) ? raw.slice(0, 1000) : [];
        const output = [];
        let skipped = 0;
        list.forEach(function (pattern) {
            if (!pattern || typeof pattern !== 'object' || typeof pattern.name !== 'string' || !Array.isArray(pattern.steps) || pattern.steps.length > 256) { skipped++; return; }
            const key = KEYS.includes(pattern.key) ? pattern.key : 'C';
            const steps = [];
            for (const step of pattern.steps) {
                if (!step || typeof step !== 'object') { skipped++; return; }
                const kind = step.kind;
                if (kind === 'rest') { steps.push({ kind: 'rest', beats: Math.max(1, Math.min(16, Number(step.beats) || 4)) }); continue; }
                const item = String(step.item || '');
                if (!['chord', 'scale', 'interval'].includes(kind) || !theory[kind === 'interval' ? 'intervals' : kind === 'chord' ? 'chords' : 'scales'][item]) { skipped++; return; }
                const offset = Number(step.offset);
                if (!Number.isFinite(offset) || offset < -24 || offset > 24) { skipped++; return; }
                steps.push({ kind: kind, item: item, offset: Math.round(offset), beats: Math.max(1, Math.min(16, Number(step.beats) || 4)), key: KEYS.includes(step.key) ? step.key : key });
            }
            if (!steps.length) { skipped++; return; }
            output.push({ id: String(pattern.id || pattern.name), name: pattern.name.slice(0, 120), key: key, tempo: Math.max(40, Math.min(220, Number(pattern.tempo) || settings.bpm)), steps: steps });
        });
        return { items: output, skipped: skipped };
    }
    function renderPlay() {
        const result = savedPatterns();
        addIndexHeading('Choose a DAW');
        addIndexButton('Pattern Studio', function () { root.getElementById('daw-open-link').click(); }, false);
        addIndexButton('Theory Decks DAW', function () { root.getElementById('td-daw-open-link').click(); }, false);
        addParagraph(result.items.length + ' saved Pattern Studio patterns', 'primer-index-note');
        addKicker('Play / select from your DAWs');
        addHeading('Play a saved arrangement');
        addParagraph('Primer can audition saved Pattern Studio blocks on this device. Use the links to edit or compose in either DAW.');
        const studioData = result;
        if (!studioData.items.length) {
            const empty = element('div', 'primer-empty', 'No saved Pattern Studio arrangements were found on this device. Save a pattern in Pattern Studio, then return here to audition it.');
            pageEl.appendChild(empty);
        } else {
            const label = element('label', 'primer-control');
            label.appendChild(element('strong', '', 'Saved Pattern Studio arrangement'));
            const select = root.createElement('select'); select.id = 'primer-play-pattern';
            studioData.items.forEach(function (pattern) { const option = root.createElement('option'); option.value = pattern.id; option.textContent = pattern.name + ' / ' + pattern.key + ' / ' + pattern.steps.length + ' blocks'; select.appendChild(option); });
            if (playPatternId && studioData.items.some(function (item) { return item.id === playPatternId; })) select.value = playPatternId;
            else playPatternId = select.value;
            select.addEventListener('change', function () { playPatternId = select.value; });
            label.appendChild(select);
            pageEl.appendChild(label);
            const current = studioData.items.find(function (item) { return item.id === select.value; }) || studioData.items[0];
            addParagraph(current.name + ' / ' + current.steps.length + ' blocks / ' + current.tempo + ' BPM / key ' + current.key);
            const row = element('div', 'primer-action-row');
            actionButton(row, 'Play selected pattern', async function () {
                const pattern = studioData.items.find(function (item) { return item.id === select.value; });
                const ok = pattern && await playArrangement(pattern.steps, pattern.key, pattern.tempo);
                setStatus(ok ? 'Playing ' + (pattern && pattern.name) : 'This arrangement could not be played.');
            }, true);
            pageEl.appendChild(row);
        }
        if (result.skipped) addParagraph(result.skipped + ' invalid or overlong saved entries were skipped.');
        const links = element('div', 'primer-link-list');
        const daw = element('a', '', ''); daw.href = 'daw.html'; daw.id = 'daw-open-link'; daw.append(element('strong', '', 'Open Pattern Studio'), element('span', '', 'Edit patterns and save them on this device')); links.appendChild(daw);
        const td = element('a', '', ''); td.href = 'theory-decks/daw.html'; td.id = 'td-daw-open-link';
        let tdTitle = 'Open Theory Decks DAW';
        const tdSong = readJson('td-daw', null);
        if (tdSong && typeof tdSong.title === 'string' && tdSong.title) tdTitle += ' / ' + tdSong.title.slice(0, 70);
        td.append(element('strong', '', tdTitle), element('span', '', 'Compose a song from chords and cards'));
        links.appendChild(td);
        pageEl.appendChild(links);
    }
    function progressionCatalog(mode) {
        const catalog = window.STProgressionPresets && window.STProgressionPresets[mode];
        return Array.isArray(catalog) ? catalog : [];
    }
    function renderPattern() {
        const catalog = progressionCatalog(patternMode);
        if (patternIndex >= catalog.length) patternIndex = 0;
        addIndexHeading('Progression functions');
        const modeButton = addIndexButton(patternMode === 'major' ? 'Major functions' : 'Minor functions', function () {
            patternMode = patternMode === 'major' ? 'minor' : 'major'; patternIndex = 0; render();
        }, false);
        modeButton.title = 'Switch between major and minor progression functions';
        addParagraph(catalog.length + ' progressions in this function family', 'primer-index-note');
        addKicker('Pattern / chord progression functions');
        addHeading('Choose a progression');
        addParagraph('Presets come from the Chord Progressions catalog. Select a tonic, inspect the function notes, then play the sequence through the Primer mixer.');
        if (!catalog.length) {
            pageEl.appendChild(element('div', 'primer-empty', 'The progression catalog is unavailable on this page.'));
            return;
        }
        const controls = element('div', 'primer-control-grid');
        const presetControl = element('label', 'primer-control');
        presetControl.appendChild(element('strong', '', 'Progression'));
        const presetSelect = root.createElement('select');
        catalog.forEach(function (item, index) { const option = root.createElement('option'); option.value = String(index); option.textContent = item[0]; presetSelect.appendChild(option); });
        presetSelect.value = String(patternIndex);
        presetSelect.addEventListener('change', function () { patternIndex = Number(presetSelect.value) || 0; render(); });
        presetControl.appendChild(presetSelect);
        const keyControl = element('label', 'primer-control');
        keyControl.appendChild(element('strong', '', 'Tonic key'));
        const keySelect = root.createElement('select');
        KEYS.forEach(function (key) { const option = root.createElement('option'); option.value = key; option.textContent = key; keySelect.appendChild(option); });
        keySelect.value = patternKey;
        keySelect.addEventListener('change', function () { patternKey = keySelect.value; });
        keyControl.appendChild(keySelect);
        controls.append(presetControl, keyControl);
        pageEl.appendChild(controls);
        const selected = catalog[patternIndex];
        addHeading(selected[0], 'h2');
        addParagraph(selected[2] || 'A reusable progression from the existing chord-function catalog.');
        const sequence = selected[1];
        const roman = patternMode === 'major' ? ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'] : ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII'];
        const functionNames = patternMode === 'major' ? ['tonic', 'supertonic', 'mediant', 'subdominant', 'dominant', 'submediant', 'leading tone'] : ['tonic', 'supertonic', 'mediant', 'subdominant', 'dominant', 'submediant', 'subtonic'];
        const sequenceItems = sequence.map(function (degree) { return roman[degree] + ' / ' + functionNames[degree]; });
        addMeta(pageEl, sequenceItems);
        const row = element('div', 'primer-action-row');
        actionButton(row, 'Play progression', async function () {
            const offsets = patternMode === 'major' ? [0, 2, 4, 5, 7, 9, 11] : [0, 2, 3, 5, 7, 8, 10];
            const qualities = patternMode === 'major' ? ['major', 'minor', 'minor', 'major', 'major', 'minor', 'diminished'] : ['minor', 'diminished', 'major', 'minor', 'minor', 'major', 'major'];
            const steps = sequence.map(function (degree) { return { kind: 'chord', item: qualities[degree], key: patternKey, offset: offsets[degree], beats: 4 }; });
            const ok = await playArrangement(steps, patternKey, settings.bpm);
            setStatus(ok ? 'Playing ' + selected[0] + ' in ' + patternKey : 'Progression playback could not start.');
        }, true);
        pageEl.appendChild(row);
        addParagraph('Mixer tempo: ' + settings.bpm + ' BPM. Tone, volume and sustain are adjusted in Mixer.');
        const linkRow = element('div', 'primer-action-row'); addLink(linkRow, 'dummy.html', 'Open Chord Progressions'); pageEl.appendChild(linkRow);
    }
    function renderMixer() {
        addIndexHeading('Sound controls');
        [['Waveform', 'waveform'], ['Volume', 'volume'], ['Tone filter', 'tone'], ['Tempo', 'bpm'], ['String sustain', 'sustain']].forEach(function (entry) { addIndexButton(entry[0], function () { pageEl.querySelector('input[data-control="' + entry[1] + '"],select[data-control="' + entry[1] + '"]')?.focus(); }, false); });
        addKicker('Mixer / local sound');
        addHeading('Shape the sound');
        addParagraph('Mixer changes apply to Primer previews and tuning tones. Playback is generated locally in the browser.');
        const grid = element('div', 'primer-control-grid');
        const wave = element('label', 'primer-control');
        wave.appendChild(element('strong', '', 'Waveform'));
        const waveSelect = root.createElement('select'); waveSelect.dataset.control = 'waveform';
        [['sine', 'Sine'], ['triangle', 'Triangle'], ['square', 'Square'], ['sawtooth', 'Sawtooth']].forEach(function (item) { const option = root.createElement('option'); option.value = item[0]; option.textContent = item[1]; waveSelect.appendChild(option); });
        waveSelect.value = settings.waveform;
        waveSelect.addEventListener('change', function () { settings.waveform = waveSelect.value; saveSettings(); setStatus('Waveform set to ' + waveSelect.value + '.'); });
        wave.appendChild(waveSelect);
        grid.appendChild(wave);
        addRangeControl(grid, 'Volume', 'volume', 0, 0.8, 0.01, settings.volume, function (value) { settings.volume = value; return Math.round(value * 100) + '%'; });
        addRangeControl(grid, 'Tone filter', 'tone', 0, 100, 1, settings.tone, function (value) { return value < 35 ? 'Warm' : value > 70 ? 'Bright' : 'Balanced'; });
        addRangeControl(grid, 'Tempo', 'bpm', 40, 200, 1, settings.bpm, function (value) { return Math.round(value) + ' BPM'; });
        addRangeControl(grid, 'String sustain', 'sustain', 0.25, 5, 0.05, settings.sustain, function (value) { return Number(value).toFixed(2) + ' sec'; });
        pageEl.appendChild(grid);
        actionButton(pageEl, 'Stop sound', function () { stopAudio(); setStatus('All Primer audio stopped.'); }, false);
    }
    function addRangeControl(parent, title, key, min, max, step, value, format) {
        const box = element('label', 'primer-control');
        box.dataset.control = key;
        box.appendChild(element('strong', '', title));
        const row = element('div', 'primer-control-row');
        const range = root.createElement('input'); range.type = 'range'; range.min = String(min); range.max = String(max); range.step = String(step); range.value = String(value); range.dataset.control = key;
        const output = element('output', '', format(value));
        range.addEventListener('input', function () {
            const number = Number(range.value); settings[key] = number; output.value = format(number); saveSettings();
        });
        row.append(range, output); box.appendChild(row); parent.appendChild(box);
    }
    function renderSetup() {
        addIndexHeading('Primer defaults');
        addIndexButton('Default key', function () { root.getElementById('primer-default-key')?.focus(); }, false);
        addIndexButton('Instrument tuning', function () { root.getElementById('primer-default-instrument')?.focus(); }, false);
        addKicker('Setup / component defaults');
        addHeading('Main settings');
        addParagraph('These defaults are saved on this device and are used by the reader diagrams, map prompts, Pattern and Tuning.');
        const grid = element('div', 'primer-control-grid');
        const keyControl = element('label', 'primer-control');
        keyControl.appendChild(element('strong', '', 'Default key'));
        const keySelect = root.createElement('select'); keySelect.id = 'primer-default-key';
        KEYS.forEach(function (key) { const option = root.createElement('option'); option.value = key; option.textContent = key; keySelect.appendChild(option); });
        keySelect.value = settings.key;
        keySelect.addEventListener('change', function () { settings.key = keySelect.value; patternKey = settings.key; saveSettings(); renderNeck(); setStatus('Default key set to ' + settings.key + '.'); });
        keyControl.appendChild(keySelect);
        const instrumentControl = element('label', 'primer-control');
        instrumentControl.appendChild(element('strong', '', 'Instrument and tuning'));
        const instrumentSelect = root.createElement('select'); instrumentSelect.id = 'primer-default-instrument';
        Object.keys(INSTRUMENTS).forEach(function (key) { const option = root.createElement('option'); option.value = key; option.textContent = INSTRUMENTS[key].label + ' / ' + INSTRUMENTS[key].tuning; instrumentSelect.appendChild(option); });
        instrumentSelect.value = settings.instrument;
        instrumentSelect.addEventListener('change', function () { settings.instrument = instrumentSelect.value; saveSettings(); renderNeck(); setStatus('Instrument set to ' + INSTRUMENTS[settings.instrument].label + '.'); });
        instrumentControl.appendChild(instrumentSelect);
        grid.append(keyControl, instrumentControl);
        pageEl.appendChild(grid);
        addHeading('Fretboard display', 'h2');
        addParagraph('Lesson and map diagrams follow the selected key and instrument. Sound settings live in Mixer; string-by-string reference tones live in Tuning.');
        const row = element('div', 'primer-action-row');
        actionButton(row, 'Open Mixer', function () { setPanel({ type: 'mixer' }); }, false);
        actionButton(row, 'Open Tuning', function () { setPanel({ type: 'tuning' }); }, false);
        pageEl.appendChild(row);
    }
    function renderTuning() {
        const selected = INSTRUMENTS[settings.instrument];
        addIndexHeading('Open strings');
        addIndexButton('Play all open strings', function () { playAllStrings(); }, false);
        selected.strings.forEach(function (string, index) { addIndexButton('String ' + (selected.strings.length - index) + ' / ' + string.note + string.octave, function () { playOneString(index); }, false); });
        addKicker('Tuning / reference tones');
        addHeading(selected.label + ' / ' + selected.tuning);
        addParagraph('Play a reference note, then compare it with a tuner or the instrument. Add sustain seconds to let each pitch ring long enough to check.');
        const controls = element('div', 'primer-control-grid');
        const instrumentControl = element('label', 'primer-control');
        instrumentControl.appendChild(element('strong', '', 'Instrument'));
        const instrumentSelect = root.createElement('select');
        Object.keys(INSTRUMENTS).forEach(function (key) { const option = root.createElement('option'); option.value = key; option.textContent = INSTRUMENTS[key].label + ' / ' + INSTRUMENTS[key].tuning; instrumentSelect.appendChild(option); });
        instrumentSelect.value = settings.instrument;
        instrumentSelect.addEventListener('change', function () { settings.instrument = instrumentSelect.value; saveSettings(); render(); });
        instrumentControl.appendChild(instrumentSelect);
        const sustain = element('label', 'primer-control');
        sustain.appendChild(element('strong', '', 'Sustain seconds'));
        const seconds = root.createElement('input'); seconds.type = 'number'; seconds.min = '0.25'; seconds.max = '5'; seconds.step = '0.05'; seconds.value = String(settings.sustain); seconds.setAttribute('aria-label', 'Tuning tone sustain seconds');
        seconds.addEventListener('change', function () { settings.sustain = Math.max(0.25, Math.min(5, Number(seconds.value) || 1.5)); seconds.value = String(settings.sustain); saveSettings(); });
        sustain.appendChild(seconds);
        controls.append(instrumentControl, sustain); pageEl.appendChild(controls);
        const rows = element('div', 'primer-string-list');
        selected.strings.forEach(function (string, index) {
            const row = element('div', 'primer-string-row');
            row.appendChild(element('strong', '', 'String ' + (selected.strings.length - index)));
            row.appendChild(element('span', '', string.note + string.octave));
            const frequency = theory.getNoteFrequency(string.note, string.octave);
            row.appendChild(element('small', '', frequency ? frequency.toFixed(1) + ' Hz' : 'Reference pitch'));
            actionButton(row, 'Play', function () { playOneString(index); }, false);
            rows.appendChild(row);
        });
        pageEl.appendChild(rows);
        const row = element('div', 'primer-action-row');
        actionButton(row, 'Play all strings', playAllStrings, true);
        actionButton(row, 'Stop', function () { stopAudio(); setStatus('Tuning tone stopped.'); }, false);
        pageEl.appendChild(row);
        addParagraph('Reference pitch is equal temperament at A4 = 440 Hz. Tune with a physical or app tuner for exact string tension and intonation.');
    }
    async function playOneString(index) {
        const strings = INSTRUMENTS[settings.instrument].strings;
        const item = strings[index];
        if (!item) return;
        const frequency = theory.getNoteFrequency(item.note, item.octave);
        const ok = frequency && await playAudioEvents([{ frequency: frequency, start: 0, duration: settings.sustain }]);
        setStatus(ok ? 'Playing ' + item.note + item.octave + ' for ' + settings.sustain + ' seconds.' : 'Audio could not start.');
    }
    async function playAllStrings() {
        const strings = INSTRUMENTS[settings.instrument].strings;
        const events = strings.map(function (item, index) { return { frequency: theory.getNoteFrequency(item.note, item.octave), start: index * (settings.sustain + 0.12), duration: settings.sustain }; }).filter(function (item) { return item.frequency; });
        const ok = await playAudioEvents(events);
        setStatus(ok ? 'Playing all open-string reference tones.' : 'Audio could not start.');
    }
    function renderHelp() {
        addIndexHeading('Help and resources');
        [['Site Map', 'site-map.html'], ['Settings', 'settings.html'], ['About', 'about.html'], ['Release Notes', 'release-notes.html'], ['Courses', 'courses.html'], ['Music Lessons', 'lessons.html'], ['Practice Room', 'practice.html']].forEach(function (item) {
            const link = element('a', '', item[0]); link.href = item[1]; indexEl.appendChild(link);
        });
        addKicker('Help / app references');
        addHeading('Primer resources');
        addParagraph('Use the site map to find every tool, Settings to configure the wider app, or About and Release Notes for project details.');
        const list = element('div', 'primer-link-list');
        [['Site Map', 'site-map.html', 'Browse the full app directory'], ['Settings', 'settings.html', 'Configure app-wide defaults'], ['About', 'about.html', 'Read about Scales Thesaurus'], ['Release Notes', 'release-notes.html', 'See recent changes'], ['Courses', 'courses.html', 'Open the structured course library'], ['Music Lessons', 'lessons.html', 'Open all guided lessons'], ['Practice Room', 'practice.html', 'Open drills and practice guidance']].forEach(function (item) {
            const a = element('a', '', ''); a.href = item[1]; a.append(element('strong', '', item[0]), element('span', '', item[2])); list.appendChild(a);
        });
        pageEl.appendChild(list);
    }
    function renderFretboard(container, options) {
        window.MiniFretboard.render(container, options);
        const svg = container.querySelector('svg.mfb');
        if (svg) svg.setAttribute('preserveAspectRatio', 'none');
    }
    function renderNeck() {
        if (!neckEl) return;
        let type = 'scale', id = 'major', key = settings.key;
        if (panel.type === 'read' && panel.category === 'lessons') {
            const lesson = lessons[Number(panel.index) || 0];
            if (lesson && lesson.patternType && lesson.patternId) { type = lesson.patternType; id = lesson.patternId; }
        } else if (panel.type === 'map') {
            const concept = CONCEPTS[Math.floor((mapStep - 1) / 100)];
            if (concept && concept.patternType && concept.patternId) { type = concept.patternType; id = concept.patternId; }
        }
        if (window.MiniFretboard) renderFretboard(neckEl, { key: key, type: type, id: id, tuning: settings.instrument, frets: 12, labels: 'notes', title: 'Primer ' + key + ' ' + id });
        neckTitle.textContent = 'FRETBOARD / ' + key.toUpperCase() + ' ' + (id || 'MAJOR').replace(/_/g, ' ').toUpperCase();
        const instrument = INSTRUMENTS[settings.instrument];
        neckInstrument.textContent = instrument.label.toUpperCase() + ' / ' + instrument.tuning.toUpperCase();
    }
    function getAudioChain() {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return null;
        if (!audioContext) {
            audioContext = new AudioContextClass();
            audioFilter = audioContext.createBiquadFilter();
            audioMaster = audioContext.createGain();
            audioFilter.type = 'lowpass';
            audioFilter.connect(audioMaster).connect(audioContext.destination);
        }
        updateAudioChain();
        return audioContext;
    }
    function updateAudioChain() {
        if (!audioContext || !audioFilter || !audioMaster) return;
        const now = audioContext.currentTime;
        audioMaster.gain.setTargetAtTime(settings.volume, now, 0.025);
        audioFilter.frequency.setTargetAtTime(250 * Math.pow(24, settings.tone / 100), now, 0.035);
        audioFilter.Q.setTargetAtTime(0.65, now, 0.035);
    }
    function stopAudio() {
        audioGeneration++;
        if (window.STAudioPreview && typeof window.STAudioPreview.stop === 'function') window.STAudioPreview.stop();
        if (!audioContext) return;
        const now = audioContext.currentTime;
        voices.forEach(function (voice) {
            try {
                voice.gain.gain.cancelScheduledValues(now);
                voice.gain.gain.setTargetAtTime(0.0001, now, 0.012);
                voice.oscillator.stop(now + 0.05);
            } catch (error) {}
        });
        voices.clear();
    }
    function playAudioEvents(events) {
        stopAudio();
        if (!Array.isArray(events) || !events.length) return false;
        const token = audioGeneration;
        let context;
        try { context = getAudioChain(); } catch (error) { return false; }
        if (!context) return false;
        const start = async function () {
            try {
                if (context.state !== 'running') await context.resume();
                if (token !== audioGeneration || context.state !== 'running') return false;
                const base = context.currentTime + 0.04;
                events.forEach(function (event) {
                    const frequency = Number(event.frequency);
                    const duration = Math.max(0.08, Math.min(20, Number(event.duration) || 0.5));
                    if (!Number.isFinite(frequency) || frequency < 20 || frequency > 16000) return;
                    const onset = base + Math.max(0, Number(event.start) || 0);
                    const oscillator = context.createOscillator();
                    const gain = context.createGain();
                    oscillator.type = settings.waveform;
                    oscillator.frequency.setValueAtTime(frequency, onset);
                    gain.gain.setValueAtTime(0.0001, onset);
                    gain.gain.exponentialRampToValueAtTime(0.2, onset + 0.02);
                    gain.gain.setValueAtTime(0.2, Math.max(onset + 0.025, onset + duration * 0.72));
                    gain.gain.exponentialRampToValueAtTime(0.0001, onset + duration);
                    oscillator.connect(gain).connect(audioFilter);
                    const voice = { oscillator: oscillator, gain: gain };
                    voices.add(voice);
                    oscillator.onended = function () { voices.delete(voice); };
                    oscillator.start(onset);
                    oscillator.stop(onset + duration + 0.04);
                });
                return true;
            } catch (error) {
                if (token === audioGeneration) setStatus('Browser audio could not start. Tap Play again to retry.');
                return false;
            }
        };
        return start();
    }
    function playArrangement(steps, key, bpm) {
        if (!Array.isArray(steps) || !steps.length) return false;
        const tempo = Math.max(40, Math.min(220, Number(bpm) || settings.bpm));
        const beat = 60 / tempo;
        let elapsed = 0;
        const events = [];
        for (const step of steps) {
            const blockBeats = Math.max(1, Math.min(16, Number(step.beats) || 4));
            const blockSeconds = blockBeats * beat;
            if (step.kind === 'rest') { elapsed += blockSeconds; continue; }
            const selectedKey = step.key || key || settings.key;
            const rootIndex = theory.notes.indexOf(theory.toSharp(selectedKey));
            if (rootIndex < 0) continue;
            const offset = ((Math.round(Number(step.offset) || 0) % 12) + 12) % 12;
            const root = theory.notes[(rootIndex + offset) % 12];
            let notes = [];
            if (step.kind === 'scale' && theory.scales[step.item]) notes = theory.getScaleNotes(root, step.item);
            else if (step.kind === 'chord' && theory.chords[step.item]) notes = theory.getChordNotes(root, step.item);
            else if (step.kind === 'interval' && theory.intervals[step.item]) notes = step.item === '1' ? [root] : [root, theory.getNoteFromInterval(root, step.item)];
            if (!notes.length) { elapsed += blockSeconds; continue; }
            let octave = step.kind === 'chord' ? 3 : 4;
            let previous = -Infinity;
            const frequencies = notes.map(function (note) {
                let frequency = theory.getNoteFrequency(note, octave);
                while (frequency && frequency <= previous && octave < 7 && !(step.kind === 'interval' && step.item === '1')) {
                    octave++;
                    frequency = theory.getNoteFrequency(note, octave);
                }
                if (frequency) previous = frequency;
                return frequency;
            }).filter(Boolean);
            if (step.kind === 'chord') {
                const bass = theory.getNoteFrequency(root, 2);
                if (bass) events.push({ frequency: bass, start: elapsed, duration: blockSeconds * 0.83 });
                frequencies.forEach(function (frequency, index) { events.push({ frequency: frequency, start: elapsed + index * 0.018, duration: blockSeconds * 0.83 }); });
            } else {
                const line = step.kind === 'scale' && frequencies.length > 2 ? frequencies.concat(frequencies.slice(0, -1).reverse()) : frequencies;
                const spacing = blockSeconds * 0.84 / Math.max(1, line.length);
                line.forEach(function (frequency, index) { events.push({ frequency: frequency, start: elapsed + index * spacing, duration: Math.max(0.12, spacing * 0.72) }); });
            }
            elapsed += blockSeconds;
        }
        return playAudioEvents(events);
    }
    function windowControl(action) {
        if (action === 'maximize') {
            windowEl.hidden = false; windowState = 'open'; windowEl.classList.remove('is-minimized', 'is-custom');
            const active = windowEl.classList.toggle('is-maximized');
            taskbarEl.hidden = true; setStatus(active ? 'Reader maximized.' : 'Reader returned to the workspace.');
        } else if (action === 'custom') {
            windowEl.hidden = false; windowState = 'open'; windowEl.classList.remove('is-minimized', 'is-maximized');
            const active = windowEl.classList.toggle('is-custom');
            taskbarEl.hidden = true; setStatus(active ? 'Custom size enabled. Drag the lower-right corner.' : 'Reader returned to the workspace size.');
        } else if (action === 'minimize') {
            windowState = 'minimized'; windowEl.hidden = true; windowEl.classList.add('is-minimized'); windowEl.classList.remove('is-maximized', 'is-custom');
            taskbarEl.hidden = false; restoreButton.textContent = 'Restore Primer'; taskbarState.textContent = 'Reader minimized';
        } else if (action === 'close') {
            stopAudio(); windowState = 'closed'; panel = { type: 'intro', index: 0 }; windowEl.hidden = true;
            windowEl.classList.remove('is-minimized', 'is-maximized', 'is-custom'); taskbarEl.hidden = false;
            restoreButton.textContent = 'Open Primer'; taskbarState.textContent = 'Reader closed'; setStatus('Reader closed. Use Open Primer or a toolbar tool to continue.');
        }
    }
    function restoreWindow(fromTaskbar) {
        const wasClosed = windowState === 'closed';
        windowState = 'open'; windowEl.hidden = false; windowEl.classList.remove('is-minimized', 'is-maximized', 'is-custom'); taskbarEl.hidden = true;
        if (wasClosed && fromTaskbar) panel = { type: 'intro', index: 0 };
        render();
        setStatus(wasClosed ? 'Primer reader opened.' : 'Reader restored.');
    }
    function renderWindowControls() {
        root.querySelectorAll('[data-window]').forEach(function (button) {
            button.addEventListener('click', function () { windowControl(button.dataset.window); });
        });
        restoreButton.addEventListener('click', function () { restoreWindow(true); });
        root.querySelector('.primer-toolbar').addEventListener('click', function (event) {
            const button = event.target.closest('[data-action]');
            if (button) showTool(button.dataset.action);
        });
    }
    function addStartupStatus() {
        countEl.textContent = completed.size + ' / ' + MAP_TOTAL.toLocaleString() + ' steps complete';
        setStatus(CONCEPTS.length === 100 ? '100 objectives / 10,000 deliberate practice steps ready.' : 'Learning map loaded with ' + CONCEPTS.length + ' objectives.');
    }
    function init() {
        renderWindowControls();
        addStartupStatus();
        render();
    }
    document.addEventListener('DOMContentLoaded', init);
})();