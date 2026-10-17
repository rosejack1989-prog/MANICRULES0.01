class Fretboard {
    constructor(containerId, musicTheory) {
        this.container = document.getElementById(containerId);
        this.musicTheory = musicTheory;
        this.svg = null;
        
        this.dimensions = {
            width: 1000,
            height: 250,
            margin: { top: 30, right: 30, bottom: 40, left: 100 },
            fretSpacing: 80,
            stringSpacing: 30
        };
        
        this.settings = {
            tuning: ['E', 'A', 'D', 'G', 'B', 'E'],
            startFret: 0,
            endFret: 12,
            stringHeight: 2,
            fretWidth: 2,
            displayMode: 'intervals',
            colorTheme: 'default_ii',
            customColors: {},
            fretNumbersPlacement: 'below',
            fretNumbersPosition: 'center',
            fretNumbersSize: 12,
            fretNumbersOffset: 0,
            fretNumbersShape: 'none',
            fretMarkersPlacement: 'on',
            fretMarkersOffset: 0,
            noteSize: 15,
            noteShape: 'circle',
            noteFont: 'Arial Narrow',
            noteFontSize: 12,
            noteEffect: 'none',
            noteGradient: false,
            noteOffset: 0,
            stringStyle: 'solid',
            stringGradient: false,
            stringEffect: 'none',
            stringSpacing: 30,
            stringOpacity: 1,
            visibleStrings: [],
            stringStartFrets: [],
            stringEndFrets: [],
            fretStyle: 'solid'
        };
        
        this.currentKey = 'C';
        this.currentPatternType = 'scale';
        this.currentPattern = 'major';
        this.activeNotes = [];
        this.activePositions = [];
        this.selectedMarkers = [];
        
        this.resizeTimeout = null;
        this.lastContainerWidth = this.container ? this.container.clientWidth : 0;
        this.queueResponsiveDraw = () => {
            if (this.resizeTimeout) clearTimeout(this.resizeTimeout);
            this.resizeTimeout = window.setTimeout(() => {
                this.resizeTimeout = null;
                if (this.draw) this.draw();
            }, 120);
        };
        window.addEventListener('resize', this.queueResponsiveDraw, { passive: true });
        if (this.container && typeof ResizeObserver !== 'undefined') {
            this.resizeObserver = new ResizeObserver(entries => {
                const width = Math.round(entries[0].contentRect.width);
                if (width === this.lastContainerWidth) return;
                this.lastContainerWidth = width;
                this.queueResponsiveDraw();
            });
            this.resizeObserver.observe(this.container);
        }
    }

    updateSettings(newSettings) {
        if (!newSettings) return;
        this.settings = { ...this.settings, ...newSettings };
        
        // Synchronize mismatched naming between UI and logic
        if (this.settings.fretThickness !== undefined) this.settings.fretWidth = this.settings.fretThickness;
        if (this.settings.stringThickness !== undefined) this.settings.stringHeight = this.settings.stringThickness;

        if (this.settings.stringSpacing && this.dimensions) {
            this.dimensions.stringSpacing = this.settings.stringSpacing;
        }
        if (this.draw) this.draw();
    }

    updatePattern(key, patternType, pattern) {
        this.currentKey = key;
        this.currentPatternType = patternType;
        this.currentPattern = pattern;
        this.activePositions = [];
        
        if (patternType === 'scale') {
            this.activeNotes = this.musicTheory.getScaleNotes(key, pattern);
        } else if (patternType === 'chord') {
            this.activeNotes = this.musicTheory.getChordNotes(key, pattern);
        } else if (patternType === 'interval') {
            const targetNote = this.musicTheory.getNoteFromInterval(key, pattern);
            this.activeNotes = [key, targetNote];
        } else if (patternType === 'custom') {
            this.activeNotes = this.musicTheory.getCustomNotes(key, pattern);
        } else if (patternType === 'gamut') {
            const gamutData = this.musicTheory.gamuts && this.musicTheory.gamuts[pattern];
            if (gamutData) {
                this.activePositions = gamutData.positions;
            }
            this.activeNotes = [];
        } else {
            this.activeNotes = [];
        }
        
        if (this.draw) this.draw();
    }

    clearSelectedMarkers() {
        this.selectedMarkers.forEach(mg => {
            mg.classList.remove('selected');
            const marker = mg.querySelector('.note-marker');
            if (marker) {
                marker.setAttribute('stroke', '#000');
                marker.setAttribute('stroke-width', 1);
            }
        });
        this.selectedMarkers = [];
    }

    getCurrentInfo() {
        return {
            tuning: this.settings.tuning.join('-'),
            key: this.currentKey,
            patternType: this.currentPatternType,
            pattern: this.currentPattern
        };
    }

    /**
     * Download the current diagram. The format follows the filename extension (.png or .jpg).
     * v1.0: passes musicTheory so "include info" no longer hangs, appends the link to the DOM
     * (required by Firefox), and sanitises filenames ('#' and '/' broke some downloads).
     */
    async exportImage(filename) {
        let name = filename || 'fretboard.jpg';
        const isPng = /\.png$/i.test(name);
        if (!/\.(png|jpe?g)$/i.test(name)) name += '.jpg';
        const mime = isPng ? 'image/png' : 'image/jpeg';
        name = name.replace(/#/g, 'sharp').replace(/[\\/:*?"<>|]+/g, '_');
        let dataUrl;
        try {
            if (typeof Exporter !== 'undefined' && Exporter.getFretboardImageBase64) {
                const base64 = await Exporter.getFretboardImageBase64({ fretboard: this, musicTheory: this.musicTheory }, { mime, scale: isPng ? 2 : 1 });
                dataUrl = 'data:' + mime + ';base64,' + base64;
            } else if (typeof html2canvas !== 'undefined') {
                const canvas = await html2canvas(this.container);
                dataUrl = canvas.toDataURL(mime);
            } else {
                alert('Image export is unavailable in this browser.');
                return;
            }
        } catch (err) {
            console.error('Image export failed', err);
            alert('Image export failed: ' + (err && err.message ? err.message : err));
            return;
        }
        if (window.ST && ST.download) { ST.download(dataUrl, name); return; }
        const link = document.createElement('a');
        link.download = name;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    getThemeColors() {
        const theme = this.settings?.colorTheme || 'default_ii';
        const defaultColors = {
            background: '#FFFFFF',
            strings: '#888888',
            frets: '#444444',
            markers: '#333333',
            intervals: {}
        };

        let resultColors;
        if (theme === 'custom' && this.settings?.customColors) {
            resultColors = {
                background: this.settings.customColors.background || defaultColors.background,
                strings: this.settings.customColors.strings || defaultColors.strings,
                frets: this.settings.customColors.frets || defaultColors.frets,
                markers: this.settings.customColors.markers || defaultColors.markers,
                intervals: this.settings.customColors.intervals || defaultColors.intervals
            };
        } else {
            const palette = (this.musicTheory?.colorThemes?.[theme]) || (this.musicTheory?.colorThemes?.default) || defaultColors;
            resultColors = { ...defaultColors, ...palette };
        }

        if (this.settings?.forceWhiteBackground) {
            resultColors.background = '#FFFFFF';
        }
        const grayscale = color => {
            const match = String(color || '').match(/^#([0-9a-f]{6})$/i);
            if (!match) return color;
            const hex = match[1];
            const level = Math.round(parseInt(hex.slice(0, 2), 16) * .2126 + parseInt(hex.slice(2, 4), 16) * .7152 + parseInt(hex.slice(4, 6), 16) * .0722);
            return '#' + level.toString(16).padStart(2, '0').repeat(3);
        };
        resultColors.background = grayscale(resultColors.background);
        resultColors.strings = grayscale(resultColors.strings);
        resultColors.frets = grayscale(resultColors.frets);
        resultColors.markers = grayscale(resultColors.markers);
        resultColors.intervals = Object.fromEntries(Object.entries(resultColors.intervals || {}).map(([interval, color]) => [interval, grayscale(color)]));
        Object.entries(this.musicTheory?.intervals || {}).forEach(([interval, data]) => {
            if (!resultColors.intervals[interval]) resultColors.intervals[interval] = grayscale(data.color || '#666666');
        });

        return resultColors;
    }

    debouncedRedrawNotes() {
        if (this.redrawTimeout) clearTimeout(this.redrawTimeout);
        this.redrawTimeout = setTimeout(() => this.drawNotes && this.drawNotes(), 50);
    }

    lightenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const B = (num >> 8 & 0x00FF) + amt;
        const G = (num & 0x0000FF) + amt;
        return '#' + (
            0x1000000 + 
            (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + 
            (B < 255 ? B < 1 ? 0 : B : 255) * 0x100 + 
            (G < 255 ? G < 1 ? 0 : G : 255)
        ).toString(16).slice(1);
    }

    applyGlowEffect(element, color) {
        const filterId = 'glow-' + Math.random().toString(36).substr(2, 9);
        const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
        filter.setAttribute('id', filterId);
        filter.innerHTML = `
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
            <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
        `;
        let defs = this.svg.querySelector('defs');
        if (!defs) {
            defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
            this.svg.prepend(defs);
        }
        defs.appendChild(filter);
        element.setAttribute('filter', `url(#${filterId})`);
    }

    applyShadowEffect(element) {
        const filterId = 'shadow-' + Math.random().toString(36).substr(2, 9);
        const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
        filter.setAttribute('id', filterId);
        filter.innerHTML = `
            <feDropShadow dx="2" dy="2" stdDeviation="2" flood-opacity="0.5"/>
        `;
        let defs = this.svg.querySelector('defs');
        if (!defs) {
            defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
            this.svg.prepend(defs);
        }
        defs.appendChild(filter);
        element.setAttribute('filter', `url(#${filterId})`);
    }

    applyMetallicEffect(element, y, x1, x2, color) {
        element.setAttribute('stroke', color);
    }

    getProperNoteSpelling(note, key, patternType, pattern) {
        let expectedNotes = [];
        if (patternType === 'scale') {
            expectedNotes = this.musicTheory.getScaleNotes(key, pattern);
        } else if (patternType === 'chord') {
            expectedNotes = this.musicTheory.getChordNotes(key, pattern);
        } else if (patternType === 'interval') {
            let degree = 1;
            if (pattern.includes('2')) degree = 2;
            else if (pattern.includes('3')) degree = 3;
            else if (pattern.includes('4')) degree = 4;
            else if (pattern.includes('5')) degree = 5;
            else if (pattern.includes('6')) degree = 6;
            else if (pattern.includes('7')) degree = 7;
            
            let expectedLetter = this.musicTheory.getExpectedNoteForDegree(key, degree)[0];
            if (note[0] === expectedLetter) return note;
            const enharmonic = this.musicTheory.enharmonicPairs[note];
            if (enharmonic && enharmonic[0] === expectedLetter) return enharmonic;
            return note;
        } else {
            return note;
        }

        if (expectedNotes.includes(note)) return note;
        const enharmonic = this.musicTheory.enharmonicPairs[note];
        if (enharmonic && expectedNotes.includes(enharmonic)) return enharmonic;
        return note;
    }
    
    getContrastColor(hexColor) {
        const hex = hexColor.replace(/^#/, '');
        let r, g, b;
        if (hex.length === 3) {
            r = parseInt(hex[0] + hex[0], 16);
            g = parseInt(hex[1] + hex[1], 16);
            b = parseInt(hex[2] + hex[2], 16);
        } else {
            r = parseInt(hex.substring(0, 2), 16);
            g = parseInt(hex.substring(2, 4), 16);
            b = parseInt(hex.substring(4, 6), 16);
        }
        if (isNaN(r) || isNaN(g) || isNaN(b)) return '#000000';
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 125 ? '#000000' : '#FFFFFF';
    }
    
    showNoteEditMenu(markerGroup, marker, text, x, y, color) {
        if (typeof FretboardMenu !== 'undefined') {
            FretboardMenu.showNoteEditMenu(this, markerGroup, marker, text, x, y, color);
        }
    }
    
    showMultiNoteEditMenu(markerGroups, x, y) {
        if (typeof FretboardMenu !== 'undefined') {
            FretboardMenu.showMultiNoteEditMenu(this, markerGroups, x, y);
        }
    }
}