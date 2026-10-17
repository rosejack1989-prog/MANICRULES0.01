/**
 * Fretboard Drawing Methods
 * Extends the Fretboard prototype with drawing capabilities
 */
if (typeof Fretboard !== 'undefined') {

    Fretboard.prototype.draw = function() {
        if (!this.container || !this.settings || !this.dimensions) return;

        // Keep the player's position on longer necks when controls trigger a redraw.
        const scrollLeft = this.container.scrollLeft;
        this.container.replaceChildren();
        
        // Update dimensions based on number of strings and frets
        const stringCount = this.settings.tuning ? this.settings.tuning.length : 6;
        const fretCount = this.settings.endFret - this.settings.startFret;
        
        // Adjust fret spacing and string spacing based on viewport width for responsive design
        const viewportWidth = this.container.clientWidth || window.innerWidth;
        if (viewportWidth < 600) {
            this.dimensions.fretSpacing = 40;
            this.dimensions.stringSpacing = 20;
            this.dimensions.margin.left = 60; // Ensure enough space for open strings and labels
        } else {
            this.dimensions.fretSpacing = 80;
            this.dimensions.stringSpacing = 30;
            this.dimensions.margin.left = 100; // Ensure enough space for open strings and labels
        }
        
        this.dimensions.height = Math.max(150, stringCount * this.dimensions.stringSpacing + this.dimensions.margin.top + this.dimensions.margin.bottom);
        this.dimensions.width = Math.max(100, fretCount * this.dimensions.fretSpacing + this.dimensions.margin.left + this.dimensions.margin.right);
        
        // Create SVG element
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svg.setAttribute('class', 'fretboard-svg');
        this.svg.setAttribute('viewBox', `0 0 ${this.dimensions.width} ${this.dimensions.height}`);
        this.svg.setAttribute('width', '100%');
        this.svg.setAttribute("role", "group");
        const patternData = this.musicTheory[this.currentPatternType] && this.musicTheory[this.currentPatternType][this.currentPattern];
        const patternName = patternData && patternData.name ? patternData.name : this.currentPattern;
        const description = "Strings from lowest to highest: " + (this.settings.tuning || []).join(", ") + ". Frets " + this.settings.startFret + " through " + this.settings.endFret + ". Use arrow keys to move between highlighted notes.";
        this.svg.setAttribute("aria-label", this.currentKey + " " + patternName + " fretboard");
        const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
        title.textContent = this.currentKey + " " + patternName + " fretboard";
        const desc = document.createElementNS("http://www.w3.org/2000/svg", "desc");
        desc.textContent = description;
        this.svg.append(title, desc);
        this.container.appendChild(this.svg);
        
        // Scrolling only changes the viewport; the SVG notes are already rendered.
        this.drawFretboard();
        this.drawNotes();
        this.container.scrollLeft = scrollLeft;
    };

    // removed Fretboard.prototype.drawFretboard() -> moved to fretboard-draw-grid.js
    // removed Fretboard.prototype.drawFretMarker() -> moved to fretboard-draw-grid.js
    // removed Fretboard.prototype.drawNotes() -> moved to fretboard-draw-notes.js
    // removed Fretboard.prototype.drawNoteMarker() -> moved to fretboard-draw-notes.js
}