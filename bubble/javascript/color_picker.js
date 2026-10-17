<!-- Panneau Color Picker -->
<div id="custom-color-panel" style="display: none; position: fixed; width: 220px; background: white; box-shadow: -4px 0 12px rgba(0,0,0,0.1); border-radius: 10px; z-index: 99999;">
  
  <div style="padding: 5px 10px; border-bottom: 1px solid #D9D9D9; display: flex; justify-content: space-between; align-items: center;">
    <input type="text" id="color-name-input" placeholder="Name (optional)" style="padding: 7px 6px; background: #F5F5F5; border: none; border-radius: 4px; font-size: 12px; line-height: 1; font-family: 'JetBrains Mono', monospace; font-weight: 400; outline: none; flex: 1; max-width: 130px; color: #1E1E1E;" maxlength="30" />
    
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
    
    <div style="position: relative; width: 200px; height: 200px; border-radius: 4px; border: 1px solid #D9D9D9; cursor: crosshair;" id="color-gradient-box">
      <canvas id="color-canvas" width="200" height="200" style="border-radius: 4px; display: block;"></canvas>
      <div id="color-cursor" style="position: absolute; width: 16px; height: 16px; background: transparent; border: 3px solid white; border-radius: 50%; box-shadow: 0 1px 3px rgba(0,0,0,0.3); pointer-events: none; transform: translate(-50%, -50%); box-sizing: border-box;"></div>
    </div>
    
    <div style="display: flex; gap: 10px; align-items: center;">
      <button id="eyedropper-btn" style="width: 30px; height: 30px; padding: 0; border: none; background: transparent; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; border-radius: 4px; transition: background 0.2s;">
        <svg width="18" height="18" fill="#1E1E1E" viewBox="0 0 16 16">
          <path d="M13.354.646a1.207 1.207 0 0 0-1.708 0L8.5 3.793l-.646-.647a.5.5 0 1 0-.708.708L8.293 5l-7.147 7.146A.5.5 0 0 0 1 12.5v1.793l-.854.853a.5.5 0 1 0 .708.707L1.707 15H3.5a.5.5 0 0 0 .354-.146L11 7.707l1.146 1.147a.5.5 0 0 0 .708-.708l-.647-.646 3.147-3.146a1.207 1.207 0 0 0 0-1.708zM2 12.707l7-7L10.293 7l-7 7H2z"/>
        </svg>
      </button>
      
      <div style="width: 160px; display: flex; flex-direction: column; gap: 6px;">
        <div style="position: relative; height: 16px; border-radius: 8px; cursor: pointer; background: linear-gradient(90deg, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%);" id="hue-bar">
          <div id="hue-cursor" style="position: absolute; top: 0; width: 16px; height: 16px; background: transparent; border: 3px solid white; border-radius: 50%; transform: translateX(-50%); pointer-events: none; box-shadow: 0 1px 3px rgba(0,0,0,0.3); box-sizing: border-box;"></div>
        </div>
        
        <div style="position: relative; height: 16px; border-radius: 8px; border: 1px solid #D9D9D9; cursor: pointer; background-color: #E5E7EB; background-image: linear-gradient(45deg, #fff 25%, transparent 25%), linear-gradient(-45deg, #fff 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #fff 75%), linear-gradient(-45deg, transparent 75%, #fff 75%); background-size: 10px 10px; background-position: 0 0, 0 5px, 5px -5px, -5px 0px;" id="opacity-bar-bg">
          <div id="opacity-bar" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; border-radius: 8px; background: linear-gradient(90deg, transparent 0%, #FF0000 100%);"></div>
          <div id="opacity-cursor" style="position: absolute; top: 0; width: 16px; height: 16px; background: transparent; border: 3px solid white; border-radius: 50%; transform: translateX(-50%); pointer-events: none; box-shadow: 0 1px 3px rgba(0,0,0,0.3); box-sizing: border-box;"></div>
        </div>
      </div>
    </div>
    
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <div style="padding: 1px 6px; border-radius: 4px; border: 1px solid #D9D9D9; cursor: pointer; display: flex; align-items: center;">
        <div style="padding: 2px; display: flex; align-items: center;">
          <span style="color: #1E1E1E; font-size: 12px; line-height: 1; font-family: 'JetBrains Mono', monospace; font-weight: 300;">Hex</span>
        </div>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M6 7.7L3 4.7L3.7 4L6 6.3L8.3 4L9 4.7L6 7.7Z" fill="#1D1B20"/>
        </svg>
      </div>
      
      <div style="height: 22px; display: flex; align-items: center; gap: 1px; border-radius: 4px;">
        <div style="display: flex; padding: 3px 12px 3px 8px; justify-content: center; align-items: center; border-radius: 4px 0 0 4px; background: #F5F5F5;">
          <input type="text" id="hex-input" value="FFFFFF" maxlength="6" style="width: 48px; background: transparent; border: none; color: #1E1E1E; font-size: 12px; line-height: 1; font-family: 'JetBrains Mono', monospace; font-weight: 300; outline: none;" />
        </div>
        
        <div style="display: flex; padding: 1px 6px; align-items: center; gap: 4px; border-radius: 0 4px 4px 0; background: #F5F5F5;">
          <div style="padding: 2px; display: flex; justify-content: center; align-items: center;">
            <input type="number" id="opacity-input" value="100" min="0" max="100" style="width: 24px; background: transparent; border: none; color: #1E1E1E; font-size: 12px; line-height: 1; font-family: 'JetBrains Mono', monospace; font-weight: 300; outline: none; text-align: right;" />
          </div>
          <div style="padding: 2px; display: flex; justify-content: center; align-items: center;">
            <span style="color: #757575; font-size: 12px; line-height: 1; font-family: 'JetBrains Mono', monospace; font-weight: 400;">%</span>
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
    background: #F5F5F5 !important;
  }
  
  #eyedropper-btn:hover {
    background: #F5F5F5 !important;
  }
</style>

<script>
(function() {
  console.log('[ColorPicker] Script loaded');
  
  var STORAGE_KEY = 'mapflow_custom_colors';
  var currentHue = 0;
  var currentSaturation = 100;
  var currentLightness = 50;
  var currentOpacity = 100;
  var initialized = false;
  
  var canvas, ctx, colorBox, colorCursor, hueBar, hueCursor;
  var opacityBar, opacityBarBg, opacityCursor, hexInput, opacityInput;
  var colorNameInput, panel, cancelBtn, saveBtn;
  
  function init() {
    if (initialized) return;
    
    console.log('[ColorPicker] Initializing...');
    
    canvas = document.getElementById('color-canvas');
    ctx = canvas ? canvas.getContext('2d') : null;
    colorBox = document.getElementById('color-gradient-box');
    colorCursor = document.getElementById('color-cursor');
    hueBar = document.getElementById('hue-bar');
    hueCursor = document.getElementById('hue-cursor');
    opacityBar = document.getElementById('opacity-bar');
    opacityBarBg = document.getElementById('opacity-bar-bg');
    opacityCursor = document.getElementById('opacity-cursor');
    hexInput = document.getElementById('hex-input');
    opacityInput = document.getElementById('opacity-input');
    colorNameInput = document.getElementById('color-name-input');
    panel = document.getElementById('custom-color-panel');
    cancelBtn = document.getElementById('cancel-color-btn');
    saveBtn = document.getElementById('save-color-btn');
    
    if (!panel || !canvas) {
      console.error('[ColorPicker] Panel or canvas not found');
      return;
    }
    
    initialized = true;
    
    // Empêcher la propagation des clics
    panel.addEventListener('click', function(e) { e.stopPropagation(); });
    panel.addEventListener('mousedown', function(e) { e.stopPropagation(); });
    
    // Color gradient box
    if (colorBox && colorCursor) {
      colorBox.addEventListener('mousedown', function(e) {
        function handleMove(e) {
          var rect = colorBox.getBoundingClientRect();
          var x = Math.max(0, Math.min(200, e.clientX - rect.left));
          var y = Math.max(0, Math.min(200, e.clientY - rect.top));
          
          currentSaturation = (x / 200) * 100;
          currentLightness = 100 - (y / 200) * 100;
          
          colorCursor.style.left = x + 'px';
          colorCursor.style.top = y + 'px';
          
          updateColor();
        }
        
        handleMove(e);
        document.addEventListener('mousemove', handleMove);
        document.addEventListener('mouseup', function() {
          document.removeEventListener('mousemove', handleMove);
        }, { once: true });
      });
    }
    
    // Hue bar
    if (hueBar && hueCursor) {
      hueBar.addEventListener('mousedown', function(e) {
        function handleMove(e) {
          var rect = hueBar.getBoundingClientRect();
          var x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
          
          currentHue = (x / rect.width) * 360;
          hueCursor.style.left = x + 'px';
          
          drawColorGradient();
          updateColor();
        }
        
        handleMove(e);
        document.addEventListener('mousemove', handleMove);
        document.addEventListener('mouseup', function() {
          document.removeEventListener('mousemove', handleMove);
        }, { once: true });
      });
    }
    
    // Opacity bar
    if (opacityBarBg && opacityCursor) {
      opacityBarBg.addEventListener('mousedown', function(e) {
        function handleMove(e) {
          var rect = opacityBarBg.getBoundingClientRect();
          var x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
          
          currentOpacity = Math.round((x / rect.width) * 100);
          opacityCursor.style.left = x + 'px';
          
          updateColor();
        }
        
        handleMove(e);
        document.addEventListener('mousemove', handleMove);
        document.addEventListener('mouseup', function() {
          document.removeEventListener('mousemove', handleMove);
        }, { once: true });
      });
    }
    
    // Hex input
    if (hexInput) {
      hexInput.addEventListener('input', function() {
        var hex = this.value.toUpperCase();
        if (/^[0-9A-F]{6}$/.test(hex)) {
          var r = parseInt(hex.substr(0, 2), 16) / 255;
          var g = parseInt(hex.substr(2, 2), 16) / 255;
          var b = parseInt(hex.substr(4, 2), 16) / 255;
          
          var max = Math.max(r, g, b);
          var min = Math.min(r, g, b);
          var l = (max + min) / 2;
          
          var h, s;
          if (max === min) {
            h = s = 0;
          } else {
            var d = max - min;
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
          
          if (hueCursor && hueBar) hueCursor.style.left = (currentHue / 360 * hueBar.offsetWidth) + 'px';
          if (colorCursor) {
            colorCursor.style.left = (currentSaturation / 100 * 200) + 'px';
            colorCursor.style.top = ((100 - currentLightness) / 100 * 200) + 'px';
          }
        }
      });
    }
    
    // Opacity input
    if (opacityInput && opacityCursor && opacityBarBg) {
      opacityInput.addEventListener('input', function() {
        currentOpacity = Math.max(0, Math.min(100, parseInt(this.value) || 0));
        opacityCursor.style.left = (currentOpacity / 100 * opacityBarBg.offsetWidth) + 'px';
      });
    }
    
    // Eyedropper
    var eyedropperBtn = document.getElementById('eyedropper-btn');
    if (eyedropperBtn && window.EyeDropper) {
      eyedropperBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        var eyeDropper = new EyeDropper();
        eyeDropper.open().then(function(result) {
          if (hexInput) {
            hexInput.value = result.sRGBHex.substring(1).toUpperCase();
            hexInput.dispatchEvent(new Event('input'));
          }
        }).catch(function() {});
      });
    }
    
    // Cancel button - ferme SEULEMENT le color picker
    if (cancelBtn) {
      cancelBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        closeColorPicker();
      });
    }
    
    // Save button
    if (saveBtn) {
      saveBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        
        var hex = hexInput ? '#' + hexInput.value : '#FFFFFF';
        var name = colorNameInput ? (colorNameInput.value.trim() || hex) : hex;
        
        // Sauvegarder
        var stored = localStorage.getItem(STORAGE_KEY);
        var colors = stored ? JSON.parse(stored) : [];
        colors.push({ hex: hex, name: name, opacity: currentOpacity });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(colors));
        
        if (colorNameInput) colorNameInput.value = '';
        
        closeColorPicker();
        
        // Mettre à jour l'indicateur
        var indicator = document.getElementById('fill-color-indicator');
        if (indicator) indicator.style.backgroundColor = hex;
        
        // Appliquer la couleur
        if (window.mapFunctions && window.mapFunctions.applyColorToSelected) {
          window.mapFunctions.applyColorToSelected(hex);
        }
        
        // Rafraîchir le FCM
        if (window.fcmRenderCustomColors) {
          window.fcmRenderCustomColors();
        }
        
        window.dispatchEvent(new CustomEvent('customColorAdded'));
        console.log('[ColorPicker] Color saved:', hex);
      });
    }
    
    // Position initiale des curseurs
    if (hueCursor) hueCursor.style.left = '0px';
    if (opacityCursor && opacityBarBg) {
      opacityCursor.style.left = opacityBarBg.offsetWidth + 'px';
    }
    if (colorCursor) {
      colorCursor.style.left = '200px';
      colorCursor.style.top = '0px';
    }
    
    drawColorGradient();
    updateColor();
    
    console.log('[ColorPicker] ✓ Initialized');
  }
  
  function drawColorGradient() {
    if (!ctx) return;
    var gradientH = ctx.createLinearGradient(0, 0, 200, 0);
    gradientH.addColorStop(0, 'white');
    gradientH.addColorStop(1, 'hsl(' + currentHue + ', 100%, 50%)');
    ctx.fillStyle = gradientH;
    ctx.fillRect(0, 0, 200, 200);
    
    var gradientV = ctx.createLinearGradient(0, 0, 0, 200);
    gradientV.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradientV.addColorStop(1, 'rgba(0, 0, 0, 1)');
    ctx.fillStyle = gradientV;
    ctx.fillRect(0, 0, 200, 200);
  }
  
  function hslToHex(h, s, l) {
    s /= 100;
    l /= 100;
    var c = (1 - Math.abs(2 * l - 1)) * s;
    var x = c * (1 - Math.abs((h / 60) % 2 - 1));
    var m = l - c / 2;
    var r, g, b;
    
    if (h < 60) { r = c; g = x; b = 0; }
    else if (h < 120) { r = x; g = c; b = 0; }
    else if (h < 180) { r = 0; g = c; b = x; }
    else if (h < 240) { r = 0; g = x; b = c; }
    else if (h < 300) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }
    
    r = Math.round((r + m) * 255).toString(16).padStart(2, '0');
    g = Math.round((g + m) * 255).toString(16).padStart(2, '0');
    b = Math.round((b + m) * 255).toString(16).padStart(2, '0');
    
    return '#' + r + g + b;
  }
  
  function updateColor() {
    if (!hexInput || !opacityInput || !opacityBar) return;
    var hex = hslToHex(currentHue, currentSaturation, currentLightness);
    hexInput.value = hex.substring(1).toUpperCase();
    opacityInput.value = currentOpacity;
    
    var color = 'hsl(' + currentHue + ', ' + currentSaturation + '%, ' + currentLightness + '%)';
    opacityBar.style.background = 'linear-gradient(90deg, transparent 0%, ' + color + ' 100%)';
  }
  
  function closeColorPicker() {
    var p = document.getElementById('custom-color-panel');
    if (p) {
      p.classList.remove('open');
      setTimeout(function() { p.style.display = 'none'; }, 200);
    }
  }
  
  // Exposer les fonctions globalement pour le FCM
  window.openColorPicker = function(sourceMenuId) {
    init();
    
    var p = document.getElementById('custom-color-panel');
    if (!p) return;
    
    // Toggle : si déjà ouvert, fermer
    if (p.classList.contains('open')) {
      closeColorPicker();
      return;
    }
    
    // Positionner à droite du menu source (FCM ou SCM)
    var menuId = sourceMenuId || 'fill-color-menu';
    var menu = document.getElementById(menuId);
    
    if (menu) {
      var rect = menu.getBoundingClientRect();
      p.style.left = (rect.right + 6) + 'px';
      p.style.top = rect.top + 'px';
    }
    
    p.style.display = 'block';
    requestAnimationFrame(function() {
      p.classList.add('open');
    });
    
    drawColorGradient();
    updateColor();
    
    console.log('[ColorPicker] Opened next to:', menuId);
  };
  
  window.closeColorPicker = closeColorPicker;
  
  // Init au chargement
  setTimeout(init, 300);
  
  console.log('[ColorPicker] Script ready');
})();
</script>
