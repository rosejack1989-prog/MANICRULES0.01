/**
 * Melodic Pattern Playback Extension
 */
if (typeof App !== 'undefined') {
    App.prototype.readMelodicPatternData = function () {
        const patternSelect = document.getElementById('melodic-pattern-select');
        const lengthSelect = document.getElementById('melodic-pattern-length');
        if (!patternSelect) throw new Error('Melodic pattern controls are unavailable.');

        let rawString;
        if (patternSelect.value === 'custom') {
            rawString = document.getElementById('custom-pattern')?.value || '';
        } else if (lengthSelect?.value === 'custom') {
            rawString = document.getElementById('melodic-custom-length')?.value || '';
        } else if (lengthSelect && lengthSelect.value !== 'preset') {
            rawString = [...lengthSelect.value].join(' ');
        } else {
            rawString = patternSelect.value;
        }

        const tokens = String(rawString || '').trim().split(/[\s,]+/).filter(Boolean);
        if (!tokens.length) throw new Error('Choose a preset or enter a degree sequence first.');
        if (tokens.length > 64 || tokens.some(token => !/^\d+$/.test(token) || Number(token) < 1 || Number(token) > 64)) {
            throw new Error('Use 1 to 64 positive scale degrees in the pattern.');
        }
        const pattern = tokens.map(Number);
        const key = document.getElementById('key-select')?.value || 'C';
        const activeType = document.getElementById('pattern-type')?.value;
        const activePattern = document.getElementById('pattern-select')?.value;
        const scaleType = activeType === 'scale' && this.musicTheory.scales[activePattern] ? activePattern : 'major';
        const scaleNotes = this.musicTheory.getScaleNotes(key, scaleType);
        if (!scaleNotes.length) throw new Error('The selected key has no playable scale notes.');
        const start = Number(this.settings?.startFret ?? document.getElementById('start-fret')?.value ?? 0);
        const end = Number(this.settings?.endFret ?? document.getElementById('end-fret')?.value ?? 12);
        const maxNotes = Math.min(256, Math.max(8, (Math.max(start, end) - Math.min(start, end) + 1) * 4));
        let degrees = this.extrapolatePattern(pattern, scaleNotes.length, maxNotes);
        if (document.getElementById('melodic-pattern-reverse')?.checked) degrees.reverse();
        const tempoInput = document.getElementById('melodic-tempo');
        const bpm = Math.max(20, Math.min(300, Number(tempoInput?.value) || 120));
        if (tempoInput) tempoInput.value = String(bpm);
        return { key, scaleType, scaleNotes, degrees, bpm, signature: key + '|' + scaleType + '|' + tokens.join(',') };
    };

    App.prototype.playMelodicPattern = async function () {
        if (this.isPlayingPattern || this._melodicStarting || this._melodicStepStarting) return;
        const playButton = document.getElementById('play-melodic-pattern');
        const stopButton = document.getElementById('stop-melodic-pattern');
        const status = document.getElementById('melodic-pattern-status');
        const token = this._melodicToken = (this._melodicToken || 0) + 1;
        this._melodicStarting = true;
        if (playButton) playButton.disabled = true;
        try {
            const data = this.readMelodicPatternData();
            if (!this.synth && typeof this.initSynth === 'function') await this.initSynth();
            if (token !== this._melodicToken) return;
            if (!this.synth) throw new Error('Audio is unavailable. Check the browser audio setting and try again.');
            this._melodicState = data;
            this._melodicCursor = 0;
            this._melodicBeatDurationSec = 60 / data.bpm;
            this.isPlayingPattern = true;
            if (playButton) { playButton.disabled = false; playButton.style.display = 'none'; }
            if (stopButton) stopButton.style.display = 'inline-block';
            if (status) status.textContent = 'Playing ' + data.scaleType.replaceAll('_', ' ') + ' in ' + data.key + ' at ' + data.bpm + ' BPM.';

            const playNext = () => {
                if (token !== this._melodicToken || !this.isPlayingPattern) return;
                const degree = data.degrees[this._melodicCursor++ % data.degrees.length];
                const note = data.scaleNotes[degree % data.scaleNotes.length];
                const frequency = this.musicTheory.getNoteFrequency(note, 4 + Math.floor(degree / data.scaleNotes.length));
                try {
                    if (!frequency) throw new Error('A pattern degree is outside the playable note range.');
                    this.synth.triggerAttackRelease(frequency, Math.max(0.06, this._melodicBeatDurationSec * 0.55));
                    this.visualizeNotePlayback(data.key, note, this._melodicBeatDurationSec, 'melodic-pattern-anim', 'playing-pattern');
                    if (status) status.textContent = 'Playing note ' + (this._melodicCursor % data.degrees.length || data.degrees.length) + ' of ' + data.degrees.length + '.';
                } catch (error) {
                    this.stopMelodicPattern();
                    if (status) status.textContent = error.message || 'Could not play this note.';
                    return;
                }
                this.patternPlayer = setTimeout(playNext, Math.round(this._melodicBeatDurationSec * 1000));
            };
            playNext();
        } catch (error) {
            if (token === this._melodicToken) {
                this.isPlayingPattern = false;
                if (playButton) { playButton.disabled = false; playButton.style.display = 'inline-block'; }
                if (stopButton) stopButton.style.display = 'none';
                if (status) status.textContent = error.message || 'Could not start melodic playback.';
            }
        } finally {
            if (token === this._melodicToken) this._melodicStarting = false;
        }
    };

    App.prototype.extrapolatePattern = function (pattern, scaleLength, maxNotes) {
        if (!Array.isArray(pattern) || !pattern.length || !Number.isInteger(scaleLength) || scaleLength < 1) return [];
        const zeroBased = pattern.map(Number).map(degree => degree - 1);
        if (zeroBased.some(degree => !Number.isInteger(degree) || degree < 0)) return [];
        const limit = Math.max(1, Math.min(256, Number(maxNotes) || 1));
        const result = [];
        for (let cycle = 0; result.length < limit; cycle++) {
            for (const degree of zeroBased) {
                result.push(cycle + degree);
                if (result.length >= limit) break;
            }
        }
        return result;
    };

    App.prototype.stopMelodicPattern = function () {
        this._melodicToken = (this._melodicToken || 0) + 1;
        this._melodicStepToken = (this._melodicStepToken || 0) + 1;
        this._melodicStarting = false;
        this._melodicStepStarting = false;
        if (this.patternPlayer) clearTimeout(this.patternPlayer);
        this.patternPlayer = null;
        this.isPlayingPattern = false;
        try { if (this.synth && typeof this.synth.releaseAll === 'function') this.synth.releaseAll(Tone.now()); } catch (error) {}
        const playButton = document.getElementById('play-melodic-pattern');
        const stopButton = document.getElementById('stop-melodic-pattern');
        if (playButton) { playButton.disabled = false; playButton.style.display = 'inline-block'; }
        if (stopButton) stopButton.style.display = 'none';
    };

    App.prototype.visualizeNotePlayback = function(key, note, beatDurationSec, animSelectId, fallbackAnim) {
        try {
            const markers = Array.from(this.fretboard.container.querySelectorAll('.note-marker'));
            const interval = this.musicTheory.getInterval(key, note);
            const compare = this.fretboard.settings.displayMode === 'intervals' && interval
                ? this.musicTheory.intervals[interval]?.shortName || note
                : note;
            const matches = markers.filter(marker => marker.getAttribute('data-pitch') === note || marker.getAttribute('data-note') === compare || marker.getAttribute('data-note') === note);
            const anim = document.getElementById(animSelectId)?.value || fallbackAnim;
            matches.forEach(marker => {
                marker.classList.add(anim);
                setTimeout(() => marker.classList.remove(anim), Math.max(60, (beatDurationSec * 1000) / 2));
            });
        } catch (error) {}
    };

    App.prototype.stepMelodicPattern = async function () {
        if (this._melodicStepStarting) return;
        if (this.isPlayingPattern || this._melodicStarting) this.stopMelodicPattern();
        const token = this._melodicStepToken = (this._melodicStepToken || 0) + 1;
        const button = document.getElementById('step-melodic-pattern');
        const status = document.getElementById('melodic-pattern-status');
        this._melodicStepStarting = true;
        if (button) button.disabled = true;
        try {
            const data = this.readMelodicPatternData();
            if (!this.synth && typeof this.initSynth === 'function') await this.initSynth();
            if (token !== this._melodicStepToken) return;
            if (!this.synth) throw new Error('Audio is unavailable. Check the browser audio setting and try again.');
            if (!this._melodicStepState || this._melodicStepState.signature !== data.signature) {
                this._melodicStepState = { signature: data.signature, cursor: 0 };
            }
            const index = this._melodicStepState.cursor++ % data.degrees.length;
            const degree = data.degrees[index];
            const note = data.scaleNotes[degree % data.scaleNotes.length];
            const frequency = this.musicTheory.getNoteFrequency(note, 4 + Math.floor(degree / data.scaleNotes.length));
            if (!frequency) throw new Error('This degree is outside the playable note range.');
            const beatDurationSec = 60 / data.bpm;
            this.synth.triggerAttackRelease(frequency, Math.max(0.06, beatDurationSec * 0.55));
            this.visualizeNotePlayback(data.key, note, beatDurationSec, 'melodic-pattern-anim', 'playing-pattern');
            if (status) status.textContent = 'Step ' + (index + 1) + ' of ' + data.degrees.length + ': ' + note + '.';
        } catch (error) {
            if (status) status.textContent = error.message || 'Could not play this note.';
        } finally {
            if (token === this._melodicStepToken) {
                this._melodicStepStarting = false;
                if (button) button.disabled = false;
            }
        }
    };
}