<!-- Panneau latéral avec animation slide -->
<div id="custom-color-panel" style="display: none; position: fixed; width: 220px; background: white; box-shadow: -4px 0 12px rgba(0,0,0,0.1); border-radius: 4px; z-index: 99999;">
  
  <!-- Header avec nom et icônes -->
  <div style="padding: 5px 10px; border-bottom: 1px solid #D9D9D9; display: flex; justify-content: space-between; align-items: center;">
    <input type="text" id="color-name-input" placeholder="Name (optional)" style="padding: 6px; background: #F5F5F5; border: none; border-radius: 4px; font-size: 12px; font-family: 'JetBrains Mono', monospace; font-weight: 400; outline: none; flex: 1; max-width: 130px; color: #1E1E1E;" maxlength="30" />
    
    <div style="width: 80px; height: 30px; display: flex; justify-content: flex-end; align-items: center; gap: 6px;">
      <button id="save-color-btn" class="color-picker-icon-btn" style="width: 30px; height: 30px; padding: 0; border: none; background: transparent; cursor: pointer; display: flex; align-items: center; justify-content: center; border-radius: 4px; transition: background 0.2s;">
        <svg width="17" height="17" fill="#1E1E1E" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
        </svg>
      </button>
      
      <button id="cancel-color-btn" class="color-picker-icon-btn" style="width: 30px; height: 30px; padding: 0; border: none; background: transparent; cursor: pointer; display: flex; align-items: center; justify-content: center; border-radius: 4px; transition: background 0.2s;">
        <svg width="17" height="17" fill="#1E1E1E" viewBox="0 0 16 16">
          <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
        </svg>
      </button>
    </div>
  </div>
  
  <div style="padding: 10px; display: flex; flex-direction: column; gap: 12px;">
    
    <!-- ✅ Carré gradient avec curseur blanc simple -->
    <div style="position: relative; width: 200px; height: 200px; border-radius: 4px; border: 1px solid #D9D9D9; cursor: crosshair;" id="color-gradient-box">
      <canvas id="color-canvas" width="200" height="200" style="border-radius: 4px; display: block;"></canvas>
      <!-- ✅ Curseur cercle creux blanc 16px comme les sliders -->
      <div id="color-cursor" style="position: absolute; width: 16px; height: 16px; background: transparent; border: 3px solid white; border-radius: 50%; box-shadow: 0 1px 3px rgba(0,0,0,0.3); pointer-events: none; transform: translate(-50%, -50%); box-sizing: border-box;"></div>
    </div>
    
    <div style="display: flex; gap: 10px; align-items: center;">
      <!-- ✅ Bouton pipette 30x30px avec hover, icône noire -->
      <button id="eyedropper-btn" style="width: 30px; height: 30px; padding: 0; border: none; background: transparent; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; border-radius: 4px; transition: background 0.2s;">
        <svg width="18" height="18" fill="#1E1E1E" viewBox="0 0 16 16">
          <path d="M13.354.646a1.207 1.207 0 0 0-1.708 0L8.5 3.793l-.646-.647a.5.5 0 1 0-.708.708L8.293 5l-7.147 7.146A.5.5 0 0 0 1 12.5v1.793l-.854.853a.5.5 0 1 0 .708.707L1.707 15H3.5a.5.5 0 0 0 .354-.146L11 7.707l1.146 1.147a.5.5 0 0 0 .708-.708l-.647-.646 3.147-3.146a1.207 1.207 0 0 0 0-1.708zM2 12.707l7-7L10.293 7l-7 7H2z"/>
        </svg>
      </button>
      
      <div style="width: 160px; display: flex; flex-direction: column; gap: 6px;">
        <!-- ✅ Barre HUE avec curseur cercle blanc 16px -->
        <div style="position: relative; height: 16px; border-radius: 8px; cursor: pointer; background: linear-gradient(90deg, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%);" id="hue-bar">
          <div id="hue-cursor" style="position: absolute; top: 0; width: 16px; height: 16px; background: transparent; border: 3px solid white; border-radius: 50%; transform: translateX(-50%); pointer-events: none; box-shadow: 0 1px 3px rgba(0,0,0,0.3); box-sizing: border-box;"></div>
        </div>
        
        <!-- ✅ Barre OPACITÉ avec curseur cercle blanc 16px -->
        <div style="position: relative; height: 16px; border-radius: 8px; border: 1px solid #D9D9D9; cursor: pointer; background-color: #E5E7EB; background-image: linear-gradient(45deg, #fff 25%, transparent 25%), linear-gradient(-45deg, #fff 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #fff 75%), linear-gradient(-45deg, transparent 75%, #fff 75%); background-size: 10px 10px; background-position: 0 0, 0 5px, 5px -5px, -5px 0px;" id="opacity-bar-bg">
          <div id="opacity-bar" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; border-radius: 8px; background: linear-gradient(90deg, transparent 0%, #FF0000 100%);"></div>
          <div id="opacity-cursor" style="position: absolute; top: 0; width: 16px; height: 16px; background: transparent; border: 3px solid white; border-radius: 50%; transform: translateX(-50%); pointer-events: none; box-shadow: 0 1px 3px rgba(0,0,0,0.3); box-sizing: border-box;"></div>
        </div>
      </div>
    </div>
    
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <div style="padding: 3px 6px; border-radius: 4px; border: 1px solid #D9D9D9; cursor: pointer; display: flex; align-items: center; gap: 4px;">
        <div style="padding: 2px; display: flex; align-items: center;">
          <span style="color: #1E1E1E; font-size: 12px; font-family: 'JetBrains Mono', monospace; font-weight: 300;">Hex</span>
        </div>
        <div style="width: 12px; height: 12px; position: relative; overflow: hidden;">
          <div style="width: 6px; height: 3.7px; position: absolute; left: 3px; top: 4px; background: #1E1E1E;"></div>
        </div>
      </div>
      
      <div style="display: flex; align-items: center; gap: 1px; border-radius: 4px;">
        <div style="display: flex; padding: 2px 12px 2px 8px; justify-content: center; align-items: center; gap: 10px; border-radius: 4px 0 0 4px; background: #F5F5F5;">
          <input type="text" id="hex-input" value="FFFFFF" maxlength="6" style="width: 48px; background: transparent; border: none; color: #1E1E1E; font-size: 12px; font-family: 'JetBrains Mono', monospace; font-weight: 300; outline: none;" />
        </div>
        
        <div style="display: flex; padding: 0 6px; align-items: center; gap: 4px; border-radius: 0 4px 4px 0; background: #F5F5F5;">
          <div style="padding: 2px; display: flex; justify-content: center; align-items: center; gap: 10px;">
            <input type="number" id="opacity-input" value="100" min="0" max="100" style="width: 24px; background: transparent; border: none; color: #1E1E1E; font-size: 12px; font-family: 'JetBrains Mono', monospace; font-weight: 300; outline: none; text-align: right;" />
          </div>
          <div style="padding: 2px; display: flex; justify-content: center; align-items: center; gap: 10px;">
            <span style="color: #757575; font-size: 12px; font-family: 'JetBrains Mono', monospace; font-weight: 400;">%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  #opacity-input::-webkit-outer-spin-button,
  #opacity-input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  #opacity-input[type=number] {
    -moz-appearance: textfield;
  }
  
  /* Animation latérale avec effet Bubble Group Focus */
  #custom-color-panel {
    opacity: 0;
    transform: translateX(10px);
    transition: opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1), 
                transform 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
  }
  
  #custom-color-panel.open {
    opacity: 1 !important;
    transform: translateX(0) !important;
  }
  
  #color-name-input::placeholder {
    color: #1E1E1E;
    opacity: 0.6;
  }
  
  .color-picker-icon-btn:hover {
    background: #EDF0F3 !important;
  }
  
  /* ✅ Hover du bouton pipette */
  #eyedropper-btn:hover {
    background: #EDF0F3 !important;
  }
  
  /* Hover du bouton + */
  #add-custom-color-btn:hover {
    background: #F5F5F5 !important;
  }
  
  /* Hover des couleurs custom */
  .custom-color-swatch-container:hover {
    background: #F5F5F5 !important;
  }
  
  /* Hover de toutes les couleurs de la palette */
  .color-swatch-container:hover {
    background: #F5F5F5 !important;
  }
  
  /* État sélectionné */
  .color-swatch-container.selected,
  .custom-color-swatch-container.selected {
    border-color: #4F46E5 !important;
    background: #F5F5F5 !important;
  }
</style>

<script>
(function() {
  console.log('[ColorPicker] Script loaded');
  
  setTimeout(init, 500);
  
  function init() {
    console.log('[ColorPicker] Initializing...');
    
    const STORAGE_KEY = 'mapflow_custom_colors';
    
    let currentHue = 0;
    let currentSaturation = 100;
    let currentLightness = 50;
    let currentOpacity = 100;
    
    const canvas = document.getElementById('color-canvas');
    const ctx = canvas ? canvas.getContext('2d') : null;
    const colorBox = document.getElementById('color-gradient-box');
    const colorCursor = document.getElementById('color-cursor');
    const hueBar = document.getElementById('hue-bar');
    const hueCursor = document.getElementById('hue-cursor');
    const opacityBar = document.getElementById('opacity-bar');
    const opacityBarBg = document.getElementById('opacity-bar-bg');
    const opacityCursor = document.getElementById('opacity-cursor');
    const hexInput = document.getElementById('hex-input');
    const opacityInput = document.getElementById('opacity-input');
    const colorNameInput = document.getElementById('color-name-input');
    const panel = document.getElementById('custom-color-panel');
    const customColorsBar = document.getElementById('custom-colors-bar');
    const addBtn = document.getElementById('add-custom-color-btn');
    const cancelBtn = document.getElementById('cancel-color-btn');
    const saveBtn = document.getElementById('save-color-btn');
    
    console.log('[ColorPicker] Elements:', {
      panel: !!panel,
      addBtn: !!addBtn,
      customColorsBar: !!customColorsBar,
      addBtnType: addBtn ? addBtn.tagName : 'null'
    });
    
    if (!panel || !addBtn || !customColorsBar) {
      console.error('[ColorPicker] Missing elements');
      return;
    }
    
    console.log('[ColorPicker] All elements found ✓');
    
    panel.addEventListener('click', function(e) {
      e.stopPropagation();
    });
    
    panel.addEventListener('mousedown', function(e) {
      e.stopPropagation();
    });
    
    function drawColorGradient() {
      if (!ctx) return;
      const gradientH = ctx.createLinearGradient(0, 0, 200, 0);
      gradientH.addColorStop(0, 'white');
      gradientH.addColorStop(1, `hsl(${currentHue}, 100%, 50%)`);
      ctx.fillStyle = gradientH;
      ctx.fillRect(0, 0, 200, 200);
      
      const gradientV = ctx.createLinearGradient(0, 0, 0, 200);
      gradientV.addColorStop(0, 'rgba(0, 0, 0, 0)');
      gradientV.addColorStop(1, 'rgba(0, 0, 0, 1)');
      ctx.fillStyle = gradientV;
      ctx.fillRect(0, 0, 200, 200);
    }
    
    function hslToHex(h, s, l) {
      s /= 100;
      l /= 100;
      const c = (1 - Math.abs(2 * l - 1)) * s;
      const x = c * (1 - Math.abs((h / 60) % 2 - 1));
      const m = l - c / 2;
      let r, g, b;
      
      if (h < 60) { r = c; g = x; b = 0; }
      else if (h < 120) { r = x; g = c; b = 0; }
      else if (h < 180) { r = 0; g = c; b = x; }
      else if (h < 240) { r = 0; g = x; b = c; }
      else if (h < 300) { r = x; g = 0; b = c; }
      else { r = c; g = 0; b = x; }
      
      r = Math.round((r + m) * 255).toString(16).padStart(2, '0');
      g = Math.round((g + m) * 255).toString(16).padStart(2, '0');
      b = Math.round((b + m) * 255).toString(16).padStart(2, '0');
      
      return `#${r}${g}${b}`.toUpperCase();
    }
    
    function updateColor() {
      if (!hexInput || !opacityInput || !opacityBar) return;
      const hex = hslToHex(currentHue, currentSaturation, currentLightness);
      hexInput.value = hex.substring(1);
      opacityInput.value = currentOpacity;
      
      const color = `hsl(${currentHue}, ${currentSaturation}%, ${currentLightness}%)`;
      opacityBar.style.background = `linear-gradient(90deg, transparent 0%, ${color} 100%)`;
    }
    
    if (colorBox && colorCursor) {
      colorBox.addEventListener('mousedown', function(e) {
        function handleMove(e) {
          const rect = colorBox.getBoundingClientRect();
          let x = e.clientX - rect.left;
          let y = e.clientY - rect.top;
          x = Math.max(0, Math.min(200, x));
          y = Math.max(0, Math.min(200, y));
          
          currentSaturation = (x / 200) * 100;
          currentLightness = 100 - (y / 200) * 100;
          
          colorCursor.style.left = x + 'px';
          colorCursor.style.top = y + 'px';
          
          updateColor();
        }
        
        handleMove(e);
        document.addEventListener('mousemove', handleMove);
        document.addEventListener('mouseup', () => document.removeEventListener('mousemove', handleMove), { once: true });
      });
    }
    
    if (hueBar && hueCursor) {
      hueBar.addEventListener('mousedown', function(e) {
        function handleMove(e) {
          const rect = hueBar.getBoundingClientRect();
          let x = e.clientX - rect.left;
          x = Math.max(0, Math.min(rect.width, x));
          
          currentHue = (x / rect.width) * 360;
          hueCursor.style.left = x + 'px';
          
          drawColorGradient();
          updateColor();
        }
        
        handleMove(e);
        document.addEventListener('mousemove', handleMove);
        document.addEventListener('mouseup', () => document.removeEventListener('mousemove', handleMove), { once: true });
      });
    }
    
    if (opacityBarBg && opacityCursor) {
      opacityBarBg.addEventListener('mousedown', function(e) {
        function handleMove(e) {
          const rect = opacityBarBg.getBoundingClientRect();
          let x = e.clientX - rect.left;
          x = Math.max(0, Math.min(rect.width, x));
          
          currentOpacity = Math.round((x / rect.width) * 100);
          opacityCursor.style.left = x + 'px';
          
          updateColor();
        }
        
        handleMove(e);
        document.addEventListener('mousemove', handleMove);
        document.addEventListener('mouseup', () => document.removeEventListener('mousemove', handleMove), { once: true });
      });
    }
    
    if (hexInput && hueBar && hueCursor && colorCursor) {
      hexInput.addEventListener('input', function() {
        const hex = this.value.toUpperCase();
        if (/^[0-9A-F]{6}$/.test(hex)) {
          const r = parseInt(hex.substr(0, 2), 16) / 255;
          const g = parseInt(hex.substr(2, 2), 16) / 255;
          const b = parseInt(hex.substr(4, 2), 16) / 255;
          
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const l = (max + min) / 2;
          
          let h, s;
          if (max === min) {
            h = s = 0;
          } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            
            if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
            else if (max === g) h = ((b - r) / d + 2) / 6;
            else h = ((r - g) / d + 4) / 6;
          }
          
          currentHue = Math.round(h * 360);
          currentSaturation = Math.round(s * 100);
          currentLightness = Math.round(l * 100);
          
          drawColorGradient();
          updateColor();
          
          hueCursor.style.left = (currentHue / 360 * hueBar.offsetWidth) + 'px';
          colorCursor.style.left = (currentSaturation / 100 * 200) + 'px';
          colorCursor.style.top = ((100 - currentLightness) / 100 * 200) + 'px';
        }
      });
    }
    
    if (opacityInput && opacityCursor && opacityBarBg) {
      opacityInput.addEventListener('input', function() {
        currentOpacity = Math.max(0, Math.min(100, parseInt(this.value) || 0));
        opacityCursor.style.left = (currentOpacity / 100 * opacityBarBg.offsetWidth) + 'px';
      });
    }
    
    console.log('[ColorPicker] Attaching click to:', addBtn);
    addBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('[ColorPicker] ===== CLICKED =====');
      
      // Toggle : si déjà ouvert, fermer
      if (panel.classList.contains('open')) {
        console.log('[ColorPicker] Closing (toggle)');
        panel.classList.remove('open');
        setTimeout(() => {
          panel.style.display = 'none';
        }, 200);
        return;
      }
      
      // Sinon, ouvrir
      console.log('[ColorPicker] Opening');
      
      // Trouver le Group Focus (menu fill color)
      const fillColorMenu = addBtn.closest('[class*="GroupFocus"]') || 
                            addBtn.closest('[class*="bubble-r-container"]');
      
      console.log('[ColorPicker] Found menu:', !!fillColorMenu);
      
      if (fillColorMenu) {
        const rect = fillColorMenu.getBoundingClientRect();
        
        console.log('[ColorPicker] Menu position:', {
          top: rect.top,
          right: rect.right,
          height: rect.height
        });
        
        // Positionner à droite du menu, EXACTEMENT au même niveau vertical
        panel.style.left = (rect.right + 6) + 'px';
        panel.style.top = rect.top + 'px';
        panel.style.right = 'auto';
        panel.style.bottom = 'auto';
      } else {
        console.warn('[ColorPicker] Menu parent not found, using fallback');
        const btnRect = addBtn.getBoundingClientRect();
        panel.style.left = (btnRect.right + 6) + 'px';
        panel.style.top = btnRect.top + 'px';
      }
      
      panel.style.display = 'block';
      
      console.log('[ColorPicker] Panel positioned at:', {
        left: panel.style.left,
        top: panel.style.top
      });
      
      requestAnimationFrame(() => {
        panel.classList.add('open');
      });
      
      drawColorGradient();
      updateColor();
    });

    const eyedropperBtn = document.getElementById('eyedropper-btn');
    if (eyedropperBtn && window.EyeDropper) {
      eyedropperBtn.addEventListener('click', async function(e) {
        e.stopPropagation();
        
        try {
          const eyeDropper = new EyeDropper();
          const result = await eyeDropper.open();
          
          if (hexInput) {
            hexInput.value = result.sRGBHex.substring(1).toUpperCase();
            hexInput.dispatchEvent(new Event('input'));
          }
        } catch (error) {
          console.log('[ColorPicker] Eyedropper cancelled');
        }
      });
    }
    
    if (cancelBtn) {
      cancelBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        panel.classList.remove('open');
        setTimeout(() => panel.style.display = 'none', 200);
      });
    }
    
    if (saveBtn) {
      saveBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        
        const hex = hexInput ? '#' + hexInput.value : '#FFFFFF';
        const name = colorNameInput ? (colorNameInput.value.trim() || hex) : hex;
        const opacity = currentOpacity;
        
        const colors = getCustomColors();
        colors.push({ hex, name, opacity });
        saveCustomColors(colors);
        
        if (colorNameInput) colorNameInput.value = '';
        
        panel.classList.remove('open');
        setTimeout(() => panel.style.display = 'none', 200);
        
        const indicator = document.getElementById('fill-color-indicator');
        if (indicator) indicator.style.backgroundColor = hex;
        
        if (window.mapFunctions && window.mapFunctions.applyColorToSelected) {
          window.mapFunctions.applyColorToSelected(hex);
        }
      });
    }
    
    function getCustomColors() {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    }
    
    function saveCustomColors(colors) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(colors));
      renderCustomColors();
    }
    
    function renderCustomColors() {
      if (!customColorsBar) return;
      const colors = getCustomColors();
      console.log('[ColorPicker] Rendering', colors.length, 'colors');
      customColorsBar.innerHTML = '';
      
      colors.forEach((color, index) => {
        const container = document.createElement('div');
        container.className = 'custom-color-swatch-container';
        container.style.cssText = `
          width: 30px; height: 30px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          border-radius: 6px;
          border: 2px solid transparent;
          transition: border-color 0.2s, background 0.2s;
          box-sizing: border-box;
          position: relative;
        `;
        
        const swatch = document.createElement('div');
        swatch.style.cssText = `
          width: 24px; height: 24px; border-radius: 4px;
          background: ${color.hex};
          border: 1px solid rgba(0,0,0,0.1);
          opacity: ${color.opacity / 100};
        `;
        swatch.title = color.name;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '×';
        deleteBtn.style.cssText = `
          position: absolute;
          top: -4px;
          right: -4px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #EF4444;
          color: white;
          border: 2px solid white;
          font-size: 12px;
          line-height: 1;
          cursor: pointer;
          display: none;
          align-items: center;
          justify-content: center;
          padding: 0;
          font-weight: bold;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        `;
        
        container.appendChild(swatch);
        container.appendChild(deleteBtn);
        
        container.addEventListener('mouseenter', () => {
          deleteBtn.style.display = 'flex';
          if (!container.classList.contains('selected')) {
            container.style.background = '#F5F5F5';
          }
        });
        
        container.addEventListener('mouseleave', () => {
          deleteBtn.style.display = 'none';
          if (!container.classList.contains('selected')) {
            container.style.background = 'transparent';
          }
        });
        
        deleteBtn.addEventListener('click', function(e) {
          e.stopPropagation();
          const colors = getCustomColors();
          colors.splice(index, 1);
          saveCustomColors(colors);
        });
        
        container.addEventListener('click', function() {
          document.querySelectorAll('.color-swatch-container').forEach(c => c.classList.remove('selected'));
          document.querySelectorAll('.custom-color-swatch-container').forEach(c => {
            c.classList.remove('selected');
            c.style.borderColor = 'transparent';
            c.style.background = 'transparent';
          });
          
          this.classList.add('selected');
          this.style.borderColor = '#4F46E5';
          this.style.background = '#F5F5F5';
          
          const indicator = document.getElementById('fill-color-indicator');
          if (indicator) indicator.style.backgroundColor = color.hex;
          
          if (window.mapFunctions && window.mapFunctions.applyColorToSelected) {
            window.mapFunctions.applyColorToSelected(color.hex);
          }
        });
        
        customColorsBar.appendChild(container);
      });
    }
    
    drawColorGradient();
    updateColor();
    renderCustomColors();
    
    // ✅ Position initiale des curseurs circulaires
    if (hueCursor) hueCursor.style.left = '0px';
    if (opacityCursor && opacityBarBg) {
      opacityCursor.style.left = opacityBarBg.offsetWidth + 'px';
    }
    if (colorCursor) {
      colorCursor.style.left = '200px';
      colorCursor.style.top = '0px';
    }
    
    // Observer pour fermer le CP quand le Group Focus FCM se ferme
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          const fillColorMenu = addBtn.closest('[class*="GroupFocus"]') || 
                               addBtn.closest('[class*="bubble-r-container"]');
          
          if (fillColorMenu) {
            const isHidden = fillColorMenu.style.display === 'none' || 
                            fillColorMenu.style.visibility === 'hidden' ||
                            window.getComputedStyle(fillColorMenu).display === 'none';
            
            if (isHidden && panel.classList.contains('open')) {
              console.log('[ColorPicker] FCM closed, closing CP');
              panel.classList.remove('open');
              setTimeout(() => {
                panel.style.display = 'none';
              }, 200);
            }
          }
        }
      });
    });

    // Observer le Group Focus parent
    const fillColorMenu = addBtn.closest('[class*="GroupFocus"]') || 
                         addBtn.closest('[class*="bubble-r-container"]');

    if (fillColorMenu) {
      observer.observe(fillColorMenu, {
        attributes: true,
        attributeFilter: ['style']
      });
      console.log('[ColorPicker] Observer attached to FCM');
    }
    
    console.log('[ColorPicker] ✓ Complete');
  }
})();
</script>