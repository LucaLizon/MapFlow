<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    #map-container {
      width: 100%;
      height: 100vh;
      background-color: #FFFFFF;
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      overflow: hidden;
    }
    
    .country {
      fill: #E5E7EB;
      stroke: #FFFFFF;
      stroke-width: 0.2;
      cursor: pointer;
      transition: fill 0.2s ease, transform 0.3s ease;
    }

    .country:hover {
      fill: #D1D5DB;
      stroke: #9CA3AF;
      stroke-width: 0.2;
    }

    .country.selected {
      stroke: #4F46E5 !important;
      stroke-width: 0.2 !important;
      stroke-linecap: round !important;
      stroke-linejoin: round !important;
    }

    .country.colored {
      /* Pas de stroke-width forcé, laissé à JavaScript */
    }

    .country.colored:hover {
      filter: brightness(0.9);
    }
    
    /* 🎯 STYLE POUR LES PAYS CACHÉS */
    .country.hidden {
      display: none;
      pointer-events: none;
    }

    .loading {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-family: Arial, sans-serif;
      color: #6B7280;
    }
    
    /* ÉTAT 1 : Active (zone sélectionnée avec poignées) */
    .text-box.active .text-box-rect {
      fill: transparent;
      stroke: #18A0FB;
      stroke-width: 0.5;
      stroke-dasharray: none;
      pointer-events: all;
    }
    
    /* 🎯 Zone liée à un pays caché : tout grisé */
    .text-box.linked-hidden .text-box-rect {
      stroke: #9CA3AF !important;
    }
    
    .text-box.linked-hidden .text-box-text {
      fill: #9CA3AF !important;
      opacity: 0.6;
    }
    
    .group-selection-active .text-box.active .text-box-rect {
      stroke: transparent;
      stroke-width: 0;
    }
    
    .group-selection-active .text-box.active .resize-handle {
      opacity: 0;
      pointer-events: none;
    }
    
    /* 🎯 Cacher les indicateurs individuels en multi-sélection */
    .group-selection-active .text-box.active .lock-indicator {
      display: none;
    }
    
    /* ÉTAT 2 : Idle (au repos, juste le texte visible) */
    .text-box .text-box-rect {
      fill: transparent;
      stroke: transparent;
      stroke-width: 0;
      pointer-events: none;
    }
    
    .text-box-text {
      pointer-events: all;
      user-select: none;
      dominant-baseline: middle;
      text-anchor: middle;
      cursor: text;
      fill: #000000;
      font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }

    .text-box {
      transition: transform 0.3s ease;
    }

    .text-box.dragging {
      transition: none !important;
    }
    
    .text-box:not(.active) .text-box-text {
      cursor: pointer;
    }
    
    .text-box-placeholder {
      fill: #AAAAAA;
      font-style: normal;
    }
    
    .resize-handle {
      fill: white;
      stroke: #18A0FB;
      stroke-width: 0.5;
      opacity: 0;
      cursor: nwse-resize;
      pointer-events: none;
    }
    
    .text-box.active .resize-handle {
      opacity: 1;
      pointer-events: all;
    }
    
    .resize-handle.ne {
      cursor: nesw-resize;
    }
    
    .resize-handle.sw {
      cursor: nesw-resize;
    }
    
    /* 🎯 INDICATEUR DE LIAISON (cadenas + nom pays) */
    .lock-indicator {
      pointer-events: all;
      cursor: pointer;
    }
    
    .lock-indicator.disabled {
      pointer-events: none;
      opacity: 0.3;
    }

    /* 🎯 PRIORITÉ 1 : Cacher le cadenas quand zone non active */
    .text-box:not(.active) .lock-indicator {
      display: none !important;
    }

    /* ✅ Par défaut : gris */
    .lock-icon {
      color: #9CA3AF;
    }

    .country-name-label {
      font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 3px;
      fill: #9CA3AF;
      pointer-events: none;
    }

    /* ✅ État lié : BLEU (cadenas ET nom) */
    .lock-indicator.linked .lock-icon {
      color: #18A0FB !important;
    }

    .lock-indicator.linked .country-name-label {
      fill: #18A0FB !important;
    }

    /* ✅ État prêt à lier : GRIS */
    .lock-indicator.ready-to-link .lock-icon {
      color: #9CA3AF !important;
    }

    .lock-indicator.ready-to-link .country-name-label {
      fill: #9CA3AF !important;
    }

    /* ✅ État pays caché : GRIS */
    .lock-indicator.linked-hidden .lock-icon {
      color: #9CA3AF !important;
    }

    .lock-indicator.linked-hidden .country-name-label {
      fill: #9CA3AF !important;
    }

    /* ✅ État désactivé : gris clair */
    .lock-indicator.disabled .lock-icon {
      color: #D1D5DB !important;
    }

    .lock-indicator.disabled .country-name-label {
      fill: #D1D5DB !important;
    }
    
    /* 🎯 INDICATEUR DE GROUPE sur bounding box */
    .group-lock-indicator {
      pointer-events: none;
    }
    
    .group-lock-icon {
      fill: #18A0FB;
    }
    
    .group-country-name {
      font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 3px;
      fill: #18A0FB;
    }
    
    .text-input-overlay {
      position: absolute;
      border: none;
      background: transparent;
      padding: 0;
      font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 14px;
      outline: none;
      resize: none;
      overflow: hidden;
      z-index: 1000;
      box-sizing: border-box;
      color: #000000;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1.2;
    }
    
    /* 🎨 STYLES POUR LE SLIDER BUBBLE CUSTOM */
    .custom-range-slider {
      width: 100%;
      height: 4px;
      border-radius: 2px;
      outline: none;
      -webkit-appearance: none;
      background: linear-gradient(to right, #10B981 0%, #10B981 0%, #E5E7EB 0%, #E5E7EB 100%);
      cursor: pointer;
    }
    
    .custom-range-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: #10B981;
      cursor: pointer;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      transition: transform 0.1s ease;
    }
    
    .custom-range-slider::-webkit-slider-thumb:hover {
      transform: scale(1.1);
    }
    
    .custom-range-slider::-moz-range-thumb {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: #10B981;
      cursor: pointer;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      transition: transform 0.1s ease;
    }
    
    .custom-range-slider::-moz-range-thumb:hover {
      transform: scale(1.1);
    }
  </style>
</head>
<body>
  <div id="map-container">
    <div class="loading">Loading map...</div>
  </div>
  
  <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/topojson/3.0.2/topojson.min.js"></script>
  
  <script>
    function initMap() {
      if (typeof d3 === 'undefined' || typeof topojson === 'undefined') {
        setTimeout(initMap, 100);
        return;
      }

      const loadingEl = document.querySelector('.loading');
      if (loadingEl) loadingEl.remove();
      
      const CONFIG = {
        defaultColor: '#E5E7EB',
        hoverColor: '#D1D5DB',
        selectedStroke: '#4F46E5',
        borderColor: '#FFFFFF'
      };
      
      let selectedCountries = new Set();
      let countryColors = new Map();
      let countryStrokes = new Map();
      let hiddenCountries = new Set(); // 🎯 Track hidden countries
      let activeTextBoxes = new Set();
      let activeTextarea = null;
      let isResizingGlobal = false;
      let isDrawingBox = false;
      let justFinishedBoxSelection = false;
      let groupBoundingBox = null;
      let groupLockIndicator = null; // 🎯 Group lock indicator
      let countryCentroids = new Map();
      let currentSpacing = 0;

      const COUNTRY_FUSIONS = {
        'Morocco': ['W. Sahara'],          // Maroc contrôle le Sahara Occidental
        'Somalia': ['Somaliland']          // Somaliland fait partie de la Somalie
      };
      
      let isPanMode = false;
      let isSelectionMode = true;
      
      const container = document.getElementById('map-container');
      const width = container.clientWidth;
      const height = container.clientHeight;
      
      const projection = d3.geoMercator()
        .scale(130)
        .translate([width / 2, height / 1.5]);
      
      const path = d3.geoPath().projection(projection);
      
      const svg = d3.select('#map-container')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .on('click', handleBackgroundClick);
      
      const defs = svg.append('defs');
      
      // 🎯 SVG pour cadenas fermé (locked) - Basé sur Lock_Closed.svg fourni
      const lockClosedSymbol = defs.append('symbol')
        .attr('id', 'lock-closed')
        .attr('viewBox', '0 0 124 164');

      lockClosedSymbol.append('path')
        .attr('d', 'M0 90H124V158C124 161.314 121.314 164 118 164H6C2.68629 164 0 161.314 0 158V90Z')
        .attr('fill', 'currentColor');

      lockClosedSymbol.append('rect')
        .attr('y', 62)
        .attr('width', 20)
        .attr('height', 28)
        .attr('fill', 'currentColor');

      lockClosedSymbol.append('rect')
        .attr('x', 104)
        .attr('y', 62)
        .attr('width', 20)
        .attr('height', 28)
        .attr('fill', 'currentColor');

      lockClosedSymbol.append('path')
        .attr('d', 'M124 62C124 53.858 122.396 45.7958 119.281 38.2736C116.165 30.7514 111.598 23.9166 105.841 18.1594C100.083 12.4021 93.2486 7.83526 85.7264 4.71947C78.2042 1.60368 70.142 -3.55896e-07 62 0C53.858 3.55896e-07 45.7958 1.60368 38.2736 4.71947C30.7514 7.83526 23.9166 12.4021 18.1594 18.1594C12.4021 23.9166 7.83526 30.7514 4.71947 38.2736C1.60368 45.7958 -7.11792e-07 53.858 0 62L19.9581 62C19.9581 56.479 21.0455 51.012 23.1583 45.9113C25.2711 40.8105 28.3679 36.1758 32.2719 32.2719C36.1758 28.3679 40.8105 25.2711 45.9112 23.1583C51.012 21.0455 56.479 19.9581 62 19.9581C67.521 19.9581 72.988 21.0455 78.0888 23.1583C83.1895 25.2711 87.8242 28.3679 91.7281 32.2719C95.6321 36.1758 98.7289 40.8105 100.842 45.9112C102.954 51.012 104.042 56.479 104.042 62H124Z')
        .attr('fill', 'currentColor');

      // 🎯 SVG pour cadenas ouvert (unlocked) - Basé sur Lock_Open.svg fourni
      const lockOpenSymbol = defs.append('symbol')
        .attr('id', 'lock-open')
        .attr('viewBox', '0 0 124 176');

      lockOpenSymbol.append('path')
        .attr('d', 'M0 102H124V170C124 173.314 121.314 176 118 176H6C2.68629 176 0 173.314 0 170V102Z')
        .attr('fill', 'currentColor');

      lockOpenSymbol.append('rect')
        .attr('y', 62)
        .attr('width', 20)
        .attr('height', 40)
        .attr('fill', 'currentColor');

      lockOpenSymbol.append('path')
        .attr('d', 'M104 62H124V82C124 85.3137 121.314 88 118 88H110C106.686 88 104 85.3137 104 82V62Z')
        .attr('fill', 'currentColor');

      lockOpenSymbol.append('path')
        .attr('d', 'M124 62C124 53.858 122.396 45.7958 119.281 38.2736C116.165 30.7514 111.598 23.9166 105.841 18.1594C100.083 12.4021 93.2486 7.83526 85.7264 4.71947C78.2042 1.60368 70.142 -3.55896e-07 62 0C53.858 3.55896e-07 45.7958 1.60368 38.2736 4.71947C30.7514 7.83526 23.9166 12.4021 18.1594 18.1594C12.4021 23.9166 7.83526 30.7514 4.71947 38.2736C1.60368 45.7958 -7.11792e-07 53.858 0 62L20.026 62C20.026 56.4879 21.1117 51.0298 23.2211 45.9372C25.3305 40.8447 28.4223 36.2175 32.3199 32.3199C36.2175 28.4223 40.8447 25.3305 45.9372 23.2211C51.0298 21.1117 56.4879 20.026 62 20.026C67.5121 20.026 72.9702 21.1117 78.0628 23.2211C83.1553 25.3305 87.7825 28.4223 91.6801 32.3199C95.5777 36.2175 98.6695 40.8447 100.779 45.9372C102.888 51.0298 103.974 56.4879 103.974 62H124Z')
        .attr('fill', 'currentColor');
      
      const pattern = defs.append('pattern')
        .attr('id', 'grid')
        .attr('width', 20)
        .attr('height', 20)
        .attr('patternUnits', 'userSpaceOnUse');
      
      pattern.append('rect')
        .attr('width', 20)
        .attr('height', 20)
        .attr('fill', '#FFFFFF');
      
      pattern.append('path')
        .attr('d', 'M 20 0 L 0 0 0 20')
        .attr('fill', 'none')
        .attr('stroke', '#E5E5E5')
        .attr('stroke-width', 0.5);
      
      const g = svg.append('g');
      
      g.append('rect')
        .attr('x', -5000)
        .attr('y', -5000)
        .attr('width', 10000)
        .attr('height', 10000)
        .attr('fill', 'url(#grid)')
        .attr('pointer-events', 'none');
      
      const zoom = d3.zoom()
        .scaleExtent([1, 20])
        .filter(function(event) {
          if (event.type === 'dblclick') return false;
          if (event.button === 2 || event.buttons === 2) return true;
          if (isSelectionMode && event.type !== 'wheel') {
            if (event.type === 'mousedown' && event.button === 2) return true;
            return false;
          }
          return true;
        })
        .on('zoom', (event) => {
          g.attr('transform', event.transform);
          if (activeTextarea && activeTextarea.textBoxGroup) {
            updateTextareaPosition(activeTextarea.element, activeTextarea.textBoxGroup, activeTextarea.data);
          }
        })
        .on('start', function(event) {
          if (isPanMode || event.sourceEvent?.button === 2) {
            svg.style('cursor', 'grabbing');
          }
        })
        .on('end', function(event) {
          if (isPanMode) {
            svg.style('cursor', 'grab');
          } else if (isSelectionMode && event.sourceEvent?.button === 2) {
            svg.style('cursor', 'default');
          }
        });
      
      svg.call(zoom)
        .on('contextmenu', (event) => {
          event.preventDefault();
        });
      
      setupTextInsertion(svg, g);
      setupBoxSelection(svg, g);
      
      d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json')
        .then(data => {
          const countries = topojson.feature(data, data.objects.countries);
          
          g.selectAll('path')
            .data(countries.features)
            .enter()
            .append('path')
            .attr('class', 'country')
            .attr('d', path)
            .attr('data-country-id', d => d.id)
            .attr('data-country-name', d => d.properties.name)
            .on('click', handleCountryClick)
            .each(function(d) {
              const centroid = path.centroid(d);
              countryCentroids.set(d.id, centroid);
            });
            
          console.log('✅ Map loaded -', countryCentroids.size, 'centroids calculated');
        })
        .catch(error => {
          console.error('Error loading map:', error);
        });
      
      function applyCountrySpacing(spacing) {
        currentSpacing = spacing;
        
        const mapCenterX = projection([0, 0])[0];
        const mapCenterY = projection([0, 0])[1];
        
        g.selectAll('.country').each(function(d) {
          const country = d3.select(this);
          const countryId = d.id;
          const centroid = countryCentroids.get(countryId);
          
          if (!centroid || isNaN(centroid[0]) || isNaN(centroid[1])) {
            country.attr('transform', null);
            return;
          }
          
          const dx = centroid[0] - mapCenterX;
          const dy = centroid[1] - mapCenterY;
          
          const offsetX = dx * (spacing / 100) * 0.5;
          const offsetY = dy * (spacing / 100) * 0.5;
          
          if (spacing === 0) {
            country.attr('transform', null);
          } else {
            country.attr('transform', `translate(${offsetX}, ${offsetY})`);
          }
        });
        
        // ✅ Appliquer la MÊME transformation aux zones de texte liées
        g.selectAll('.text-box').each(function() {
          const textBoxGroup = d3.select(this);
          const data = textBoxGroup.datum();
          
          if (data.linkedCountryId) {
            const centroid = countryCentroids.get(data.linkedCountryId);
            
            if (centroid && !isNaN(centroid[0]) && !isNaN(centroid[1])) {
              const dx = centroid[0] - mapCenterX;
              const dy = centroid[1] - mapCenterY;
              
              // ✅ Calculer le MÊME offset de spacing que le pays
              const spacingOffsetX = dx * (spacing / 100) * 0.5;
              const spacingOffsetY = dy * (spacing / 100) * 0.5;
              
              // ✅ Position = position de base + offset utilisateur + offset spacing (identique au pays)
              const finalX = data.baseX + (data.offsetX || 0) + spacingOffsetX;
              const finalY = data.baseY + (data.offsetY || 0) + spacingOffsetY;
              
              textBoxGroup.attr('transform', 
                `translate(${finalX}, ${finalY}) rotate(${data.rotation || 0} ${data.width/2} ${data.height/2})`
              );
            }
          }
        });
      }
      
      // 🎯 NEW: Update position of a linked text box based on country spacing
      function updateLinkedTextBoxPosition(textBoxGroup, data) {
        const countryId = data.linkedCountryId;
        const centroid = countryCentroids.get(countryId);
        
        if (!centroid || isNaN(centroid[0]) || isNaN(centroid[1])) return;
        
        const mapCenterX = projection([0, 0])[0];
        const mapCenterY = projection([0, 0])[1];
        
        const dx = centroid[0] - mapCenterX;
        const dy = centroid[1] - mapCenterY;
        
        const spacingOffsetX = dx * (currentSpacing / 100) * 0.5;
        const spacingOffsetY = dy * (currentSpacing / 100) * 0.5;
        
        // Apply base position + spacing offset + user offset
        const finalX = data.baseX + spacingOffsetX + (data.offsetX || 0);
        const finalY = data.baseY + spacingOffsetY + (data.offsetY || 0);
        
        textBoxGroup.attr('transform', 
          `translate(${finalX}, ${finalY}) rotate(${data.rotation || 0} ${data.width/2} ${data.height/2})`
        );
      }
      
      // 🎯 NEW: Link a text box to a country
      function linkTextBoxToCountry(textBoxGroup, countryId) {
        const data = textBoxGroup.datum();
        const countryElement = document.querySelector(`[data-country-id="${countryId}"]`);
        const countryName = countryElement ? countryElement.getAttribute('data-country-name') : 'Unknown';
        
        // Get current position
        const transform = textBoxGroup.attr('transform');
        const match = transform.match(/translate\(([^,]+),([^)]+)\)/);
        let currentX = 0, currentY = 0;
        if (match) {
          currentX = parseFloat(match[1]);
          currentY = parseFloat(match[2]);
        }
        
        // Store link data
        data.linkedCountryId = countryId;
        data.linkedCountryName = countryName;
        
        // Calculate base position (centroid) and offset
        const centroid = countryCentroids.get(countryId);
        if (centroid) {
          const mapCenterX = projection([0, 0])[0];
          const mapCenterY = projection([0, 0])[1];
          
          const dx = centroid[0] - mapCenterX;
          const dy = centroid[1] - mapCenterY;
          
          const spacingOffsetX = dx * (currentSpacing / 100) * 0.5;
          const spacingOffsetY = dy * (currentSpacing / 100) * 0.5;
          
          data.baseX = centroid[0];
          data.baseY = centroid[1];
          data.offsetX = currentX - (centroid[0] + spacingOffsetX);
          data.offsetY = currentY - (centroid[1] + spacingOffsetY);
        }
        
        console.log('🔗 Linked text box to:', countryName);
        updateLockIndicator(textBoxGroup);
        updateLinkedTextBoxVisibility(textBoxGroup);
      }
      
      // 🎯 NEW: Unlink a text box from its country
      function unlinkTextBox(textBoxGroup) {
        const data = textBoxGroup.datum();
        const wasLinkedToCountry = data.linkedCountryId;
        
        data.linkedCountryId = null;
        data.linkedCountryName = null;
        data.baseX = null;
        data.baseY = null;
        data.offsetX = null;
        data.offsetY = null;
        
        console.log('🔓 Unlinked text box');
        updateLockIndicator(textBoxGroup);
        
        // Auto-select the country that was linked
        if (wasLinkedToCountry) {
          selectedCountries.clear();
          g.selectAll('.country.selected').classed('selected', false);
          
          selectedCountries.add(wasLinkedToCountry);
          const countryElement = document.querySelector(`[data-country-id="${wasLinkedToCountry}"]`);
          if (countryElement) {
            countryElement.classList.add('selected');
          }
          updateBubbleState();
        }
        
        // Remove linked-hidden class if present
        textBoxGroup.classed('linked-hidden', false);
      }
      
      // 🎯 NEW: Update visibility of linked text boxes (when country is hidden)
      function updateLinkedTextBoxVisibility(textBoxGroup) {
        const data = textBoxGroup.datum();
        
        if (data.linkedCountryId) {
          const countryElement = document.querySelector(`[data-country-id="${data.linkedCountryId}"]`);
          const isCountryHidden = countryElement && countryElement.classList.contains('hidden');
          
          textBoxGroup.classed('linked-hidden', isCountryHidden);
          updateLockIndicator(textBoxGroup);
        }
      }
      
      // 🎯 NEW: Create lock indicator (padlock + country name)
      function createLockIndicator(textBoxGroup) {
        const data = textBoxGroup.datum();
        
        // ✅ Position : au-dessus et à droite de la handle top-left
        const indicator = textBoxGroup.append('g')
          .attr('class', 'lock-indicator')
          .attr('transform', `translate(3, -5)`) // Au-dessus de la handle top-left
          .on('mousedown', function(event) {
            event.stopImmediatePropagation();
            event.stopPropagation();
            event.preventDefault();
          }, true)
          .on('click', function(event) {
            event.stopImmediatePropagation();
            event.stopPropagation();
            event.preventDefault();
            
            if (!textBoxGroup.classed('active')) {
              activateTextBox(textBoxGroup, false, false);
            }
            
            handleLockClick(textBoxGroup);
          }, true);
        
        indicator.append('use')
          .attr('class', 'lock-icon')
          .attr('href', '#lock-open')
          .attr('width', 3)
          .attr('height', 4.2)  /* ✅ Ajusté pour ratio 124:176 */
          .attr('x', 0)
          .attr('y', -1);
        
        indicator.append('text')
          .attr('class', 'country-name-label')
          .attr('x', 4) // À droite du cadenas
          .attr('y', 2) // Centré verticalement avec le cadenas
          .attr('text-anchor', 'start');
        
        updateLockIndicator(textBoxGroup);
      }
      
      // 🎯 NEW: Update lock indicator state
      function updateLockIndicator(textBoxGroup) {
        const data = textBoxGroup.datum();
        const indicator = textBoxGroup.select('.lock-indicator');
        
        if (!indicator.node()) return;
        
        const isLinked = !!data.linkedCountryId;
        const countryElement = data.linkedCountryId ? 
          document.querySelector(`[data-country-id="${data.linkedCountryId}"]`) : null;
        const isCountryHidden = countryElement && countryElement.classList.contains('hidden');
        
        const canToggle = isLinked || (selectedCountries.size === 1 && activeTextBoxes.size === 1);
        
        // ✅ États visuels
        indicator.classed('disabled', !canToggle);
        indicator.classed('linked', isLinked && !isCountryHidden);
        indicator.classed('linked-hidden', isLinked && isCountryHidden);
        indicator.classed('ready-to-link', !isLinked && canToggle); // Nouveau state
        
        const lockIcon = indicator.select('.lock-icon');
        lockIcon.attr('href', isLinked ? '#lock-closed' : '#lock-open');
        
        const label = indicator.select('.country-name-label');
        
        // ✅ Afficher le nom du pays dans différents états
        if (isLinked && data.linkedCountryName) {
          // Pays lié
          const displayName = isCountryHidden ? 
            `${data.linkedCountryName} (hidden)` : 
            data.linkedCountryName;
          label.text(displayName);
        } else if (!isLinked && canToggle) {
          // Prêt à lier : afficher le nom du pays sélectionné en gris
          const countryId = Array.from(selectedCountries)[0];
          const element = document.querySelector(`[data-country-id="${countryId}"]`);
          const countryName = element ? element.getAttribute('data-country-name') : '';
          label.text(countryName);
        } else {
          label.text('');
        }
      }
      
      // 🎯 NEW: Handle lock icon click
      function handleLockClick(textBoxGroup) {
        const data = textBoxGroup.datum();
        
        // Check if action is allowed
        const isLinked = !!data.linkedCountryId;
        const canToggle = isLinked || (selectedCountries.size === 1 && activeTextBoxes.size === 1);
        
        if (!canToggle) {
          console.log('⚠️ Cannot toggle lock: need 1 country + 1 text box selected, or text box already linked');
          return;
        }
        
        if (isLinked) {
          // Unlink
          unlinkTextBox(textBoxGroup);
        } else {
          // Link to selected country
          const countryId = Array.from(selectedCountries)[0];
          linkTextBoxToCountry(textBoxGroup, countryId);
        }
      }
      
      function updateGroupBoundingBox() {
        if (activeTextBoxes.size <= 1) {
          if (groupBoundingBox) {
            groupBoundingBox.remove();
            groupBoundingBox = null;
          }
          if (groupLockIndicator) {
            groupLockIndicator.remove();
            groupLockIndicator = null;
          }
          g.classed('group-selection-active', false);
          return;
        }
        
        g.classed('group-selection-active', true);
        
        let minX = Infinity, minY = Infinity;
        let maxX = -Infinity, maxY = -Infinity;
        
        // 🎯 Check if all selected boxes are linked to the SAME country
        let commonCountryId = null;
        let commonCountryName = null;
        let allLinkedToSame = true;
        
        activeTextBoxes.forEach((textBoxNode, index) => {
          const textBoxGroup = d3.select(textBoxNode);
          const data = textBoxGroup.datum();
          
          const transform = textBoxGroup.attr('transform');
          const match = transform.match(/translate\(([^,]+),([^)]+)\)/);
          if (!match) return;
          
          const x = parseFloat(match[1]);
          const y = parseFloat(match[2]);
          const width = data.width;
          const height = data.height;
          
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x + width);
          maxY = Math.max(maxY, y + height);
          
          // Check linked country
          if (data.linkedCountryId) {
            if (index === 0 || commonCountryId === null) {
              commonCountryId = data.linkedCountryId;
              commonCountryName = data.linkedCountryName;
            } else if (data.linkedCountryId !== commonCountryId) {
              allLinkedToSame = false;
            }
          } else {
            allLinkedToSame = false;
          }
        });
        
        const padding = 1;
        minX -= padding;
        minY -= padding;
        maxX += padding;
        maxY += padding;
        
        const boxWidth = maxX - minX;
        const boxHeight = maxY - minY;
        
        if (!groupBoundingBox) {
          groupBoundingBox = g.append('rect')
            .attr('class', 'group-bounding-box')
            .style('fill', 'transparent')
            .style('stroke', '#18A0FB')
            .style('stroke-width', 0.5)
            .style('stroke-dasharray', 'none')
            .style('pointer-events', 'all')  // ✅ Permettre les clics
            .style('cursor', 'default')  // ✅ Curseur main
            .attr('rx', 1)
            .call(d3.drag()
              .on('start', function(event) {
                // ✅ Utiliser d3.pointer() pour les coordonnées dans l'espace du groupe g
                const [x, y] = d3.pointer(event, g.node());
                
                // ✅ Désactiver les transitions pendant le drag
                activeTextBoxes.forEach(textBoxNode => {
                  d3.select(textBoxNode).classed('dragging', true);
                });

                // Sauvegarder positions de départ
                const startPositions = new Map();
                activeTextBoxes.forEach(textBoxNode => {
                  const group = d3.select(textBoxNode);
                  const transform = group.attr('transform');
                  const match = transform.match(/translate\(([^,]+),([^)]+)\)/);
                  if (match) {
                    startPositions.set(textBoxNode, {
                      x: parseFloat(match[1]),
                      y: parseFloat(match[2])
                    });
                  }
                });
                this.__dragData = { 
                  startX: x,  // ✅ Coordonnées dans l'espace de g
                  startY: y,
                  startPositions: startPositions 
                };
              })
              .on('drag', function(event) {
                if (!this.__dragData) return;
                
                // ✅ Coordonnées actuelles dans l'espace du groupe g
                const [x, y] = d3.pointer(event, g.node());
                const dx = x - this.__dragData.startX;  // ✅ Delta correct
                const dy = y - this.__dragData.startY;
                
                // Déplacer toutes les zones
                activeTextBoxes.forEach(textBoxNode => {
                  const group = d3.select(textBoxNode);
                  const data = group.datum();
                  const startPos = this.__dragData.startPositions.get(textBoxNode);
                  
                  if (startPos) {
                    const newX = startPos.x + dx;
                    const newY = startPos.y + dy;
                    
                    group.attr('transform', 
                      `translate(${newX}, ${newY}) rotate(${data.rotation || 0} ${data.width/2} ${data.height/2})`
                    );
                    
                    // Mettre à jour offset pour zones liées
                    if (data.linkedCountryId) {
                      const centroid = countryCentroids.get(data.linkedCountryId);
                      if (centroid) {
                        const mapCenterX = projection([0, 0])[0];
                        const mapCenterY = projection([0, 0])[1];
                        
                        const dxCentroid = centroid[0] - mapCenterX;
                        const dyCentroid = centroid[1] - mapCenterY;
                        
                        const spacingOffsetX = dxCentroid * (currentSpacing / 100) * 0.5;
                        const spacingOffsetY = dyCentroid * (currentSpacing / 100) * 0.5;
                        
                        data.offsetX = newX - (centroid[0] + spacingOffsetX);
                        data.offsetY = newY - (centroid[1] + spacingOffsetY);
                      }
                    }
                  }
                });
                
                // Recalculer la bounding box
                updateGroupBoundingBox();
              })
              .on('end', function() {
                // ✅ Réactiver les transitions après le drag
                activeTextBoxes.forEach(textBoxNode => {
                  d3.select(textBoxNode).classed('dragging', false);
                });

                delete this.__dragData;
              })
            )
        }
        
        // Update position et taille
        groupBoundingBox
          .attr('x', minX)
          .attr('y', minY)
          .attr('width', boxWidth)
          .attr('height', boxHeight);
        
        // 🎯 Update group lock indicator
        if (allLinkedToSame && commonCountryId) {
          if (!groupLockIndicator) {
            groupLockIndicator = g.append('g')
              .attr('class', 'group-lock-indicator');
            
            groupLockIndicator.append('use')
              .attr('class', 'group-lock-icon')
              .attr('href', '#lock-closed')
              .attr('width', 3)
              .attr('height', 3.5);
            
            groupLockIndicator.append('text')
              .attr('class', 'group-country-name')
              .attr('x', 4)
              .attr('y', 2);
          }
          
          groupLockIndicator
            .attr('transform', `translate(${minX + 2}, ${minY - 5})`);
          
          groupLockIndicator.select('.group-country-name')
            .text(commonCountryName);
          
          groupLockIndicator.style('display', null);
        } else {
          if (groupLockIndicator) {
            groupLockIndicator.style('display', 'none');
          }
        }
      }
      
      function handleBackgroundClick(event) {
        if (justFinishedBoxSelection) return;
        if (isDrawingBox) return;
        
        // ✅ CORRECTION Bug #3 : Inverser la logique - vérifier si on N'a PAS cliqué sur un élément interactif
        const target = event.target;
        const isInteractiveElement = 
          target.classList.contains('country') ||
          target.classList.contains('text-box-rect') ||
          target.classList.contains('text-box-text') ||
          target.classList.contains('resize-handle') ||
          target.classList.contains('lock-indicator') ||
          target.closest('.text-box') ||
          target.closest('.lock-indicator') ||
          target.closest('.group-bounding-box');
        
        if (!isInteractiveElement) {
          // Clic sur l'arrière-plan (océan, grille, etc.)
          selectedCountries.forEach(id => {
            const element = document.querySelector(`[data-country-id="${id}"]`);
            if (element) element.classList.remove('selected');
          });
          selectedCountries.clear();
          updateBubbleState();
          
          // ✅ Désactiver toutes les zones de texte
          activeTextBoxes.forEach(textBox => {
            deactivateTextBox(d3.select(textBox));
          });
          activeTextBoxes.clear();
          updateGroupBoundingBox();
        }
      }
      
      function handleCountryClick(event, d) {
        event.stopPropagation();
        
        if (isPanMode || !isSelectionMode) return;
        
        const countryId = d.id;
        const countryElement = event.target;
        const isCtrlPressed = event.ctrlKey || event.metaKey;
        
        // ✅ Système de détection de double-clic avec sélection immédiate
        if (!countryElement._clickData) {
          countryElement._clickData = { count: 0, timeout: null, lastClickTime: 0 };
        }
        
        const now = Date.now();
        const timeSinceLastClick = now - countryElement._clickData.lastClickTime;
        
        // ✅ Si c'est un deuxième clic rapide (< 250ms) → Double-clic
        if (timeSinceLastClick < 250 && countryElement._clickData.count === 1) {
          clearTimeout(countryElement._clickData.timeout);
          countryElement._clickData.count = 0;
          
          // ✅ Créer la zone de texte liée (le pays est déjà sélectionné)
          executeDoubleClick(event, d, countryId, countryElement);
          
        } else {
          // ✅ Premier clic ou clic après délai → Sélection immédiate
          countryElement._clickData.count = 1;
          countryElement._clickData.lastClickTime = now;
          
          // ✅ Exécuter la sélection IMMÉDIATEMENT (pas de délai)
          executeSingleClick(countryId, countryElement, isCtrlPressed);
          
          // ✅ Réinitialiser le compteur après le délai
          countryElement._clickData.timeout = setTimeout(() => {
            countryElement._clickData.count = 0;
          }, 250);
        }
      }

      // ✅ Fonction pour gérer le simple clic
      function executeSingleClick(countryId, countryElement, isCtrlPressed) {
        // ✅ Désélectionner zones si clic sans Ctrl
        if (!isCtrlPressed && activeTextBoxes.size > 0) {
          activeTextBoxes.forEach(textBox => {
            deactivateTextBox(d3.select(textBox));
          });
          activeTextBoxes.clear();
          updateGroupBoundingBox();
        }
        
        if (!isCtrlPressed) {
          const isAlreadySelected = selectedCountries.has(countryId);
          const isOnlySelection = selectedCountries.size === 1 && isAlreadySelected;
          
          if (isOnlySelection) {
            selectedCountries.delete(countryId);
            countryElement.classList.remove('selected');
          } else {
            selectedCountries.forEach(id => {
              const otherElement = document.querySelector(`[data-country-id="${id}"]`);
              if (otherElement) otherElement.classList.remove('selected');
            });
            selectedCountries.clear();
            
            selectedCountries.add(countryId);
            countryElement.classList.add('selected');
          }
        } else {
          if (selectedCountries.has(countryId)) {
            selectedCountries.delete(countryId);
            countryElement.classList.remove('selected');
          } else {
            selectedCountries.add(countryId);
            countryElement.classList.add('selected');
          }
        }
        
        updateBubbleState();
        
        activeTextBoxes.forEach(textBoxNode => {
          const textBoxGroup = d3.select(textBoxNode);
          updateLockIndicator(textBoxGroup);
        });
      }

      // ✅ Fonction pour gérer le double-clic
      function executeDoubleClick(event, d, countryId, countryElement) {
        event.preventDefault();
        
        const countryName = d.properties.name;
        const centroid = countryCentroids.get(countryId);
        
        if (!centroid || isNaN(centroid[0]) || isNaN(centroid[1])) {
          console.warn('⚠️ Invalid centroid for country:', countryName);
          return;
        }
        
        // ✅ Sélectionner UNIQUEMENT ce pays
        selectedCountries.forEach(id => {
          const element = document.querySelector(`[data-country-id="${id}"]`);
          if (element) element.classList.remove('selected');
        });
        selectedCountries.clear();
        
        selectedCountries.add(countryId);
        countryElement.classList.add('selected');
        
        console.log('🔗 Creating linked text box for:', countryName);
        createTextBox(g, centroid[0], centroid[1], countryId);
        
        updateBubbleState();
      }
      
      function setupBoxSelection(svg, g) {
        let selectionBox = null;
        let startX, startY;
        
        svg.on('mousedown.boxselect', function(event) {
          if (!isSelectionMode || event.button !== 0) return;
          
          if (event.target.classList.contains('country') ||
              event.target.classList.contains('text-box-rect') ||
              event.target.classList.contains('text-box-text') ||
              event.target.classList.contains('resize-handle')) {
            return;
          }
          
          isDrawingBox = true;
          
          const transform = d3.zoomTransform(g.node());
          const [x, y] = d3.pointer(event, svg.node());
          const [transformedX, transformedY] = transform.invert([x, y]);
          
          startX = transformedX;
          startY = transformedY;
          
          selectionBox = g.append('rect')
            .attr('class', 'selection-box')
            .attr('x', startX)
            .attr('y', startY)
            .attr('width', 0)
            .attr('height', 0)
            .style('fill', 'rgba(79, 70, 229, 0.1)')
            .style('stroke', '#4F46E5')
            .style('stroke-width', 0.5)
            .style('stroke-dasharray', '2,2')
            .style('pointer-events', 'none');
          
          const mouseMoveHandler = function(e) {
            if (!isDrawingBox || !selectionBox) return;
            
            const transform = d3.zoomTransform(g.node());
            const [x, y] = d3.pointer(e, svg.node());
            const [transformedX, transformedY] = transform.invert([x, y]);
            
            const width = transformedX - startX;
            const height = transformedY - startY;
            
            selectionBox
              .attr('x', width < 0 ? transformedX : startX)
              .attr('y', height < 0 ? transformedY : startY)
              .attr('width', Math.abs(width))
              .attr('height', Math.abs(height));
          };
          
          const mouseUpHandler = function(e) {
            if (!isDrawingBox) return;
            
            e.preventDefault();
            e.stopPropagation();
            
            const transform = d3.zoomTransform(g.node());
            const [x, y] = d3.pointer(e, svg.node());
            const [transformedX, transformedY] = transform.invert([x, y]);
            
            const minX = Math.min(startX, transformedX);
            const maxX = Math.max(startX, transformedX);
            const minY = Math.min(startY, transformedY);
            const maxY = Math.max(startY, transformedY);
            
            const isCtrlPressed = e.ctrlKey || e.metaKey;
            
            if (!isCtrlPressed) {
              selectedCountries.forEach(id => {
                const element = document.querySelector(`[data-country-id="${id}"]`);
                if (element) element.classList.remove('selected');
              });
              selectedCountries.clear();
            }
            
            const zonesToSelect = [];
            const allTextBoxes = g.selectAll('.text-box');
            
            allTextBoxes.each(function(d) {
              const textBoxGroup = d3.select(this);
              const data = textBoxGroup.datum();
              
              const transform = textBoxGroup.attr('transform');
              const match = transform.match(/translate\(([^,]+),([^)]+)\)/);
              if (!match) return;
              
              const textBoxX = parseFloat(match[1]);
              const textBoxY = parseFloat(match[2]);
              const textBoxWidth = data.width;
              const textBoxHeight = data.height;
              const textBoxRight = textBoxX + textBoxWidth;
              const textBoxBottom = textBoxY + textBoxHeight;
              
              const intersects = !(textBoxRight < minX || textBoxX > maxX || 
                                  textBoxBottom < minY || textBoxY > maxY);
              
              if (intersects) {
                zonesToSelect.push(this);
              }
            });
            
            if (!isCtrlPressed) {
              activeTextBoxes.forEach(textBox => {
                d3.select(textBox).classed('active', false);
              });
              activeTextBoxes.clear();
            }
            
            zonesToSelect.forEach((textBoxNode) => {
              const textBoxGroup = d3.select(textBoxNode);
              
              if (isCtrlPressed && activeTextBoxes.has(textBoxNode)) {
                textBoxGroup.classed('active', false);
                activeTextBoxes.delete(textBoxNode);
              } else {
                textBoxGroup.classed('active', true);
                activeTextBoxes.add(textBoxNode);
              }
            });
            
            updateGroupBoundingBox();
            
            if (selectionBox) {
              selectionBox.remove();
              selectionBox = null;
            }
            
            document.removeEventListener('mousemove', mouseMoveHandler);
            document.removeEventListener('mouseup', mouseUpHandler);
            
            justFinishedBoxSelection = true;
            
            setTimeout(() => {
              isDrawingBox = false;
              justFinishedBoxSelection = false;
            }, 150);
          };
          
          document.addEventListener('mousemove', mouseMoveHandler);
          document.addEventListener('mouseup', mouseUpHandler);
        });
      }
      
      function setupTextInsertion(svg, g) {
        let clickTimeout = null;
        let clickCount = 0;
        
        svg.on('click.textinsertion', function(event) {
          if (event.target.classList && (
              event.target.classList.contains('country') ||
              event.target.classList.contains('text-box-rect') ||
              event.target.classList.contains('text-box-text') ||
              event.target.classList.contains('resize-handle')
          )) {
            return;
          }
          
          clickCount++;
          
          if (clickCount === 1) {
            clickTimeout = setTimeout(() => {
              clickCount = 0;
            }, 300);
          } else if (clickCount === 2) {
            clearTimeout(clickTimeout);
            clickCount = 0;
            event.preventDefault();
            event.stopPropagation();
            handleDoubleClick(event, svg, g);
          }
        }, true);
      }
      
      function handleDoubleClick(event, svg, g) {
        const transform = d3.zoomTransform(g.node());
        const [x, y] = d3.pointer(event, svg.node());
        const [transformedX, transformedY] = transform.invert([x, y]);
        
        createTextBox(g, transformedX, transformedY);
      }
      
      // 🎯 MODIFIED: Accept optional countryId for linking
      function createTextBox(g, x, y, countryId = null) {
        const boxWidth = 30;
        const boxHeight = 10;
        const fontSize = 5;
        
        const textBoxGroup = g.append('g')
          .attr('class', 'text-box active')
          .attr('transform', `translate(${x - boxWidth/2}, ${y - boxHeight/2})`);
        
        const rect = textBoxGroup.append('rect')
          .attr('class', 'text-box-rect')
          .attr('width', boxWidth)
          .attr('height', boxHeight)
          .attr('rx', 1)
          .on('click', function(event) {
            event.stopPropagation();
            
            const isCtrlPressed = event.ctrlKey || event.metaKey;
            
            if (!textBoxGroup.classed('active')) {
              activateTextBox(textBoxGroup, false, isCtrlPressed);
            } else if (isCtrlPressed && activeTextBoxes.has(textBoxGroup.node())) {
              deactivateTextBox(textBoxGroup);
            }
          });
        
        const text = textBoxGroup.append('text')
          .attr('class', 'text-box-text text-box-placeholder')
          .attr('x', boxWidth / 2)
          .attr('y', boxHeight / 2)
          .attr('font-size', fontSize)
          .style('font-family', 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif')
          .style('font-weight', 'normal')
          .style('font-style', 'normal')
          .style('text-decoration', 'none')
          .text('Add text')
          .on('click', function(event) {
            event.stopPropagation();
            
            const isCtrlPressed = event.ctrlKey || event.metaKey;
            
            if (!textBoxGroup.classed('active')) {
              activateTextBox(textBoxGroup, false, isCtrlPressed);
              return;
            }
            
            if (isCtrlPressed && activeTextBoxes.has(textBoxGroup.node())) {
              deactivateTextBox(textBoxGroup);
              return;
            }
            
            if (!activeTextarea && activeTextBoxes.size === 1 && !isCtrlPressed) {
              openTextEditor(textBoxGroup, text);
            }
          });
        
        textBoxGroup.datum({
          width: boxWidth,
          height: boxHeight,
          rotation: 0,
          text: '',
          fontSize: fontSize,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          fontWeight: 'normal',
          fontStyle: 'normal',
          textDecoration: 'none',
          linkedCountryId: null, // 🎯 NEW
          linkedCountryName: null, // 🎯 NEW
          baseX: null, // 🎯 NEW: Base position (centroid)
          baseY: null, // 🎯 NEW
          offsetX: null, // 🎯 NEW: User offset from centroid
          offsetY: null // 🎯 NEW
        });
        
        addManipulationHandles(textBoxGroup);
        createLockIndicator(textBoxGroup); // 🎯 NEW
        
        activeTextBoxes.add(textBoxGroup.node());
        
        // 🎯 Link to country if provided
        if (countryId) {
          linkTextBoxToCountry(textBoxGroup, countryId);
        }
        
        openTextEditor(textBoxGroup, text);
        
        makeTextBoxDraggable(textBoxGroup);
      }
      
      function activateTextBox(textBoxGroup, openEditor = false, isCtrlPressed = false) {
        if (!isCtrlPressed) {
          activeTextBoxes.forEach(textBox => {
            if (textBox !== textBoxGroup.node()) {
              deactivateTextBox(d3.select(textBox));
            }
          });
          activeTextBoxes.clear();
        }
        
        activeTextBoxes.add(textBoxGroup.node());
        textBoxGroup.classed('active', true);
        
        if (openEditor && activeTextBoxes.size === 1) {
          const textElement = textBoxGroup.select('.text-box-text');
          openTextEditor(textBoxGroup, textElement);
        }
        
        updateLockIndicator(textBoxGroup); // 🎯 Update lock state
        updateGroupBoundingBox();
      }
      
      function deactivateTextBox(textBoxGroup) {
        if (!textBoxGroup || !textBoxGroup.node()) return;
        
        if (activeTextarea && activeTextarea.textBoxGroup === textBoxGroup) {
          closeTextEditor();
        }
        
        const data = textBoxGroup.datum();
        
        // ✅ CORRECTION Bug #6 : Vérifier si vide AVANT de désactiver
        if (!data.text || data.text.trim() === '') {
          // Supprimer IMMÉDIATEMENT sans changer les classes
          textBoxGroup.remove();
          activeTextBoxes.delete(textBoxGroup.node());
          console.log('🗑️ Zone de texte vide supprimée');
          updateGroupBoundingBox();
          return;
        }
        
        // Si non vide, désactiver normalement
        textBoxGroup.classed('active', false);
        activeTextBoxes.delete(textBoxGroup.node());
        updateGroupBoundingBox();
      }
      
      function openTextEditor(textBoxGroup, textElement) {
        closeTextEditor();
        
        const data = textBoxGroup.datum();
        const transform = d3.zoomTransform(g.node());
        
        const matrix = textBoxGroup.node().getCTM();
        const x = matrix.e;
        const y = matrix.f;
        
        textElement.style('opacity', 0);
        
        const textarea = document.createElement('textarea');
        textarea.className = 'text-input-overlay';
        textarea.style.left = x + 'px';
        textarea.style.top = y + 'px';
        textarea.style.width = (data.width * transform.k) + 'px';
        textarea.style.height = (data.height * transform.k) + 'px';
        textarea.style.fontSize = (data.fontSize * transform.k) + 'px';
        textarea.style.lineHeight = (data.height * transform.k) + 'px';
        textarea.style.fontFamily = data.fontFamily || 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
        textarea.style.fontWeight = data.fontWeight || 'normal';
        textarea.style.fontStyle = data.fontStyle || 'normal';
        textarea.style.textDecoration = data.textDecoration || 'none';
        textarea.value = data.text;
        
        activeTextarea = {
          element: textarea,
          textBoxGroup: textBoxGroup,
          data: data,
          textElement: textElement
        };
        
        document.getElementById('map-container').appendChild(textarea);
        textarea.focus();
        
        if (!data.text || data.text === '') {
          textarea.select();
        }
        
        textarea.addEventListener('blur', function() {
          closeTextEditor();
        });
        
        textarea.addEventListener('keydown', function(e) {
          if (e.key === 'Escape') {
            e.preventDefault();
            closeTextEditor();
          }
          e.stopPropagation();
        });
        
        textarea.addEventListener('input', function() {
          const text = textarea.value;
          data.text = text;
          updateTextContent(textElement, text, data);
        });
        
        textarea.addEventListener('mousedown', (e) => e.stopPropagation());
        textarea.addEventListener('click', (e) => e.stopPropagation());
      }
      
      function closeTextEditor() {
        if (!activeTextarea) return;
        
        const { element, textBoxGroup, data, textElement } = activeTextarea;
        
        data.text = element.value.trim();
        updateTextContent(textElement, data.text, data);
        
        textElement.style('opacity', 1);
        
        element.remove();
        activeTextarea = null;
      }
      
      function updateTextareaPosition(textarea, textBoxGroup, data) {
        const currentTransform = d3.zoomTransform(g.node());
        const currentMatrix = textBoxGroup.node().getCTM();
        
        textarea.style.left = currentMatrix.e + 'px';
        textarea.style.top = currentMatrix.f + 'px';
        textarea.style.width = (data.width * currentTransform.k) + 'px';
        textarea.style.height = (data.height * currentTransform.k) + 'px';
        textarea.style.fontSize = (data.fontSize * currentTransform.k) + 'px';
        textarea.style.lineHeight = (data.height * currentTransform.k) + 'px';
        textarea.style.fontFamily = data.fontFamily || 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
        textarea.style.fontWeight = data.fontWeight || 'normal';
        textarea.style.fontStyle = data.fontStyle || 'normal';
        textarea.style.textDecoration = data.textDecoration || 'none';
      }
      
      function updateTextContent(textElement, text, data) {
        if (!text || text.trim() === '') {
          textElement
            .classed('text-box-placeholder', true)
            .text('Add text');
        } else {
          textElement
            .classed('text-box-placeholder', false)
            .text(text);
        }
      }
      
      function addManipulationHandles(textBoxGroup) {
        const data = textBoxGroup.datum();
        
        textBoxGroup.selectAll('.resize-handle').remove();
        
        const handles = [
          { pos: 'nw', x: 0, y: 0 },
          { pos: 'ne', x: data.width, y: 0 },
          { pos: 'se', x: data.width, y: data.height },
          { pos: 'sw', x: 0, y: data.height }
        ];
        
        handles.forEach(h => {
          textBoxGroup.append('rect')
            .attr('class', `resize-handle ${h.pos}`)
            .attr('x', h.x - 1.5)
            .attr('y', h.y - 1.5)
            .attr('width', 3)
            .attr('height', 3)
            .attr('rx', 0.3)
            .call(makeResizeHandle(textBoxGroup, h.pos));
        });
      }
      
      // 🎯 MODIFIED: Update offset when dragging linked text box
      function makeTextBoxDraggable(textBoxGroup) {
        let isDragging = false;
        let startX, startY;
        let startPositions = new Map();
        
        const dragElements = [textBoxGroup.select('.text-box-rect'), textBoxGroup.select('.text-box-text')];
        
        dragElements.forEach(element => {
          element.on('mousedown.drag', function(event) {
            if (!textBoxGroup.classed('active')) return;
            if (activeTextarea) return;
            if (isResizingGlobal) return;
            
            isDragging = true;
            startX = event.x;
            startY = event.y;
            
            // ✅ Désactiver les transitions pendant le drag
            activeTextBoxes.forEach(textBoxNode => {
              d3.select(textBoxNode).classed('dragging', true);
            });
            
            startPositions.clear();
            activeTextBoxes.forEach(textBoxNode => {
              const group = d3.select(textBoxNode);
              const transform = group.attr('transform');
              const match = transform.match(/translate\(([^,]+),([^)]+)\)/);
              if (match) {
                startPositions.set(textBoxNode, {
                  x: parseFloat(match[1]),
                  y: parseFloat(match[2])
                });
              }
            });
            
            event.stopPropagation();
            
            const onMouseMove = function(e) {
              if (isDragging && !isResizingGlobal) {
                const scale = d3.zoomTransform(g.node()).k;
                const dx = (e.x - startX) / scale;
                const dy = (e.y - startY) / scale;
                
                activeTextBoxes.forEach(textBoxNode => {
                  const group = d3.select(textBoxNode);
                  const data = group.datum();
                  const currentRotation = data.rotation || 0;
                  const startPos = startPositions.get(textBoxNode);
                  
                  if (startPos) {
                    const newX = startPos.x + dx;
                    const newY = startPos.y + dy;
                    
                    group.attr('transform', 
                      `translate(${newX}, ${newY}) rotate(${currentRotation} ${data.width/2} ${data.height/2})`
                    );
                    
                    if (data.linkedCountryId) {
                      const centroid = countryCentroids.get(data.linkedCountryId);
                      if (centroid) {
                        const mapCenterX = projection([0, 0])[0];
                        const mapCenterY = projection([0, 0])[1];
                        
                        const dx = centroid[0] - mapCenterX;
                        const dy = centroid[1] - mapCenterY;
                        
                        const spacingOffsetX = dx * (currentSpacing / 100) * 0.5;
                        const spacingOffsetY = dy * (currentSpacing / 100) * 0.5;
                        
                        data.offsetX = newX - (centroid[0] + spacingOffsetX);
                        data.offsetY = newY - (centroid[1] + spacingOffsetY);
                      }
                    }
                  }
                });
                
                updateGroupBoundingBox();
                
                if (activeTextarea && activeTextBoxes.has(activeTextarea.textBoxGroup.node())) {
                  updateTextareaPosition(activeTextarea.element, activeTextarea.textBoxGroup, activeTextarea.data);
                }
              }
            };
            
            const onMouseUp = function() {
              isDragging = false;
              startPositions.clear();
              
              // ✅ Réactiver les transitions après le drag
              activeTextBoxes.forEach(textBoxNode => {
                d3.select(textBoxNode).classed('dragging', false);
              });
              
              document.removeEventListener('mousemove', onMouseMove);
              document.removeEventListener('mouseup', onMouseUp);
            };
            
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
          });
        });
      }
      
      function makeResizeHandle(textBoxGroup, position) {
        return function(selection) {
          selection.on('mousedown', function(event) {
            event.stopPropagation();
            event.preventDefault();
            
            isResizingGlobal = true;
            
            // ✅ Désactiver les transitions pendant le resize
            textBoxGroup.classed('dragging', true);
            
            let isResizing = true;
            const startX = event.clientX;
            const startY = event.clientY;
            
            const data = textBoxGroup.datum();
            const startWidth = data.width;
            const startHeight = data.height;
            
            const transform = textBoxGroup.attr('transform');
            const match = transform.match(/translate\(([^,]+),([^)]+)\)/);
            let startTransformX = 0;
            let startTransformY = 0;
            if (match) {
              startTransformX = parseFloat(match[1]);
              startTransformY = parseFloat(match[2]);
            }
            
            const mouseMoveHandler = function(e) {
              if (!isResizing) return;
              
              const scale = d3.zoomTransform(g.node()).k;
              const dx = (e.clientX - startX) / scale;
              const dy = (e.clientY - startY) / scale;
              
              let newWidth = startWidth;
              let newHeight = startHeight;
              let newX = startTransformX;
              let newY = startTransformY;
              
              if (position.includes('e')) {
                newWidth = Math.max(15, startWidth + dx);
              }
              if (position.includes('w')) {
                const targetWidth = startWidth - dx;
                if (targetWidth >= 15) {
                  newWidth = targetWidth;
                  newX = startTransformX + dx;
                } else {
                  newWidth = 15;
                  newX = startTransformX + (startWidth - 15);
                }
              }
              if (position.includes('s')) {
                newHeight = Math.max(5, startHeight + dy);
              }
              if (position.includes('n')) {
                const targetHeight = startHeight - dy;
                if (targetHeight >= 5) {
                  newHeight = targetHeight;
                  newY = startTransformY + dy;
                } else {
                  newHeight = 5;
                  newY = startTransformY + (startHeight - 5);
                }
              }
              
              data.width = newWidth;
              data.height = newHeight;
              
              textBoxGroup.attr('transform', 
                `translate(${newX}, ${newY}) rotate(${data.rotation || 0} ${newWidth/2} ${newHeight/2})`
              );
              
              // ✅ CORRECTION : Mettre à jour les offsets si zone liée
              if (data.linkedCountryId) {
                const centroid = countryCentroids.get(data.linkedCountryId);
                if (centroid) {
                  const mapCenterX = projection([0, 0])[0];
                  const mapCenterY = projection([0, 0])[1];
                  
                  const dx = centroid[0] - mapCenterX;
                  const dy = centroid[1] - mapCenterY;
                  
                  const spacingOffsetX = dx * (currentSpacing / 100) * 0.5;
                  const spacingOffsetY = dy * (currentSpacing / 100) * 0.5;
                  
                  // Mettre à jour les offsets en fonction de la nouvelle position
                  data.offsetX = newX - (centroid[0] + spacingOffsetX);
                  data.offsetY = newY - (centroid[1] + spacingOffsetY);
                }
              }
              
              textBoxGroup.select('.text-box-rect')
                .attr('width', newWidth)
                .attr('height', newHeight);
              
              const textElement = textBoxGroup.select('.text-box-text');
              textElement
                .attr('x', newWidth / 2)
                .attr('y', newHeight / 2);
              
              updateHandles(textBoxGroup);
              
              // 🎯 Update lock indicator position
              textBoxGroup.select('.lock-indicator')
                .attr('transform', `translate(4, -4)`); // ✅ Reste fixe en haut à gauche
              
              if (activeTextBoxes.size > 1) {
                updateGroupBoundingBox();
              }
              
              if (activeTextarea && activeTextarea.textBoxGroup === textBoxGroup) {
                updateTextareaPosition(activeTextarea.element, textBoxGroup, data);
              }
            };
            
            const mouseUpHandler = function() {
              isResizing = false;
              isResizingGlobal = false;
              
              // ✅ Réactiver les transitions après le resize
              textBoxGroup.classed('dragging', false);
              
              document.removeEventListener('mousemove', mouseMoveHandler);
              document.removeEventListener('mouseup', mouseUpHandler);
            };
            
            document.addEventListener('mousemove', mouseMoveHandler);
            document.addEventListener('mouseup', mouseUpHandler);
          });
        };
      }
      
      function updateHandles(textBoxGroup) {
        const data = textBoxGroup.datum();
        
        const handlePositions = {
          nw: { x: 0, y: 0 },
          ne: { x: data.width, y: 0 },
          se: { x: data.width, y: data.height },
          sw: { x: 0, y: data.height }
        };
        
        Object.entries(handlePositions).forEach(([pos, coords]) => {
          const handle = textBoxGroup.select(`.resize-handle.${pos}`);
          if (handle.node()) {
            handle.attr('x', coords.x - 1.5).attr('y', coords.y - 1.5);
          }
        });
      }
      
      document.addEventListener('keydown', function(event) {
        if (event.key === 'Delete' || event.key === 'Backspace') {
          if (activeTextBoxes.size > 0 && !activeTextarea) {
            event.preventDefault();
            const boxesToDelete = Array.from(activeTextBoxes);
            boxesToDelete.forEach(textBox => {
              d3.select(textBox).remove();
            });
            activeTextBoxes.clear();
            updateGroupBoundingBox();
          }
        }
      });
      
      function applyColorToCountry(countryId, color) {
        const countryElement = document.querySelector(`[data-country-id="${countryId}"]`);
        if (countryElement) {
          countryElement.style.fill = color;
          countryElement.classList.add('colored');
          countryColors.set(countryId, color);
        }
      }
      
      function applyColorToSelected(color) {
        selectedCountries.forEach(countryId => {
          applyColorToCountry(countryId, color);
        });
      }
      
      function applyStrokeToSelected(strokeColor) {
        const inputElement = document.getElementById('stroke-width-input');
        const currentWidth = inputElement && inputElement.value ? inputElement.value : '0.8';
        
        selectedCountries.forEach(countryId => {
          const countryElement = document.querySelector(`[data-country-id="${countryId}"]`);
          if (countryElement) {
            if (strokeColor === 'transparent' || strokeColor === 'none') {
              countryElement.style.stroke = 'none';
              countryStrokes.delete(countryId);
            } else {
              countryElement.style.stroke = strokeColor;
              countryElement.style.strokeWidth = currentWidth;
              countryStrokes.set(countryId, strokeColor);
            }
          }
        });
      }
      
      function updateStrokeWidth(width) {
        if (!width || width === 'undefined') return;
        selectedCountries.forEach(countryId => {
          const countryElement = document.querySelector(`[data-country-id="${countryId}"]`);
          if (countryElement && countryElement.style.stroke && countryElement.style.stroke !== 'none') {
            countryElement.style.strokeWidth = width;
          }
        });
      }
      
      function clearSelection() {
        document.querySelectorAll('.country.selected').forEach(el => {
          el.classList.remove('selected');
        });
        selectedCountries.clear();
        updateBubbleState();
      }
      
      function resetAllColors() {
        document.querySelectorAll('.country.colored').forEach(el => {
          el.style.fill = '';
          el.classList.remove('colored');
        });
        countryColors.clear();
      }
      
      function updateBubbleState() {
        window.selectedCountriesData = Array.from(selectedCountries).map(id => {
          const element = document.querySelector(`[data-country-id="${id}"]`);
          return {
            id: id,
            name: element ? element.getAttribute('data-country-name') : '',
            color: countryColors.get(id) || CONFIG.defaultColor,
            stroke: countryStrokes.get(id) || CONFIG.borderColor
          };
        });
      }
      
      window.updateSliderFromBubble = function(value) {
        const slider = document.getElementById('country-spacing-slider');
        if (slider) {
          slider.value = value;
          
          const percentage = value;
          slider.style.background = `linear-gradient(to right, #3cf19a 0%, #3cf19a ${percentage}%, #E5E7EB ${percentage}%, #E5E7EB 100%)`;
          
          applyCountrySpacing(value);
          currentSpacing = value;
          
          console.log('🎛️ Slider mis à jour depuis Bubble:', value + '%');
        } else {
          console.warn('⚠️ Slider non trouvé pour mise à jour');
        }
      };
      
      // 🎯 NEW: Update visibility when countries are hidden/shown
      window.showCountriesOnMap = function(countryNames) {
        if (!Array.isArray(countryNames)) {
          console.warn('⚠️ showCountriesOnMap: countryNames doit être un tableau');
          return;
        }
        
        let showCount = 0;
        
        // Pour chaque pays demandé, on affiche aussi ses territoires fusionnés
        const allCountriesToShow = [];
        countryNames.forEach(countryName => {
          allCountriesToShow.push(countryName);
          // Si ce pays a des territoires fusionnés, on les ajoute
          if (COUNTRY_FUSIONS[countryName]) {
            allCountriesToShow.push(...COUNTRY_FUSIONS[countryName]);
          }
        });
        
        allCountriesToShow.forEach(countryName => {
          const countryElement = document.querySelector(`[data-country-name="${countryName}"]`);
          if (countryElement) {
            countryElement.classList.remove('hidden');
            const countryId = countryElement.getAttribute('data-country-id');
            hiddenCountries.delete(countryId);
            showCount++;
          }
        });
        
        // Update linked text boxes visibility
        g.selectAll('.text-box').each(function() {
          const textBoxGroup = d3.select(this);
          updateLinkedTextBoxVisibility(textBoxGroup);
        });
        
        console.log('👁️ Affichage de', showCount, 'pays sur la carte');
      };

      
      window.hideCountriesOnMap = function(countryNames) {
        if (!Array.isArray(countryNames)) {
          console.warn('⚠️ hideCountriesOnMap: countryNames doit être un tableau');
          return;
        }
        
        let hideCount = 0;
        
        // Pour chaque pays demandé, on cache aussi ses territoires fusionnés
        const allCountriesToHide = [];
        countryNames.forEach(countryName => {
          allCountriesToHide.push(countryName);
          // Si ce pays a des territoires fusionnés, on les ajoute
          if (COUNTRY_FUSIONS[countryName]) {
            allCountriesToHide.push(...COUNTRY_FUSIONS[countryName]);
          }
        });
        
        allCountriesToHide.forEach(countryName => {
          const countryElement = document.querySelector(`[data-country-name="${countryName}"]`);
          if (countryElement) {
            countryElement.classList.add('hidden');
            const countryId = countryElement.getAttribute('data-country-id');
            hiddenCountries.add(countryId);
            hideCount++;
          }
        });
        
        // Update linked text boxes visibility
        g.selectAll('.text-box').each(function() {
          const textBoxGroup = d3.select(this);
          updateLinkedTextBoxVisibility(textBoxGroup);
        });
        
        console.log('🙈 Masquage de', hideCount, 'pays sur la carte');
      };
      
      window.mapFunctions = {
        applyColorToSelected: applyColorToSelected,
        applyStrokeToSelected: applyStrokeToSelected,
        updateStrokeWidth: updateStrokeWidth,
        clearSelection: clearSelection,
        resetAllColors: resetAllColors,
        getSelectedCountries: () => window.selectedCountriesData || [],
        
        applyCountrySpacing: applyCountrySpacing,
        
        showCountriesOnMap: window.showCountriesOnMap,
        hideCountriesOnMap: window.hideCountriesOnMap,
        
        zoomIn: function() {
          svg.transition().duration(300).call(zoom.scaleBy, 1.2);
        },
        
        zoomOut: function() {
          svg.transition().duration(300).call(zoom.scaleBy, 0.833);
        },
        
        resetZoom: function() {
          svg.transition().duration(500).call(zoom.transform, d3.zoomIdentity);
        },
        
        activatePanMode: function() {
          isPanMode = true;
          isSelectionMode = false;
          svg.style('cursor', 'grab');
          g.selectAll('.country').style('pointer-events', 'none').style('cursor', 'grab');
          console.log('🖐️ Mode Pan activé');
        },
        
        activateSelectionMode: function() {
          isSelectionMode = true;
          isPanMode = false;
          svg.style('cursor', 'default');
          g.selectAll('.country').style('pointer-events', 'auto').style('cursor', 'pointer');
          console.log('👆 Mode Select activé');
        },
        
        togglePanMode: function() {
          isPanMode = !isPanMode;
          isSelectionMode = !isPanMode;
          
          if (isPanMode) {
            svg.style('cursor', 'grab');
            g.selectAll('.country').style('pointer-events', 'none').style('cursor', 'grab');
          } else {
            svg.style('cursor', 'default');
            g.selectAll('.country').style('pointer-events', 'auto').style('cursor', 'pointer');
          }
        },
        
        toggleSelectionMode: function() {
          isSelectionMode = !isSelectionMode;
          isPanMode = !isSelectionMode;
          
          if (isSelectionMode) {
            g.selectAll('.country').style('pointer-events', 'auto').style('cursor', 'pointer');
            svg.style('cursor', 'default');
          } else {
            g.selectAll('.country').style('pointer-events', 'none').style('cursor', 'grab');
            svg.style('cursor', 'grab');
          }
        },
        
        applyFontSizeToSelected: function(fontSize) {
          if (activeTextBoxes.size === 0) return;
          const size = typeof fontSize === 'string' ? parseFloat(fontSize) : fontSize;
          if (isNaN(size) || size < 1 || size > 200) return;
          
          activeTextBoxes.forEach(textBoxNode => {
            const textBoxGroup = d3.select(textBoxNode);
            const data = textBoxGroup.datum();
            data.fontSize = size;
            textBoxGroup.select('.text-box-text').attr('font-size', size);
          });
          
          if (activeTextarea && activeTextBoxes.has(activeTextarea.textBoxGroup.node())) {
            const transform = d3.zoomTransform(g.node());
            activeTextarea.element.style.fontSize = (size * transform.k) + 'px';
          }
        },
        
        applyFontToSelected: function(fontFamily) {
          if (activeTextBoxes.size === 0 || !fontFamily || fontFamily.trim() === '') return;
          
          activeTextBoxes.forEach(textBoxNode => {
            const textBoxGroup = d3.select(textBoxNode);
            const data = textBoxGroup.datum();
            data.fontFamily = fontFamily;
            textBoxGroup.select('.text-box-text').style('font-family', fontFamily);
          });
          
          if (activeTextarea && activeTextBoxes.has(activeTextarea.textBoxGroup.node())) {
            activeTextarea.element.style.fontFamily = fontFamily;
          }
        },
        
        applyBoldToSelected: function(isBold) {
          if (activeTextBoxes.size === 0) return;
          const weight = isBold ? 'bold' : 'normal';
          
          activeTextBoxes.forEach(textBoxNode => {
            const textBoxGroup = d3.select(textBoxNode);
            const data = textBoxGroup.datum();
            data.fontWeight = weight;
            textBoxGroup.select('.text-box-text').style('font-weight', weight);
          });
          
          if (activeTextarea && activeTextBoxes.has(activeTextarea.textBoxGroup.node())) {
            activeTextarea.element.style.fontWeight = weight;
          }
        },
        
        applyItalicToSelected: function(isItalic) {
          if (activeTextBoxes.size === 0) return;
          const style = isItalic ? 'italic' : 'normal';
          
          activeTextBoxes.forEach(textBoxNode => {
            const textBoxGroup = d3.select(textBoxNode);
            const data = textBoxGroup.datum();
            data.fontStyle = style;
            textBoxGroup.select('.text-box-text').style('font-style', style);
          });
          
          if (activeTextarea && activeTextBoxes.has(activeTextarea.textBoxGroup.node())) {
            activeTextarea.element.style.fontStyle = style;
          }
        },
        
        applyUnderlineToSelected: function(isUnderline) {
          if (activeTextBoxes.size === 0) return;
          const decoration = isUnderline ? 'underline' : 'none';
          
          activeTextBoxes.forEach(textBoxNode => {
            const textBoxGroup = d3.select(textBoxNode);
            const data = textBoxGroup.datum();
            data.textDecoration = decoration;
            textBoxGroup.select('.text-box-text').style('text-decoration', decoration);
          });
          
          if (activeTextarea && activeTextBoxes.has(activeTextarea.textBoxGroup.node())) {
            activeTextarea.element.style.textDecoration = decoration;
          }
        },
        
        previewFont: function(fontFamily) {
          if (activeTextBoxes.size === 0) return;
          
          if (!window.originalFonts) {
            window.originalFonts = new Map();
            activeTextBoxes.forEach(textBoxNode => {
              const textBoxGroup = d3.select(textBoxNode);
              const data = textBoxGroup.datum();
              window.originalFonts.set(textBoxNode, data.fontFamily);
            });
          }
          
          activeTextBoxes.forEach(textBoxNode => {
            const textBoxGroup = d3.select(textBoxNode);
            textBoxGroup.select('.text-box-text').style('font-family', fontFamily);
          });
          
          if (activeTextarea && activeTextBoxes.has(activeTextarea.textBoxGroup.node())) {
            activeTextarea.element.style.fontFamily = fontFamily;
          }
        },
        
        restoreFont: function() {
          if (!window.originalFonts || activeTextBoxes.size === 0) return;
          
          activeTextBoxes.forEach(textBoxNode => {
            const textBoxGroup = d3.select(textBoxNode);
            const originalFont = window.originalFonts.get(textBoxNode);
            if (originalFont) {
              textBoxGroup.select('.text-box-text').style('font-family', originalFont);
            }
          });
          
          if (activeTextarea && activeTextBoxes.has(activeTextarea.textBoxGroup.node())) {
            const textBoxNode = activeTextarea.textBoxGroup.node();
            const originalFont = window.originalFonts.get(textBoxNode);
            if (originalFont) {
              activeTextarea.element.style.fontFamily = originalFont;
            }
          }
          
          window.originalFonts = null;
        },
        
        previewFontSize: function(fontSize) {
          if (activeTextBoxes.size === 0) return;
          const size = typeof fontSize === 'string' ? parseFloat(fontSize) : fontSize;
          if (isNaN(size)) return;
          
          if (!window.originalSizes) {
            window.originalSizes = new Map();
            activeTextBoxes.forEach(textBoxNode => {
              const textBoxGroup = d3.select(textBoxNode);
              const data = textBoxGroup.datum();
              window.originalSizes.set(textBoxNode, data.fontSize);
            });
          }
          
          activeTextBoxes.forEach(textBoxNode => {
            const textBoxGroup = d3.select(textBoxNode);
            textBoxGroup.select('.text-box-text').attr('font-size', size);
          });
          
          if (activeTextarea && activeTextBoxes.has(activeTextarea.textBoxGroup.node())) {
            const transform = d3.zoomTransform(g.node());
            activeTextarea.element.style.fontSize = (size * transform.k) + 'px';
          }
        },
        
        restoreFontSize: function() {
          if (!window.originalSizes || activeTextBoxes.size === 0) return;
          
          activeTextBoxes.forEach(textBoxNode => {
            const textBoxGroup = d3.select(textBoxNode);
            const originalSize = window.originalSizes.get(textBoxNode);
            if (originalSize !== undefined) {
              textBoxGroup.select('.text-box-text').attr('font-size', originalSize);
            }
          });
          
          if (activeTextarea && activeTextBoxes.has(activeTextarea.textBoxGroup.node())) {
            const textBoxNode = activeTextarea.textBoxGroup.node();
            const originalSize = window.originalSizes.get(textBoxNode);
            if (originalSize !== undefined) {
              const transform = d3.zoomTransform(g.node());
              activeTextarea.element.style.fontSize = (originalSize * transform.k) + 'px';
            }
          }
          
          window.originalSizes = null;
        },
        
        changeDetailLevel: function(level) {
          console.log('🔄 Changement de niveau de détail vers:', level);
          
          const currentZoom = d3.zoomTransform(svg.node());
          const savedColors = new Map(countryColors);
          const savedStrokes = new Map(countryStrokes);
          const savedSelection = new Set(selectedCountries);
          const savedSpacing = currentSpacing;
          
          const loadingEl = svg.append('text')
            .attr('x', width / 2)
            .attr('y', height / 2)
            .attr('text-anchor', 'middle')
            .attr('font-size', 20)
            .attr('fill', '#6B7280')
            .text('Loading ' + level + '...');
          
          const url = `https://cdn.jsdelivr.net/npm/world-atlas@2/countries-${level}.json`;
          
          console.log('📥 Téléchargement depuis:', url);
          
          d3.json(url)
            .then(data => {
              console.log('📦 Données reçues:', data);
              
              if (!data || !data.objects || !data.objects.countries) {
                throw new Error('Format de données invalide');
              }
              
              loadingEl.text('Parsing...');
              
              setTimeout(() => {
                try {
                  const countries = topojson.feature(data, data.objects.countries);
                  console.log('🗺️ Features extraites:', countries.features.length);
                  
                  const filteredFeatures = countries.features.filter(d => {
                    const name = d.properties.name || '';
                    const id = d.id;
                    
                    if (name === 'Antarctica' || name === 'Antarctique') {
                      console.log('❄️ Antarctique exclu:', id, name);
                      return false;
                    }
                    
                    if (level === '10m' && (id === '462' || id === 462 || name === 'Maldives')) {
                      console.log('🏝️ Maldives exclu (résolution 10m):', id, name);
                      return false;
                    }
                    
                    if (!d.geometry || !d.geometry.coordinates) {
                      console.log('⚠️ Géométrie invalide exclue:', id, name);
                      return false;
                    }
                    
                    try {
                      const bounds = path.bounds(d);
                      const width = bounds[1][0] - bounds[0][0];
                      const height = bounds[1][1] - bounds[0][1];
                      
                      if (width > 5000 || height > 5000) {
                        console.log('🚫 Géométrie trop grande exclue:', id, name, Math.round(width) + 'x' + Math.round(height) + 'px');
                        return false;
                      }
                    } catch (e) {
                      console.log('❌ Erreur lors du calcul bounds, pays exclu:', id, name);
                      return false;
                    }
                    
                    return true;
                  });
                  
                  console.log('🗺️ Features après filtrage:', filteredFeatures.length);
                  
                  loadingEl.text('Drawing...');
                  
                  g.selectAll('.country').remove();
                  
                  countryCentroids.clear();
                  
                  const paths = g.selectAll('path.country')
                    .data(filteredFeatures)
                    .enter()
                    .append('path')
                    .attr('class', 'country')
                    .attr('d', path)
                    .attr('data-country-id', d => d.id)
                    .attr('data-country-name', d => d.properties.name)
                    .on('click', handleCountryClick);
                  
                  if (level === '10m') {
                    paths.style('stroke-width', '0.4');
                  }
                  
                  console.log('✏️ Chemins dessinés:', paths.size());
                  
                  paths.each(function(d) {
                    const countryId = d.id;
                    const centroid = path.centroid(d);
                    
                    if (isNaN(centroid[0]) || isNaN(centroid[1])) {
                      console.warn('⚠️ Centroid invalide pour pays:', countryId);
                      return;
                    }
                    
                    countryCentroids.set(countryId, centroid);
                    
                    if (savedColors.has(countryId)) {
                      const color = savedColors.get(countryId);
                      applyColorToCountry(countryId, color);
                    }
                    
                    if (savedStrokes.has(countryId)) {
                      const strokeColor = savedStrokes.get(countryId);
                      const element = document.querySelector(`[data-country-id="${countryId}"]`);
                      if (element) {
                        element.style.stroke = strokeColor;
                        const inputElement = document.getElementById('stroke-width-input');
                        const currentWidth = inputElement && inputElement.value ? inputElement.value : '0.8';
                        element.style.strokeWidth = currentWidth;
                        countryStrokes.set(countryId, strokeColor);
                      }
                    }
                    
                    if (savedSelection.has(countryId)) {
                      selectedCountries.add(countryId);
                      const element = document.querySelector(`[data-country-id="${countryId}"]`);
                      if (element) element.classList.add('selected');
                    }
                  });
                  
                  if (savedSpacing > 0) {
                    applyCountrySpacing(savedSpacing);
                  }
                  
                  svg.call(zoom.transform, currentZoom);
                  
                  loadingEl.remove();
                  
                  console.log('✅ Niveau de détail changé:', level, '(' + countryCentroids.size, 'pays)');
                  updateBubbleState();
                  
                } catch (renderError) {
                  console.error('❌ Erreur de rendu:', renderError);
                  loadingEl.text('Erreur de rendu: ' + renderError.message);
                  setTimeout(() => loadingEl.remove(), 3000);
                }
              }, 100);
            })
            .catch(error => {
              console.error('❌ Erreur lors du chargement:', error);
              loadingEl.text('Erreur: ' + error.message);
              setTimeout(() => loadingEl.remove(), 3000);
            });
        }
      };
      
      console.log('✅ MapFlow initialisé - prêt pour connexion Bubble');
    }
    
    initMap();
  </script>
</body>
</html>