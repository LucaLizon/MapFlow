<!-- Panneau latéral (complètement indépendant) -->
<div id="custom-color-panel" style="display: none; position: fixed; width: 240px; height: 100vh; top: 0; right: 0; background: white; box-shadow: -4px 0 12px rgba(0,0,0,0.1); z-index: 99999; overflow-y: auto;">
  
  <!-- Container principal du picker -->
  <div style="width: 220px; padding: 10px; flex-direction: column; gap: 12px; display: flex;">
    
    <!-- Zone de sélection 2D (Saturation/Luminosité) -->
    <div style="position: relative; width: 200px; height: 200px; border-radius: 4px; border: 1px solid #D9D9D9; cursor: crosshair;" id="color-gradient-box">
      <canvas id="color-canvas" width="200" height="200" style="border-radius: 4px; display: block;"></canvas>
      <div id="color-cursor" style="position: absolute; width: 12px; height: 12px; border: 2px solid white; border-radius: 50%; box-shadow: 0 0 3px rgba(0,0,0,0.5); pointer-events: none; transform: translate(-50%, -50%);"></div>
    </div>
    
    <!-- Icône pipette + Barres Hue et Opacity -->
    <div style="justify-content: flex-start; align-items: center; gap: 10px; display: flex;">
      <!-- Icône pipette -->
      <div style="width: 18px; height: 18px; background: #B3B3B3; border-radius: 2px; flex-shrink: 0;"></div>
      
      <div style="flex: 1; flex-direction: column; gap: 6px; display: flex;">
        <!-- Barre de teinte (Hue) -->
        <div style="position: relative; height: 16px; border-radius: 8px; cursor: pointer; background: linear-gradient(90deg, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%);" id="hue-bar">
          <div id="hue-cursor" style="position: absolute; top: -2px; width: 4px; height: 20px; background: white; border: 1px solid #999; border-radius: 2px; transform: translateX(-50%); pointer-events: none;"></div>
        </div>
        
        <!-- Barre d'opacité -->
        <div style="position: relative; height: 16px; border-radius: 8px; border: 1px solid #D9D9D9; cursor: pointer; background: url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"10\" height=\"10\"><rect width=\"5\" height=\"5\" fill=\"%23E5E7EB\"/><rect x=\"5\" y=\"5\" width=\"5\" height=\"5\" fill=\"%23E5E7EB\"/><rect x=\"5\" width=\"5\" height=\"5\" fill=\"white\"/><rect y=\"5\" width=\"5\" height=\"5\" fill=\"white\"/></svg>') repeat;" id="opacity-bar-bg">
          <div id="opacity-bar" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; border-radius: 8px; background: linear-gradient(90deg, transparent 0%, #FF0000 100%);"></div>
          <div id="opacity-cursor" style="position: absolute; top: -2px; width: 4px; height: 20px; background: white; border: 1px solid #999; border-radius: 2px; transform: translateX(-50%); pointer-events: none;"></div>
        </div>
      </div>
    </div>
    
    <!-- Format et valeur -->
    <div style="justify-content: space-between; align-items: center; display: flex;">
      <!-- Dropdown format -->
      <div style="padding: 3px 6px; border-radius: 4px; border: 1px solid #D9D9D9; cursor: pointer; display: flex; align-items: center; gap: 4px;" id="format-selector">
        <span style="color: black; font-size: 12px; font-family: 'JetBrains Mono', monospace; font-weight: 300;">Hex</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 5L6 8L9 5" stroke="#1D1B20" stroke-width="1.5"/></svg>
      </div>
      
      <!-- Input valeur + opacité -->
      <div style="border-radius: 4px; display: flex; overflow: hidden; border: 1px solid #D9D9D9;">
        <input type="text" id="hex-input" value="FFFFFF" maxlength="6" style="width: 70px; padding: 4px 8px; background: #F5F5F5; border: none; border-top-left-radius: 4px; border-bottom-left-radius: 4px; color: black; font-size: 12px; font-family: 'JetBrains Mono', monospace; font-weight: 300; outline: none;" />
        <div style="display: flex; align-items: center; padding: 4px 6px; background: #F5F5F5; border-left: 1px solid #D9D9D9; border-top-right-radius: 4px; border-bottom-right-radius: 4px; gap: 2px;">
          <input type="number" id="opacity-input" value="100" min="0" max="100" style="width: 30px; background: transparent; border: none; color: black; font-size: 12px; font-family: 'JetBrains Mono', monospace; font-weight: 300; outline: none; text-align: right;" />
          <span style="color: #757575; font-size: 12px; font-family: 'JetBrains Mono', monospace;">%</span>
        </div>
      </div>
    </div>
    
    <!-- Input nom de la couleur -->
    <input type="text" id="color-name-input" placeholder="Color name (optional)" maxlength="30" style="width: 100%; padding: 8px 12px; border: 1px solid #D9D9D9; border-radius: 4px; font-size: 13px; outline: none; box-sizing: border-box;" />
    
    <!-- Boutons -->
    <div style="display: flex; gap: 8px; margin-top: 8px;">
      <button id="cancel-color-btn" style="flex: 1; padding: 10px; border: 1px solid #D9D9D9; border-radius: 6px; background: white; cursor: pointer; font-weight: 500; font-size: 13px;">Cancel</button>
      <button id="save-color-btn" style="flex: 1; padding: 10px; border: none; border-radius: 6px; background: #4F46E5; color: white; cursor: pointer; font-weight: 500; font-size: 13px;">Save</button>
    </div>
    
    <!-- Liste des couleurs sauvegardées -->
    <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #E5E7EB;">
      <div style="font-size: 11px; font-weight: 600; color: #9CA3AF; margin-bottom: 12px; letter-spacing: 0.5px;">YOUR COLORS</div>
      <div id="saved-colors-list" style="display: flex; flex-direction: column; gap: 8px;">
        <!-- Les couleurs sauvegardées apparaissent ici -->
      </div>
    </div>
  </div>
</div>

<style>
  /* Masquer les flèches des inputs number */
  #opacity-input::-webkit-outer-spin-button,
  #opacity-input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  #opacity-input[type=number] {
    -moz-appearance: textfield;
  }
</style>

<script>
(function() {
  console.log('[ColorPicker] Script loaded');
  
  setTimeout(init, 200);
  
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
    
    if (!panel) {
      console.error('[ColorPicker] Panel not found');
      return;
    }
    
    if (!addBtn) {
      console.error('[ColorPicker] Add button not found');
      return;
    }
    
    if (!customColorsBar) {
      console.error('[ColorPicker] Custom colors bar not found');
      return;
    }
    
    console.log('[ColorPicker] Essential elements found ✓');
    
    // Vérifier les éléments optionnels
    if (!opacityBarBg) console.warn('[ColorPicker] opacityBarBg not found - opacity slider disabled');
    if (!canvas) console.warn('[ColorPicker] Canvas not found - gradient disabled');
    
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
    
    addBtn.addEventListener('click', function() {
      console.log('[ColorPicker] Button clicked, opening panel');
      
      // Trouver le Group Focus du menu de couleurs
      // Il peut avoir différentes classes selon Bubble
      let fillColorMenu = document.querySelector('[id*="fill-color-menu"]');
      
      // Si pas trouvé, chercher le parent du bouton qui est un popup/group focus
      if (!fillColorMenu) {
        fillColorMenu = addBtn.closest('[class*="bubble-r-container"]');
      }
      
      if (!fillColorMenu) {
        fillColorMenu = addBtn.closest('[class*="group-container"]');
      }
      
      if (fillColorMenu) {
        const rect = fillColorMenu.getBoundingClientRect();
        
        // Positionner à 6px à droite du menu
        panel.style.left = (rect.right + 6) + 'px';
        panel.style.top = rect.top + 'px';
        panel.style.right = 'auto'; // Annuler right: 0
        
        console.log('[ColorPicker] Menu position:', {
          menuRight: rect.right,
          menuTop: rect.top,
          panelLeft: rect.right + 6
        });
      } else {
        console.warn('[ColorPicker] Fill color menu not found, using default position');
        panel.style.right = '0px';
        panel.style.left = 'auto';
      }
      
      panel.style.display = 'block';
      drawColorGradient();
      updateColor();
    });
    
    if (cancelBtn) {
      cancelBtn.addEventListener('click', function() {
        console.log('[ColorPicker] Closing panel');
        panel.style.display = 'none';
      });
    }
    
    if (saveBtn) {
      saveBtn.addEventListener('click', function() {
        console.log('[ColorPicker] Saving color');
        const hex = hexInput ? '#' + hexInput.value : '#FFFFFF';
        const name = colorNameInput ? (colorNameInput.value.trim() || hex) : hex;
        const opacity = currentOpacity;
        
        const colors = getCustomColors();
        colors.push({ hex, name, opacity });
        saveCustomColors(colors);
        
        if (colorNameInput) colorNameInput.value = '';
        panel.style.display = 'none';
        
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
      customColorsBar.innerHTML = '';
      
      colors.forEach((color) => {
        const container = document.createElement('div');
        container.style.cssText = `
          width: 30px; height: 30px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
        `;
        
        const swatch = document.createElement('div');
        swatch.style.cssText = `
          width: 24px; height: 24px; border-radius: 6px;
          background: ${color.hex};
          border: 1px solid rgba(0,0,0,0.1);
          opacity: ${color.opacity / 100};
        `;
        swatch.title = color.name;
        
        container.appendChild(swatch);
        
        container.addEventListener('click', function() {
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
    
    if (hueCursor) hueCursor.style.left = '0px';
    if (opacityCursor && opacityBarBg) opacityCursor.style.left = opacityBarBg.offsetWidth + 'px';
    if (colorCursor) {
      colorCursor.style.left = '200px';
      colorCursor.style.top = '0px';
    }
    
    console.log('[ColorPicker] ✓ Initialization complete');
  }
})();
</script>