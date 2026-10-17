/**
 * Media Integration Extension for App
 */
if (typeof App !== 'undefined') {
    App.prototype.addPianoControls = function() {
        const mainContent = document.querySelector('.main-content');
        const fretboardContainer = document.querySelector('.fretboard-container');
        
        const pianoContainer = document.createElement('div');
        pianoContainer.className = 'piano-container';
        pianoContainer.style.margin = '20px 0';
        pianoContainer.style.display = 'none';
        
        if (typeof this.createPianoKeyboard === 'function') {
            pianoContainer.appendChild(this.createPianoKeyboard());
        }
        mainContent.insertBefore(pianoContainer, fretboardContainer);
        
        const sidebar = document.querySelector('.sidebar');
        
        const pianoToggleWrapper = document.createElement('div');
        pianoToggleWrapper.className = 'control-group';
        pianoToggleWrapper.style.display = 'flex';
        pianoToggleWrapper.style.alignItems = 'center';
        pianoToggleWrapper.style.gap = '10px';
        pianoToggleWrapper.style.margin = '0';
        
        pianoToggleWrapper.innerHTML = `
            <div style="display:flex;align-items:center;gap:8px;" title="Toggle Piano">
                <input type="checkbox" id="piano-toggle" style="display:none;">
                <label for="piano-toggle" id="piano-toggle-icon" style="margin:0; width:28px; height:28px; display:flex; align-items:center; justify-content:center; border-radius:4px; cursor:pointer; font-weight:bold; user-select:none; font-size:14px; border:1px solid var(--border-color); transition:all 0.2s;">
                    🎹
                </label>
            </div>
        `;
        
        const pianoCheckbox = pianoToggleWrapper.querySelector('#piano-toggle');
        pianoCheckbox.addEventListener('click', (e) => {
            // Triggered on click
        });
        pianoCheckbox.addEventListener('change', (e) => {
            const isVisible = e.target.checked;
            pianoContainer.style.display = isVisible ? 'block' : 'none';
            if (isVisible && typeof this.updatePianoHighlights === 'function') {
                this.updatePianoHighlights();
            }
        });

        const bottomControls = document.getElementById('controls-bottom');
        if (bottomControls) {
            bottomControls.insertBefore(pianoToggleWrapper, bottomControls.firstChild);
        } else {
            sidebar.appendChild(pianoToggleWrapper);
        }
    };

    App.prototype.getContrastColor = function(hexColor) {
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
    };

}