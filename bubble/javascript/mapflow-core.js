<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    /* ✅ BLOQUER NAVIGATION SWIPE - CSS NIVEAU */
    body {
      overscroll-behavior-x: none; /* Empêche retour/avant arrière swipe */
      overscroll-behavior-y: auto; /* Garde scroll vertical normal */
    }

    /* 🚀 GPU ACCELERATION - Groupe racine uniquement */
    #map-container svg > g,
    .layers-container {
      will-change: transform;
    }
    /* PAS .countries-layer → trop de modifications de fill */
    
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
      overscroll-behavior: none; /* Double sécurité sur container */
      touch-action: pan-y pinch-zoom; /* ✅ CRITIQUE : Bloque pan-x natif */
    }
    
    svg {
      touch-action: pan-y pinch-zoom; /* ✅ CRITIQUE : Bloque pan-x natif sur SVG aussi */
    }
    
    .country {
      fill: #E5E7EB;
      stroke: #FFFFFF;
      stroke-width: 0.2;
      cursor: pointer;
      transition: none;
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

    
    
    /* 🎯 STYLE POUR LES PAYS CACHÉS */
    .country.hidden {
      display: none;
      pointer-events: none;
    }

    /* 🗺️ STYLES POUR LES LAYERS */
    .layer-region {
      fill: rgba(156, 163, 175, 0.3);
      stroke: #FFFFFF;
      stroke-width: 0.2;
      cursor: pointer;
      transition: none;
      pointer-events: all;
      display: none; /* ✅ Par défaut caché */
    }

    .layer-region:hover {
      fill: #FAFAFA !important;
      stroke: #6B7280 !important;
      stroke-width: 0.2 !important;
    }

    .layer-region.selected {
      stroke: #4F46E5 !important;
      stroke-width: 0.2 !important;
      stroke-linecap: round !important;
      stroke-linejoin: round !important;
    }

    .layer-region.colored {
      /* Pas de stroke-width forcé, laissé à JavaScript */
    }

    .layer-lake {
      fill: #60A5FA;
      stroke: none; /* ✅ Pas de stroke par défaut */
      stroke-width: 0;
      cursor: pointer;
      transition: none;
      pointer-events: all;
      display: none; /* ✅ Par défaut caché */
    }

    .layer-lake:hover {
      fill: #3B82F6;
      stroke: #1E40AF;
      stroke-width: 0.5; /* ✅ 0.5px au hover */
    }

    .layer-lake.selected {
      stroke: #4F46E5 !important;
      stroke-width: 0.2 !important; /* ✅ 0.2px très fin */
    }

    .layer-river {
      fill: none;
      stroke: none;
      stroke-width: 0.2; /* ✅ 0.2px très fin */
      cursor: pointer;
      transition: none;
      pointer-events: all;
      display: none; /* ✅ Par défaut caché */
    }

    .layer-river:hover {
      stroke: #3B82F6;
      stroke-width: 0.5; /* ✅ 0.5px au hover */
    }

    .layer-river.selected {
      stroke: #4F46E5 !important;
      stroke-width: 0.2 !important; /* ✅ 0.2px très fin */
    }

    .layer-capital {
      cursor: pointer;
      transition: none;
      pointer-events: all;
      display: none; /* ✅ Par défaut caché */
    }

    .layer-capital circle {
      fill: #EF4444;
      stroke: #FFFFFF;
      stroke-width: 0.2; /* ✅ Réduit de 0.3 → 0.2 */
    }

    .layer-capital:hover circle {
      fill: #DC2626;
      stroke-width: 0.3; /* ✅ Légèrement plus épais au hover */
    }

    .layer-capital.selected circle {
      fill: #EF4444 !important; /* ✅ Garde le fill rouge */
      stroke: #4F46E5 !important; /* ✅ Stroke violet */
      stroke-width: 0.2 !important; /* ✅ Fin et précis */
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
      stroke-width: 1.5;
      stroke-dasharray: none;
      pointer-events: all;
      vector-effect: non-scaling-stroke;
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
      stroke-width: 1.5;
      opacity: 0;
      cursor: nwse-resize;
      pointer-events: none;
      vector-effect: non-scaling-stroke;
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
      font-size: 8px;
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
      box-shadow: 0.2s 4px rgba(0,0,0,0.1);
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

      // 🗺️ CONFIGURATION DES LAYERS
      const LAYER_CONFIGS = {
        regions: {
          name: 'Regions',
          urls: {
            '110m': 'https://cdn.jsdelivr.net/gh/nvkelso/natural-earth-vector@master/geojson/ne_110m_admin_1_states_provinces.geojson',
            '50m': 'https://cdn.jsdelivr.net/gh/nvkelso/natural-earth-vector@master/geojson/ne_50m_admin_1_states_provinces.geojson',
            '10m': 'https://cdn.jsdelivr.net/gh/nvkelso/natural-earth-vector@master/geojson/ne_10m_admin_1_states_provinces.geojson'
          },
          className: 'layer-region',
          type: 'polygon',
          defaultStyle: { fill: 'rgba(156, 163, 175, 0.3)', stroke: '#FFFFFF', strokeWidth: 0.2 },
          loaded: false,
          data: null,
          getParentCountry: (d) => {
            // ✅ Essayer toutes les variantes possibles
            return d.properties.adm0_a3 || 
                   d.properties.ADM0_A3 || 
                   d.properties.iso_a2 || 
                   d.properties.ISO_A2 ||
                   d.id ||
                   null;
          }
        },
        lakes: {
          name: 'Lakes',
          urls: {
            '110m': 'https://cdn.jsdelivr.net/gh/nvkelso/natural-earth-vector@master/geojson/ne_110m_lakes.geojson',
            '50m': 'https://cdn.jsdelivr.net/gh/nvkelso/natural-earth-vector@master/geojson/ne_50m_lakes.geojson',
            '10m': 'https://cdn.jsdelivr.net/gh/nvkelso/natural-earth-vector@master/geojson/ne_10m_lakes.geojson'
          },
          className: 'layer-lake',
          type: 'polygon',
          defaultStyle: { fill: '#60A5FA', stroke: 'none', strokeWidth: 0 }, // ✅ Pas de stroke par défaut
          loaded: false,
          data: null,
          getParentCountry: (d) => {
            // Priorité 1 : Attribution manuelle
            const name = d.properties?.name;
            if (name && window.getManualAttribution) {
              const manual = window.getManualAttribution(name, 'lakes');
              if (manual) return Array.isArray(manual) ? manual[0] : manual;
            }
            // Priorité 2 : Propriété "admin" si disponible
            if (d.properties.admin && countryNameToCode.has(d.properties.admin)) {
              return countryNameToCode.get(d.properties.admin);
            }
            // Priorité 3 : Point-in-polygon automatique
            return guessCountryFromGeometry(d);
          }
        },
        rivers: {
          name: 'Rivers',
          urls: {
            '110m': 'https://cdn.jsdelivr.net/gh/nvkelso/natural-earth-vector@master/geojson/ne_110m_rivers_lake_centerlines.geojson',
            '50m': 'https://cdn.jsdelivr.net/gh/nvkelso/natural-earth-vector@master/geojson/ne_50m_rivers_lake_centerlines.geojson',
            '10m': 'https://cdn.jsdelivr.net/gh/nvkelso/natural-earth-vector@master/geojson/ne_10m_rivers_lake_centerlines.geojson'
          },
          className: 'layer-river',
          type: 'line',
          defaultStyle: { fill: 'none', stroke: '#60A5FA', strokeWidth: 0.2 }, // ✅ 0.2px très fin
          loaded: false,
          data: null,
          getParentCountry: (d) => {
            // Priorité 1 : Attribution manuelle
            const name = d.properties?.name;
            if (name && window.getManualAttribution) {
              const manual = window.getManualAttribution(name, 'rivers');
              if (manual) return Array.isArray(manual) ? manual[0] : manual; // Si multi-pays, prendre le premier
            }
            // Priorité 2 : Point-in-polygon automatique
            return guessCountryFromGeometry(d);
          }
        },
        capitals: {
          name: 'Capitals',
          urls: {
            '110m': 'https://cdn.jsdelivr.net/gh/nvkelso/natural-earth-vector@master/geojson/ne_110m_populated_places.geojson',
            '50m': 'https://cdn.jsdelivr.net/gh/nvkelso/natural-earth-vector@master/geojson/ne_50m_populated_places.geojson',
            '10m': 'https://cdn.jsdelivr.net/gh/nvkelso/natural-earth-vector@master/geojson/ne_10m_populated_places.geojson'
          },
          className: 'layer-capital',
          type: 'point',
          defaultStyle: { fill: '#EF4444', stroke: '#FFFFFF', strokeWidth: 0.2, radius: 1 }, // ✅ Radius 1px, stroke 0.2px
          loaded: false,
          data: null,
          filter: (d) => d.properties.FEATURECLA === 'Admin-0 capital' || d.properties.ADM0CAP === 1,
          getParentCountry: (d) => d.properties.ADM0_A3 || d.properties.adm0_a3 || d.properties.SOV_A3
        }
      };
      
      let selectedCountries = new Set();
      let countryColors = new Map();
      let countryStrokes = new Map();
      let hiddenCountries = new Set();
      
      // 🗺️ MAP NOM → CODE ISO pour les layers
      const countryNameToCode = new Map();
      
      // 🗺️ GROUPES SVG POUR LES LAYERS (déclarés en global)
      let regionsGroup, lakesGroup, riversGroup, capitalsGroup;
      
      // 🗺️ SÉLECTION DES LAYERS
      let selectedLayers = {
        regions: new Set(),
        lakes: new Set(),
        rivers: new Set(),
        capitals: new Set()
      };
      let layerColors = {
        regions: new Map(),
        lakes: new Map(),
        rivers: new Map(),
        capitals: new Map()
      };
      let layerStrokes = {
        regions: new Map(),
        lakes: new Map(),
        rivers: new Map(),
        capitals: new Map()
      };
      
      let currentDetailLevel = '50m';
      let activeTextBoxes = new Set();
      let activeTextarea = null;
      let isResizingGlobal = false;
      let isDrawingBox = false;
      let justFinishedBoxSelection = false;
      let groupBoundingBox = null;
      let groupLockIndicator = null;
      let countryCentroids = new Map();
      let currentSpacing = 0;
      
      // 🗺️ ✅ TRACKING LAYERS ACTIVÉS PAR PAYS (OPTIMISÉ)
      const countryLayersActive = new Map(); // 'FRA' => Set(['regions', 'lakes'])
      
      // ✅ Cache des transformations par pays pour performance spacing
      let countryTransformsCache = new Map();

      const COUNTRY_FUSIONS = {
        'Morocco': ['W. Sahara'],
        'Somalia': ['Somaliland']
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
      
      // 🎯 SVG pour cadenas fermé (locked)
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

      // 🎯 SVG pour cadenas ouvert (unlocked)
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
      
      // 🗺️ GROUPES POUR LES LAYERS (ordre z-index)
      const countriesGroup = g.append('g').attr('class', 'countries-layer');
      const layersContainer = g.append('g').attr('class', 'layers-container');
      regionsGroup = layersContainer.append('g').attr('class', 'regions-layer');
      lakesGroup = layersContainer.append('g').attr('class', 'lakes-layer');
      riversGroup = layersContainer.append('g').attr('class', 'rivers-layer');
      capitalsGroup = layersContainer.append('g').attr('class', 'capitals-layer');
      
      const zoom = d3.zoom()
        .scaleExtent([1, 20])
        .filter(function(event) {
          // Toujours bloquer double-click
          if (event.type === 'dblclick') return false;
          
          // ✅ BLOQUER COMPLÈTEMENT tous les wheel events pour D3
          if (event.type === 'wheel') return false;
          
          // Toujours permettre clic droit
          if (event.button === 2 || event.buttons === 2) return true;
          
          // Mode sélection : bloquer drag sauf clic droit
          if (isSelectionMode && event.type !== 'wheel') {
            if (event.type === 'mousedown' && event.button === 2) return true;
            return false;
          }
          
          return true;
        })
        .on('zoom', (event) => {
          g.attr('transform', event.transform);
          
          activeTextBoxes.forEach(textBoxNode => {
            const textBoxGroup = d3.select(textBoxNode);
            updateHandles(textBoxGroup);
            updateLockIndicatorSize(textBoxGroup);
          });
          
          if (groupBoundingBox) {
            const currentZoom = event.transform.k;
            groupBoundingBox.style('stroke-width', 1.5 / currentZoom);
          }
          
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
      
      // Note : Les listeners document-level pour bloquer navigation ont été retirés
      // car preventDefault() ne fonctionne pas de manière fiable (détecté par diagnostic).
      // Solution : Ignorer pan horizontal 2 doigts dans le handler wheel.manual
      
      // ✅ GESTION MANUELLE WHEEL (optimisée performance)
      let panDirection = null;
      let panStartTime = 0;
      const DIRECTION_LOCK_TIMEOUT = 100;
      let accumulatedDeltaX = 0;
      let accumulatedDeltaY = 0;
      
      svg.on('wheel.manual', function(event) {
        // ✅ FIX DÉLAI CLIC : Filtrer micro-mouvements trackpad
        if (!event.ctrlKey) {
          const totalDelta = Math.abs(event.deltaX) + Math.abs(event.deltaY);
          if (totalDelta < 10.0) {
            return; // Clic trackpad, pas scroll
          }
        }
        
        // ✅ BLOQUER ÉVÉNEMENT (zoom natif navigateur)
        // Note: CSS touch-action: pan-y pinch-zoom bloque déjà la navigation
        event.preventDefault();
        event.stopPropagation();
        
        // ✅ PERFORMANCE : Cache transform une fois
        const currentTransform = d3.zoomTransform(svg.node());
        const scale = currentTransform.k;
        const translateX = currentTransform.x;
        const translateY = currentTransform.y;
        
        // ============================================
        // 1️⃣ ZOOM (Ctrl OU Pinch trackpad)
        // ============================================
        if (event.ctrlKey) {
          const zoomSensitivity = 0.006; // ✅ TRIPLÉ : 0.002 → 0.006 (zoom rapide)
          const zoomFactor = Math.exp(-event.deltaY * zoomSensitivity);
          const newScale = Math.max(1, Math.min(20, scale * zoomFactor));
          
          // Point sous curseur en coordonnées monde
          const [mouseX, mouseY] = d3.pointer(event, svg.node());
          const worldX = (mouseX - translateX) / scale;
          const worldY = (mouseY - translateY) / scale;
          
          // Nouveau translate pour garder le point fixe
          const newTranslateX = mouseX - worldX * newScale;
          const newTranslateY = mouseY - worldY * newScale;
          
          const newTransform = d3.zoomIdentity
            .translate(newTranslateX, newTranslateY)
            .scale(newScale);
          
          // ✅ PERFORMANCE : Application directe sans callbacks superflus
          g.attr('transform', newTransform.toString());
          svg.property('__zoom', newTransform);
          
          // ✅ PERFORMANCE : Callbacks essentiels uniquement
          if (activeTextBoxes.size > 0) {
            activeTextBoxes.forEach(textBoxNode => {
              const textBoxGroup = d3.select(textBoxNode);
              updateHandles(textBoxGroup);
              updateLockIndicatorSize(textBoxGroup);
            });
          }
          
          if (groupBoundingBox) {
            groupBoundingBox.style('stroke-width', 1.5 / newScale);
          }
          
          return;
        }
        
        // ============================================
        // 2️⃣ PAN HORIZONTAL (Shift+molette)
        // ============================================
        if (event.shiftKey) {
          // ✅ SENSIBILITÉ ÉQUILIBRÉE (même logique)
          const baseSensitivity = scale > 2 ? 1.5 : 1.2;
          const sensitivity = baseSensitivity / scale;
          const newTranslateX = translateX - event.deltaY * sensitivity;
          
          const newTransform = d3.zoomIdentity
            .translate(newTranslateX, translateY)
            .scale(scale);
          
          g.attr('transform', newTransform.toString());
          svg.property('__zoom', newTransform);
          return;
        }
        
        // ============================================
        // 3️⃣ PAN OMNIDIRECTIONNEL
        // ============================================
        const now = Date.now();
        
        // ✅ Reset direction lock après timeout OU si pas de mouvement
        if (now - panStartTime > DIRECTION_LOCK_TIMEOUT) {
          panDirection = null;
          accumulatedDeltaX = 0;
          accumulatedDeltaY = 0;
        }
        
        // Accumuler les deltas
        accumulatedDeltaX += Math.abs(event.deltaX);
        accumulatedDeltaY += Math.abs(event.deltaY);
        panStartTime = now;
        
        // ✅ SEUIL RÉDUIT : 15 → 5 pixels (plus facile de déclencher)
        if (!panDirection && (accumulatedDeltaX + accumulatedDeltaY) > 5) {
          const ratio = accumulatedDeltaX / (accumulatedDeltaY + 0.0001);
          
          // ✅ RATIOS ASSOUPLIS : 2.0/0.5 → 3.0/0.33 (plus facile d'avoir FREE)
          if (ratio > 3.0) {
            panDirection = 'horizontal';
            console.log('🔒 Direction lock: HORIZONTAL');
          } else if (ratio < 0.33) {
            panDirection = 'vertical';
            console.log('🔒 Direction lock: VERTICAL');
          } else {
            panDirection = 'free';
            console.log('🔓 Direction: FREE (omnidirectionnel)');
          }
        }
        
        // Appliquer pan selon direction
        let deltaX = event.deltaX;
        let deltaY = event.deltaY;
        
        if (panDirection === 'horizontal') {
          deltaY = 0;
        } else if (panDirection === 'vertical') {
          deltaX = 0;
        }
        
        // ✅ SENSIBILITÉ ÉQUILIBRÉE pour tous niveaux de zoom
        // Zoom 1× : 1.2 (modéré)
        // Zoom 5× : 0.3 (rapide)
        // Zoom 10× : 0.15 (très rapide)
        const baseSensitivity = scale > 2 ? 1.5 : 1.2;
        const sensitivity = baseSensitivity / scale;
        
        const newTranslateX = translateX - deltaX * sensitivity;
        const newTranslateY = translateY - deltaY * sensitivity;
        
        const newTransform = d3.zoomIdentity
          .translate(newTranslateX, newTranslateY)
          .scale(scale);
        
        g.attr('transform', newTransform.toString());
        svg.property('__zoom', newTransform);
      });
      
      // Reset direction lock quand la souris quitte le canvas
      svg.on('mouseleave', () => {
        panDirection = null;
        accumulatedDeltaX = 0;
        accumulatedDeltaY = 0;
        panStartTime = 0;
      });
      
      setupTextInsertion(svg, g);
      setupBoxSelection(svg, g);
      
      d3.json('https://cdn.jsdelivr.net/gh/nvkelso/natural-earth-vector@master/geojson/ne_50m_admin_0_countries.geojson')
        .then(data => {
          const countries = data;
          
          const filteredFeatures = countries.features.filter(d => {
            const name = d.properties.NAME || d.properties.name || '';
            
            if (name === 'Antarctica' || name === 'Antarctique') {
              return false;
            }
            
            if (!d.geometry || !d.geometry.coordinates) {
              console.log('⚠️ Géométrie invalide exclue:', name);
              return false;
            }
            
            return true;
          });
          
          console.log('🗺️ Natural Earth chargé:', filteredFeatures.length, 'pays');
          
          countriesGroup.selectAll('path')
            .data(filteredFeatures)
            .enter()
            .append('path')
            .attr('class', 'country')
            .attr('d', path)
            .attr('data-country-id', d => d.id || d.properties.ADM0_A3)
            .attr('data-country-name', d => d.properties.NAME || d.properties.name)
            .on('click', handleCountryClick)
            .each(function(d) {
              const centroid = path.centroid(d);
              const countryId = d.id || d.properties.ADM0_A3;
              const countryName = d.properties.NAME || d.properties.name;
              
              countryCentroids.set(countryId, centroid);
              
              // ✅ Remplir la Map nom → code pour les layers
              if (countryName && countryId) {
                countryNameToCode.set(countryName, countryId);
              }
            });
            
          console.log('✅ Map loaded -', countryCentroids.size, 'centroids calculated');
        })
        .catch(error => {
          console.error('Error loading map:', error);
        });
      
      // ✅ FONCTION HELPER : Deviner le pays d'un élément géographique
      function guessCountryFromGeometry(d) {
        if (!d || !d.geometry) return null;
        
        try {
          let coords;
          let isRiver = false;
          
          if (d.geometry.type === 'Point') {
            coords = d.geometry.coordinates;
          } else if (d.geometry.type === 'LineString') {
            // ✅ Pour les rivières, prendre le PREMIER point (début) au lieu du milieu
            coords = d.geometry.coordinates[0];
            isRiver = true;
          } else if (d.geometry.type === 'MultiLineString') {
            // ✅ Pour MultiLineString : prendre le premier point de la première ligne
            if (!d.geometry.coordinates || !d.geometry.coordinates[0] || !d.geometry.coordinates[0][0]) {
              return null;
            }
            coords = d.geometry.coordinates[0][0];
            isRiver = true;
          } else if (d.geometry.type === 'Polygon') {
            coords = d.geometry.coordinates[0][0];
          } else if (d.geometry.type === 'MultiPolygon') {
            coords = d.geometry.coordinates[0][0][0];
          } else {
            console.warn('⚠️ Type de géométrie non géré:', d.geometry.type);
            return null;
          }
          
          // ✅ Projeter les coordonnées géographiques en coordonnées écran
          const projectedCoords = projection(coords);
          
          if (!projectedCoords || isNaN(projectedCoords[0]) || isNaN(projectedCoords[1])) {
            return null;
          }
          
          // 🎯 STRATÉGIE 1 : Vérifier si le point est DANS un pays (point-in-polygon)
          // Cela évite les mauvaises attributions par proximité
          const countriesData = countriesGroup.selectAll('path').data();
          for (let countryFeature of countriesData) {
            const countryId = countryFeature.id || countryFeature.properties.ADM0_A3;
            if (!countryId) continue;
            
            // Utiliser D3 geoContains pour tester si le point géographique est dans le pays
            if (d3.geoContains(countryFeature, coords)) {
              return countryId;
            }
          }
          
          // 🎯 STRATÉGIE 2 : Si pas trouvé avec point-in-polygon, utiliser la proximité
          // (pour les éléments à la frontière ou dans les eaux internationales)
          let closestCountry = null;
          let minDistance = Infinity;
          
          for (const [countryId, centroid] of countryCentroids.entries()) {
            if (!centroid) continue;
            
            // ✅ Comparer coordonnées projetées avec centroid projeté
            const dx = centroid[0] - projectedCoords[0];
            const dy = centroid[1] - projectedCoords[1];
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < minDistance) {
              minDistance = distance;
              closestCountry = countryId;
            }
          }
          
          // ✅ Seuil adaptatif : 800px pour rivières (augmenté), 500px pour le reste
          const threshold = isRiver ? 800 : 500;
          return (minDistance < threshold) ? closestCountry : null;
          
        } catch (e) {
          console.warn('Could not guess country:', e);
        }
        
        return null;
      }
      
      // ✅ OPTIMISATION : Calculer les transformations une seule fois par pays
      function buildCountryTransformsCache(spacing) {
        countryTransformsCache.clear();
        
        if (spacing === 0) return;
        
        const mapCenterX = projection([0, 0])[0];
        const mapCenterY = projection([0, 0])[1];
        
        countryCentroids.forEach((centroid, countryId) => {
          if (!centroid || isNaN(centroid[0]) || isNaN(centroid[1])) return;
          
          const dx = centroid[0] - mapCenterX;
          const dy = centroid[1] - mapCenterY;
          
          const offsetX = dx * (spacing / 100) * 0.5;
          const offsetY = dy * (spacing / 100) * 0.5;
          
          countryTransformsCache.set(countryId, `translate(${offsetX}, ${offsetY})`);
        });
        
        console.log(`✅ Cache transformations construit: ${countryTransformsCache.size} pays`);
      }
      
      function applyCountrySpacing(spacing) {
        currentSpacing = spacing;
        
        // ✅ Construire le cache une seule fois
        buildCountryTransformsCache(spacing);
        
        // Appliquer aux pays
        g.selectAll('.country').each(function(d) {
          const country = d3.select(this);
          const countryId = d.id || d.properties.ADM0_A3;
          
          const transform = spacing === 0 ? null : countryTransformsCache.get(countryId);
          country.attr('transform', transform || null);
        });
        
        // ✅ Appliquer aux régions (optimisé : utilise le cache)
        if (regionsGroup) {
          regionsGroup.selectAll('.layer-region').each(function(d) {
            const region = d3.select(this);
            
            if (!d || !d.properties) {
              region.attr('transform', null);
              return;
            }
            
            const parentCountryCode = d.properties.adm0_a3 || d.properties.ADM0_A3;
            if (!parentCountryCode) {
              region.attr('transform', null);
              return;
            }
            
            const transform = spacing === 0 ? null : countryTransformsCache.get(parentCountryCode);
            region.attr('transform', transform || null);
          });
        }
        
        // ✅ Appliquer aux lakes (optimisé : utilise le cache)
        if (lakesGroup) {
          lakesGroup.selectAll('.layer-lake').each(function() {
            const lake = d3.select(this);
            const parentCountryCode = this.getAttribute('data-parent-country');
            
            if (!parentCountryCode) {
              lake.attr('transform', null);
              return;
            }
            
            const transform = spacing === 0 ? null : countryTransformsCache.get(parentCountryCode);
            lake.attr('transform', transform || null);
          });
        }
        
        // ✅ Appliquer aux rivers (optimisé : utilise le cache)
        if (riversGroup) {
          riversGroup.selectAll('.layer-river').each(function() {
            const river = d3.select(this);
            const parentCountryCode = this.getAttribute('data-parent-country');
            
            if (!parentCountryCode) {
              river.attr('transform', null);
              return;
            }
            
            const transform = spacing === 0 ? null : countryTransformsCache.get(parentCountryCode);
            river.attr('transform', transform || null);
          });
        }
        
        // ✅ Appliquer aux capitals (optimisé : utilise le cache)
        if (capitalsGroup) {
          capitalsGroup.selectAll('.layer-capital').each(function() {
            const capital = d3.select(this);
            const parentCountryCode = this.getAttribute('data-parent-country');
            
            if (!parentCountryCode) {
              capital.attr('transform', null);
              return;
            }
            
            const transform = spacing === 0 ? null : countryTransformsCache.get(parentCountryCode);
            capital.attr('transform', transform || null);
          });
        }
        
        // Appliquer aux zones de texte
        g.selectAll('.text-box').each(function() {
          const textBoxGroup = d3.select(this);
          const data = textBoxGroup.datum();
          
          if (data.linkedCountryId) {
            const centroid = countryCentroids.get(data.linkedCountryId);
            
            if (centroid && !isNaN(centroid[0]) && !isNaN(centroid[1])) {
              const mapCenterX = projection([0, 0])[0];
              const mapCenterY = projection([0, 0])[1];
              
              const dx = centroid[0] - mapCenterX;
              const dy = centroid[1] - mapCenterY;
              
              const spacingOffsetX = dx * (spacing / 100) * 0.5;
              const spacingOffsetY = dy * (spacing / 100) * 0.5;
              
              const finalX = data.baseX + (data.offsetX || 0) + spacingOffsetX;
              const finalY = data.baseY + (data.offsetY || 0) + spacingOffsetY;
              
              textBoxGroup.attr('transform', 
                `translate(${finalX}, ${finalY}) rotate(${data.rotation || 0} ${data.width/2} ${data.height/2})`
              );
            }
          }
        });
      }
      
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
        
        const finalX = data.baseX + spacingOffsetX + (data.offsetX || 0);
        const finalY = data.baseY + spacingOffsetY + (data.offsetY || 0);
        
        textBoxGroup.attr('transform', 
          `translate(${finalX}, ${finalY}) rotate(${data.rotation || 0} ${data.width/2} ${data.height/2})`
        );
      }
      
      function linkTextBoxToCountry(textBoxGroup, countryId) {
        const data = textBoxGroup.datum();
        const countryElement = document.querySelector(`[data-country-id="${countryId}"]`);
        const countryName = countryElement ? countryElement.getAttribute('data-country-name') : 'Unknown';
        
        const transform = textBoxGroup.attr('transform');
        const match = transform.match(/translate\(([^,]+),([^)]+)\)/);
        let currentX = 0, currentY = 0;
        if (match) {
          currentX = parseFloat(match[1]);
          currentY = parseFloat(match[2]);
        }
        
        data.linkedCountryId = countryId;
        data.linkedCountryName = countryName;
        
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
        
        textBoxGroup.classed('linked-hidden', false);
      }
      
      function updateLinkedTextBoxVisibility(textBoxGroup) {
        const data = textBoxGroup.datum();
        
        if (data.linkedCountryId) {
          const countryElement = document.querySelector(`[data-country-id="${data.linkedCountryId}"]`);
          const isCountryHidden = countryElement && countryElement.classList.contains('hidden');
          
          textBoxGroup.classed('linked-hidden', isCountryHidden);
          updateLockIndicator(textBoxGroup);
        }
      }
      
      function createLockIndicator(textBoxGroup) {
        const data = textBoxGroup.datum();
        
        const currentZoom = d3.zoomTransform(g.node()).k;
        const offsetX = 5 / currentZoom;
        const offsetY = -10 / currentZoom;

        const indicator = textBoxGroup.append('g')
          .attr('class', 'lock-indicator')
          .attr('transform', `translate(${offsetX}, ${offsetY})`)
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
          .attr('width', 8)
          .attr('height', 11.2)
          .attr('x', 0)
          .attr('y', -1);
        
        const iconSize = 8 / currentZoom;
        const iconHeight = iconSize * 1.4;

        indicator.append('text')
          .attr('class', 'country-name-label')
          .attr('x', iconSize + (2 / currentZoom))
          .attr('y', iconHeight / 2)
          .attr('font-size', 8 / currentZoom)
          .attr('text-anchor', 'start');
        
        updateLockIndicator(textBoxGroup);
      }
      
      function updateLockIndicator(textBoxGroup) {
        const data = textBoxGroup.datum();
        const indicator = textBoxGroup.select('.lock-indicator');
        
        if (!indicator.node()) return;
        
        const isLinked = !!data.linkedCountryId;
        const countryElement = data.linkedCountryId ? 
          document.querySelector(`[data-country-id="${data.linkedCountryId}"]`) : null;
        const isCountryHidden = countryElement && countryElement.classList.contains('hidden');
        
        const canToggle = isLinked || (selectedCountries.size === 1 && activeTextBoxes.size === 1);
        
        indicator.classed('disabled', !canToggle);
        indicator.classed('linked', isLinked && !isCountryHidden);
        indicator.classed('linked-hidden', isLinked && isCountryHidden);
        indicator.classed('ready-to-link', !isLinked && canToggle);
        
        const lockIcon = indicator.select('.lock-icon');
        lockIcon.attr('href', isLinked ? '#lock-closed' : '#lock-open');
        
        const label = indicator.select('.country-name-label');
        
        if (isLinked && data.linkedCountryName) {
          const displayName = isCountryHidden ? 
            `${data.linkedCountryName} (hidden)` : 
            data.linkedCountryName;
          label.text(displayName);
        } else if (!isLinked && canToggle) {
          const countryId = Array.from(selectedCountries)[0];
          const element = document.querySelector(`[data-country-id="${countryId}"]`);
          const countryName = element ? element.getAttribute('data-country-name') : '';
          label.text(countryName);
        } else {
          label.text('');
        }
      }

      function updateLockIndicatorSize(textBoxGroup) {
        const indicator = textBoxGroup.select('.lock-indicator');
        if (!indicator.node()) return;
        
        const currentZoom = d3.zoomTransform(g.node()).k;
        const iconSize = 8 / currentZoom;
        const iconHeight = iconSize * 1.4;
        
        const offsetX = 5 / currentZoom;
        const offsetY = -10 / currentZoom;
        indicator.attr('transform', `translate(${offsetX}, ${offsetY})`);
        
        indicator.select('.lock-icon')
          .attr('width', iconSize)
          .attr('height', iconHeight);
        
        indicator.select('.country-name-label')
          .attr('font-size', 8 / currentZoom)
          .attr('x', iconSize + (2 / currentZoom))
          .attr('y', iconHeight / 2);
      }
      
      function handleLockClick(textBoxGroup) {
        const data = textBoxGroup.datum();
        
        const isLinked = !!data.linkedCountryId;
        const canToggle = isLinked || (selectedCountries.size === 1 && activeTextBoxes.size === 1);
        
        if (!canToggle) {
          console.log('⚠️ Cannot toggle lock: need 1 country + 1 text box selected, or text box already linked');
          return;
        }
        
        if (isLinked) {
          unlinkTextBox(textBoxGroup);
        } else {
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
          const currentZoom = d3.zoomTransform(g.node()).k;
          
          groupBoundingBox = g.append('rect')
            .attr('class', 'group-bounding-box')
            .style('fill', 'transparent')
            .style('stroke', '#18A0FB')
            .style('stroke-width', 1.5 / currentZoom)
            .style('stroke-dasharray', 'none')
            .style('pointer-events', 'all')
            .style('cursor', 'default')
            .attr('rx', 1 / currentZoom)
            .call(d3.drag()
              .on('start', function(event) {
                const [x, y] = d3.pointer(event, g.node());
                
                activeTextBoxes.forEach(textBoxNode => {
                  d3.select(textBoxNode).classed('dragging', true);
                });

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
                  startX: x,
                  startY: y,
                  startPositions: startPositions 
                };
              })
              .on('drag', function(event) {
                if (!this.__dragData) return;
                
                const [x, y] = d3.pointer(event, g.node());
                const dx = x - this.__dragData.startX;
                const dy = y - this.__dragData.startY;
                
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
                
                updateGroupBoundingBox();
              })
              .on('end', function() {
                activeTextBoxes.forEach(textBoxNode => {
                  d3.select(textBoxNode).classed('dragging', false);
                });

                delete this.__dragData;
              })
            )
        }
        
        groupBoundingBox
          .attr('x', minX)
          .attr('y', minY)
          .attr('width', boxWidth)
          .attr('height', boxHeight);
        
        if (allLinkedToSame && commonCountryId) {
          if (!groupLockIndicator) {
            const currentZoom = d3.zoomTransform(g.node()).k;
            const iconSize = 8 / currentZoom;

            groupLockIndicator = g.append('g')
              .attr('class', 'group-lock-indicator');

            groupLockIndicator.append('use')
              .attr('class', 'group-lock-icon')
              .attr('href', '#lock-closed')
              .attr('width', iconSize)
              .attr('height', iconSize * 1.17);
            
            groupLockIndicator.append('text')
              .attr('class', 'group-country-name')
              .attr('x', iconSize + (1 / currentZoom))
              .attr('y', 2 / currentZoom)
              .attr('font-size', 3 / currentZoom);
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
        
        const target = event.target;
        const isInteractiveElement = 
          target.classList.contains('country') ||
          target.classList.contains('text-box-rect') ||
          target.classList.contains('text-box-text') ||
          target.classList.contains('resize-handle') ||
          target.classList.contains('lock-indicator') ||
          target.classList.contains('layer-region') ||
          target.classList.contains('layer-lake') ||
          target.classList.contains('layer-river') ||
          target.classList.contains('layer-capital') ||
          target.closest('.text-box') ||
          target.closest('.lock-indicator') ||
          target.closest('.group-bounding-box');
        
        if (!isInteractiveElement) {
          selectedCountries.forEach(id => {
            const element = document.querySelector(`[data-country-id="${id}"]`);
            if (element) element.classList.remove('selected');
          });
          selectedCountries.clear();
          updateBubbleState();
          
          activeTextBoxes.forEach(textBox => {
            deactivateTextBox(d3.select(textBox));
          });
          activeTextBoxes.clear();
          updateGroupBoundingBox();
          
          // Désélectionner tous les layers
          ['regions', 'lakes', 'rivers', 'capitals'].forEach(type => {
            selectedLayers[type].clear();
            g.selectAll(`.${LAYER_CONFIGS[type].className}.selected`)
              .classed('selected', false);
          });
        }
      }
      
      function handleCountryClick(event, d) {
        event.stopPropagation();
        
        if (isPanMode || !isSelectionMode) return;
        
        const countryId = d.id || d.properties.ADM0_A3;
        const countryElement = event.target;
        const isCtrlPressed = event.ctrlKey || event.metaKey;
        
        if (!countryElement._clickData) {
          countryElement._clickData = { count: 0, timeout: null, lastClickTime: 0 };
        }
        
        const now = Date.now();
        const timeSinceLastClick = now - countryElement._clickData.lastClickTime;
        
        if (timeSinceLastClick < 250 && countryElement._clickData.count === 1) {
          clearTimeout(countryElement._clickData.timeout);
          countryElement._clickData.count = 0;
          
          executeDoubleClick(event, d, countryId, countryElement);
          
        } else {
          countryElement._clickData.count = 1;
          countryElement._clickData.lastClickTime = now;
          
          executeSingleClick(countryId, countryElement, isCtrlPressed);
          
          countryElement._clickData.timeout = setTimeout(() => {
            countryElement._clickData.count = 0;
          }, 250);
        }
      }

      function executeSingleClick(countryId, countryElement, isCtrlPressed) {
        if (!isCtrlPressed && activeTextBoxes.size > 0) {
          activeTextBoxes.forEach(textBox => {
            deactivateTextBox(d3.select(textBox));
          });
          activeTextBoxes.clear();
          updateGroupBoundingBox();
        }
        
        // Désélectionner les layers si pas Ctrl
        if (!isCtrlPressed) {
          ['regions', 'lakes', 'rivers', 'capitals'].forEach(type => {
            selectedLayers[type].clear();
            g.selectAll(`.${LAYER_CONFIGS[type].className}.selected`)
              .classed('selected', false);
          });
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

      function executeDoubleClick(event, d, countryId, countryElement) {
        event.preventDefault();
        
        const countryName = d.properties.NAME || d.properties.name;
        const centroid = countryCentroids.get(countryId);
        
        if (!centroid || isNaN(centroid[0]) || isNaN(centroid[1])) {
          console.warn('⚠️ Invalid centroid for country:', countryName);
          return;
        }
        
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
          .attr('rx', 0)
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
          linkedCountryId: null,
          linkedCountryName: null,
          baseX: null,
          baseY: null,
          offsetX: null,
          offsetY: null
        });
        
        addManipulationHandles(textBoxGroup);
        createLockIndicator(textBoxGroup);
        
        activeTextBoxes.add(textBoxGroup.node());
        
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
        
        updateLockIndicator(textBoxGroup);
        updateGroupBoundingBox();
      }
      
      function deactivateTextBox(textBoxGroup) {
        if (!textBoxGroup || !textBoxGroup.node()) return;
        
        if (activeTextarea && activeTextarea.textBoxGroup === textBoxGroup) {
          closeTextEditor();
        }
        
        const data = textBoxGroup.datum();
        
        if (!data.text || data.text.trim() === '') {
          textBoxGroup.remove();
          activeTextBoxes.delete(textBoxGroup.node());
          console.log('🗑️ Zone de texte vide supprimée');
          updateGroupBoundingBox();
          return;
        }
        
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
        
        const currentZoom = d3.zoomTransform(g.node()).k;
        const handleSize = 8 / currentZoom;
        const handleOffset = handleSize / 2;
        
        const handles = [
          { pos: 'nw', x: 0, y: 0 },
          { pos: 'ne', x: data.width, y: 0 },
          { pos: 'se', x: data.width, y: data.height },
          { pos: 'sw', x: 0, y: data.height }
        ];
        
        handles.forEach(h => {
          textBoxGroup.append('rect')
            .attr('class', `resize-handle ${h.pos}`)
            .attr('x', h.x - handleOffset)
            .attr('y', h.y - handleOffset)
            .attr('width', handleSize)
            .attr('height', handleSize)
            .attr('rx', 0.3 / currentZoom)
            .call(makeResizeHandle(textBoxGroup, h.pos));
        });
      }
      
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
              
              textBoxGroup.select('.text-box-rect')
                .attr('width', newWidth)
                .attr('height', newHeight);
              
              const textElement = textBoxGroup.select('.text-box-text');
              textElement
                .attr('x', newWidth / 2)
                .attr('y', newHeight / 2);
              
              updateHandles(textBoxGroup);
              
              textBoxGroup.select('.lock-indicator')
                .attr('transform', `translate(4, -4)`);
              
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
        
        const currentZoom = d3.zoomTransform(g.node()).k;
        const handleSize = 8 / currentZoom;
        const handleOffset = handleSize / 2;
        
        const handlePositions = {
          nw: { x: 0, y: 0 },
          ne: { x: data.width, y: 0 },
          se: { x: data.width, y: data.height },
          sw: { x: 0, y: data.height }
        };
        
        Object.entries(handlePositions).forEach(([pos, coords]) => {
          const handle = textBoxGroup.select(`.resize-handle.${pos}`);
          if (handle.node()) {
            handle
              .attr('x', coords.x - handleOffset)
              .attr('y', coords.y - handleOffset)
              .attr('width', handleSize)
              .attr('height', handleSize)
              .attr('rx', 0.3 / currentZoom);
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
        
        // Appliquer aussi aux layers sélectionnés
        ['regions', 'lakes', 'rivers', 'capitals'].forEach(layerType => {
          selectedLayers[layerType].forEach(layerId => {
            applyColorToLayer(layerType, layerId, color);
          });
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
        
        // Appliquer aussi aux layers sélectionnés
        ['regions', 'lakes', 'rivers', 'capitals'].forEach(layerType => {
          selectedLayers[layerType].forEach(layerId => {
            applyStrokeToLayer(layerType, layerId, strokeColor, currentWidth);
          });
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
        
        // Appliquer aussi aux layers sélectionnés
        ['regions', 'lakes', 'rivers', 'capitals'].forEach(layerType => {
          selectedLayers[layerType].forEach(layerId => {
            const element = document.querySelector(`[data-layer-id="${layerId}"]`);
            if (element && element.style.stroke && element.style.stroke !== 'none') {
              element.style.strokeWidth = width;
            }
          });
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
        
        // Resetter aussi les layers
        ['regions', 'lakes', 'rivers', 'capitals'].forEach(layerType => {
          document.querySelectorAll(`.${LAYER_CONFIGS[layerType].className}.colored`).forEach(el => {
            el.style.fill = '';
            el.style.stroke = '';
            el.classList.remove('colored');
          });
          layerColors[layerType].clear();
          layerStrokes[layerType].clear();
        });
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
      
      window.showCountriesOnMap = function(countryNames) {
        if (!Array.isArray(countryNames)) {
          console.warn('⚠️ showCountriesOnMap: countryNames doit être un tableau');
          return;
        }
        
        let showCount = 0;
        
        const allCountriesToShow = [];
        countryNames.forEach(countryName => {
          allCountriesToShow.push(countryName);
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
        
        const allCountriesToHide = [];
        countryNames.forEach(countryName => {
          allCountriesToHide.push(countryName);
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
        
        g.selectAll('.text-box').each(function() {
          const textBoxGroup = d3.select(this);
          updateLinkedTextBoxVisibility(textBoxGroup);
        });
        
        console.log('🙈 Masquage de', hideCount, 'pays sur la carte');
      };
      
      // 🗺️ ✅ FONCTIONS OPTIMISÉES POUR LES LAYERS
      function loadLayer(layerType, detailLevel) {
        const config = LAYER_CONFIGS[layerType];
        if (!config) {
          console.error('❌ Type de layer inconnu:', layerType);
          return Promise.reject('Type inconnu');
        }
        
        const url = config.urls[detailLevel || currentDetailLevel];
        console.log(`🗺️ Chargement ${layerType} (${detailLevel || currentDetailLevel})...`);
        
        return d3.json(url)
          .then(data => {
            let features = data.features;
            
            if (config.filter) {
              features = features.filter(config.filter);
            }
            
            config.data = features;
            config.loaded = true;
            console.log(`✅ ${layerType} chargé:`, features.length, 'éléments');
            
            return features;
          })
          .catch(error => {
            console.error(`❌ Erreur chargement ${layerType}:`, error);
            throw error;
          });
      }
      
      // ✅ RENDER OPTIMISÉ : Créer une seule fois, cacher par défaut
      function renderLayer(layerType) {
        const config = LAYER_CONFIGS[layerType];
        if (!config || !config.data) {
          console.warn(`⚠️ Pas de données pour ${layerType}`);
          return;
        }
        
        let group;
        if (layerType === 'regions') group = regionsGroup;
        else if (layerType === 'lakes') group = lakesGroup;
        else if (layerType === 'rivers') group = riversGroup;
        else if (layerType === 'capitals') group = capitalsGroup;
        
        group.selectAll('*').remove();
        
        if (config.type === 'polygon') {
          group.selectAll('path')
            .data(config.data)
            .enter()
            .append('path')
            .attr('class', config.className)
            .attr('d', path)
            .attr('data-layer-id', (d, i) => `${layerType}-${i}`)
            .each(function(d) {
              // ✅ FORCE l'attribution via JavaScript natif
              const parentCountry = config.getParentCountry(d);
              this.setAttribute('data-parent-country', parentCountry);
            })
            .style('fill', config.defaultStyle.fill)
            .style('stroke', config.defaultStyle.stroke || 'none')
            .style('stroke-width', config.defaultStyle.strokeWidth || 0)
            .style('display', 'none') // ✅ Caché par défaut
            .on('click', (event, d) => handleLayerClick(event, d, layerType));
            
        } else if (config.type === 'line') {
          group.selectAll('path')
            .data(config.data)
            .enter()
            .append('path')
            .attr('class', config.className)
            .attr('d', path)
            .attr('data-layer-id', (d, i) => `${layerType}-${i}`)
            .each(function(d) {
              // ✅ FORCE l'attribution via JavaScript natif
              const parentCountry = config.getParentCountry(d);
              this.setAttribute('data-parent-country', parentCountry);
            })
            .style('fill', 'none')
            .style('stroke', config.defaultStyle.stroke)
            .style('stroke-width', config.defaultStyle.strokeWidth)
            .style('display', 'none') // ✅ Caché par défaut
            .on('click', (event, d) => handleLayerClick(event, d, layerType));
            
        } else if (config.type === 'point') {
          group.selectAll('g')
            .data(config.data)
            .enter()
            .append('g')
            .attr('class', config.className)
            .attr('data-layer-id', (d, i) => `${layerType}-${i}`)
            .each(function(d) {
              // ✅ FORCE l'attribution via JavaScript natif
              const parentCountry = config.getParentCountry(d);
              this.setAttribute('data-parent-country', parentCountry);
            })
            .style('display', 'none') // ✅ Caché par défaut
            .attr('transform', d => {
              const coords = projection(d.geometry.coordinates);
              return `translate(${coords[0]},${coords[1]})`;
            })
            .append('circle')
            .attr('r', config.defaultStyle.radius)
            .style('fill', config.defaultStyle.fill)
            .style('stroke', config.defaultStyle.stroke)
            .style('stroke-width', config.defaultStyle.strokeWidth)
            .on('click', (event, d) => handleLayerClick(event, d, layerType));
        }
        
        console.log(`✅ ${layerType} rendu (caché par défaut)`);
      }
      
      // ✅ MISE À JOUR DE LA VISIBILITÉ (PERFORMANT)
      function updateLayerVisibility(layerType) {
        const config = LAYER_CONFIGS[layerType];
        if (!config || !config.loaded) return;
        
        // Sélectionner le bon groupe
        let group;
        if (layerType === 'regions') group = regionsGroup;
        else if (layerType === 'lakes') group = lakesGroup;
        else if (layerType === 'rivers') group = riversGroup;
        else if (layerType === 'capitals') group = capitalsGroup;
        
        if (!group) {
          console.error(`❌ Groupe introuvable pour ${layerType}`);
          return;
        }
        
        // Collecter les pays qui ont ce layer activé
        const activeCountries = [];
        countryLayersActive.forEach((layers, countryCode) => {
          if (layers.has(layerType)) {
            activeCountries.push(countryCode);
          }
        });
        
        if (activeCountries.length === 0) {
          // Tout cacher
          group.selectAll(`.${config.className}`)
            .style('display', 'none');
          console.log(`🙈 ${layerType} caché (aucun pays actif)`);
        } else {
          // Afficher seulement pour les pays actifs
          group.selectAll(`.${config.className}`).each(function() {
            const element = d3.select(this);
            const parentCountry = this.getAttribute('data-parent-country');
            
            const shouldShow = activeCountries.includes(parentCountry);
            element.style('display', shouldShow ? 'block' : 'none'); // ✅ 'block' au lieu de null
          });
          
          console.log(`👁️ ${layerType} visible pour:`, activeCountries.join(', '));
        }
      }
      
      function handleLayerClick(event, d, layerType) {
        event.stopPropagation();
        
        if (isPanMode || !isSelectionMode) return;
        
        const layerId = event.target.getAttribute('data-layer-id') || 
                       event.target.parentElement.getAttribute('data-layer-id');
        const layerElement = event.target;
        const isCtrlPressed = event.ctrlKey || event.metaKey;
        
        // Système de détection de double-click
        if (!layerElement._clickData) {
          layerElement._clickData = { count: 0, timeout: null, lastClickTime: 0 };
        }
        
        const now = Date.now();
        const timeSinceLastClick = now - layerElement._clickData.lastClickTime;
        
        if (timeSinceLastClick < 250 && layerElement._clickData.count === 1) {
          // Double-click détecté
          clearTimeout(layerElement._clickData.timeout);
          layerElement._clickData.count = 0;
          
          executeLayerDoubleClick(event, d, layerId, layerElement, layerType);
          
        } else {
          // Simple click
          layerElement._clickData.count = 1;
          layerElement._clickData.lastClickTime = now;
          
          executeLayerSingleClick(layerId, layerElement, layerType, isCtrlPressed, d);
          
          layerElement._clickData.timeout = setTimeout(() => {
            layerElement._clickData.count = 0;
          }, 250);
        }
      }
      
      function executeLayerSingleClick(layerId, layerElement, layerType, isCtrlPressed, d) {
        if (!isCtrlPressed) {
          // Désactiver les text boxes
          activeTextBoxes.forEach(textBox => {
            deactivateTextBox(d3.select(textBox));
          });
          activeTextBoxes.clear();
          updateGroupBoundingBox();
          
          // Désélectionner les pays
          selectedCountries.forEach(id => {
            const element = document.querySelector(`[data-country-id="${id}"]`);
            if (element) element.classList.remove('selected');
          });
          selectedCountries.clear();
          updateBubbleState();
          
          // Désélectionner les autres types de layers
          ['regions', 'lakes', 'rivers', 'capitals'].forEach(type => {
            if (type !== layerType) {
              selectedLayers[type].clear();
              g.selectAll(`.${LAYER_CONFIGS[type].className}.selected`)
                .classed('selected', false);
            }
          });
          
          // ✅ MULTI-SEGMENTS : Pour rivers, sélectionner tous les segments avec le même nom
          let elementsToSelect = [{ id: layerId, element: layerElement }];
          
          if (layerType === 'rivers' && d && d.properties && d.properties.name) {
            const riverName = d.properties.name;
            const allRiverSegments = g.selectAll('.layer-river');
            
            elementsToSelect = [];
            allRiverSegments.each(function(riverData) {
              if (riverData && riverData.properties && riverData.properties.name === riverName) {
                const segmentId = this.getAttribute('data-layer-id');
                elementsToSelect.push({ id: segmentId, element: this });
              }
            });
            
            console.log(`🌊 Sélection rivière "${riverName}": ${elementsToSelect.length} segments`);
          }
          
          // Logique "toggle si seul" - vérifier si TOUS les segments sont déjà sélectionnés
          const allSelected = elementsToSelect.every(item => selectedLayers[layerType].has(item.id));
          const isOnlySelection = selectedLayers[layerType].size === elementsToSelect.length && allSelected;
          
          if (isOnlySelection) {
            // Désélectionner tous les segments
            elementsToSelect.forEach(item => {
              selectedLayers[layerType].delete(item.id);
              item.element.classList.remove('selected');
              if (item.element.parentElement && item.element.parentElement.classList.contains(LAYER_CONFIGS[layerType].className)) {
                item.element.parentElement.classList.remove('selected');
              }
            });
          } else {
            // Désélectionner l'ancienne sélection
            selectedLayers[layerType].forEach(id => {
              const element = document.querySelector(`[data-layer-id="${id}"]`);
              if (element) {
                element.classList.remove('selected');
                if (element.parentElement && element.parentElement.classList.contains(LAYER_CONFIGS[layerType].className)) {
                  element.parentElement.classList.remove('selected');
                }
              }
            });
            selectedLayers[layerType].clear();
            
            // Sélectionner tous les segments trouvés
            elementsToSelect.forEach(item => {
              selectedLayers[layerType].add(item.id);
              item.element.classList.add('selected');
              if (item.element.parentElement && item.element.parentElement.classList.contains(LAYER_CONFIGS[layerType].className)) {
                item.element.parentElement.classList.add('selected');
              }
            });
          }
        } else {
          // Mode Ctrl : toggle simple (UN SEUL segment pour l'instant)
          if (selectedLayers[layerType].has(layerId)) {
            selectedLayers[layerType].delete(layerId);
            layerElement.classList.remove('selected');
            if (layerElement.parentElement && layerElement.parentElement.classList.contains(LAYER_CONFIGS[layerType].className)) {
              layerElement.parentElement.classList.remove('selected');
            }
          } else {
            selectedLayers[layerType].add(layerId);
            layerElement.classList.add('selected');
            if (layerElement.parentElement && layerElement.parentElement.classList.contains(LAYER_CONFIGS[layerType].className)) {
              layerElement.parentElement.classList.add('selected');
            }
          }
        }
        
        console.log(`🎯 ${layerType} sélectionné:`, layerId);
      }
      
      function executeLayerDoubleClick(event, d, layerId, layerElement, layerType) {
        event.preventDefault();
        
        let centroid;
        try {
          centroid = path.centroid(d);
        } catch (e) {
          console.warn('⚠️ Impossible de calculer le centroid pour:', layerId);
          return;
        }
        
        if (!centroid || isNaN(centroid[0]) || isNaN(centroid[1])) {
          console.warn('⚠️ Centroid invalide pour:', layerId);
          return;
        }
        
        selectedCountries.forEach(id => {
          const element = document.querySelector(`[data-country-id="${id}"]`);
          if (element) element.classList.remove('selected');
        });
        selectedCountries.clear();
        
        ['regions', 'lakes', 'rivers', 'capitals'].forEach(type => {
          selectedLayers[type].clear();
          g.selectAll(`.${LAYER_CONFIGS[type].className}.selected`)
            .classed('selected', false);
        });
        
        selectedLayers[layerType].add(layerId);
        layerElement.classList.add('selected');
        
        console.log('🔗 Creating text box for:', layerType, layerId);
        createTextBox(g, centroid[0], centroid[1], null);
        
        updateBubbleState();
      }
      
      function applyColorToLayer(layerType, layerId, color) {
        const config = LAYER_CONFIGS[layerType];
        const element = document.querySelector(`[data-layer-id="${layerId}"]`);
        
        if (!element) return;
        
        if (config.type === 'polygon' || config.type === 'point') {
          if (element.tagName === 'circle') {
            element.style.fill = color;
          } else {
            element.style.fill = color;
          }
        } else if (config.type === 'line') {
          element.style.stroke = color;
        }
        
        element.classList.add('colored');
        layerColors[layerType].set(layerId, color);
      }
      
      function applyStrokeToLayer(layerType, layerId, strokeColor, strokeWidth) {
        const element = document.querySelector(`[data-layer-id="${layerId}"]`);
        if (!element) return;
        
        if (strokeColor === 'transparent' || strokeColor === 'none') {
          element.style.stroke = 'none';
          layerStrokes[layerType].delete(layerId);
        } else {
          element.style.stroke = strokeColor;
          if (strokeWidth !== undefined) {
            element.style.strokeWidth = strokeWidth;
          }
          layerStrokes[layerType].set(layerId, strokeColor);
        }
      }
      
      function reloadAllVisibleLayers() {
        ['regions', 'lakes', 'rivers', 'capitals'].forEach(layerType => {
          const config = LAYER_CONFIGS[layerType];
          if (config.loaded) {
            loadLayer(layerType, currentDetailLevel)
              .then(() => {
                renderLayer(layerType);
                updateLayerVisibility(layerType);
                
                selectedLayers[layerType].forEach(layerId => {
                  const color = layerColors[layerType].get(layerId);
                  const stroke = layerStrokes[layerType].get(layerId);
                  
                  if (color) {
                    applyColorToLayer(layerType, layerId, color);
                  }
                  if (stroke) {
                    applyStrokeToLayer(layerType, layerId, stroke);
                  }
                });
              });
          }
        });
      }
      
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
        
        // 🗺️ ✅ API LAYERS OPTIMISÉE
        
        // Toggle layer pour un pays spécifique (appelé depuis le menu)
        toggleLayerForCountry: function(countryCode, layerType, isActive) {
          console.log(`🎯 Toggle ${layerType} for ${countryCode}:`, isActive);
          
          // ✅ Convertir nom de pays → code ISO si nécessaire
          let isoCode = countryCode;
          if (countryNameToCode.has(countryCode)) {
            isoCode = countryNameToCode.get(countryCode);
            console.log(`🔄 Converti "${countryCode}" → "${isoCode}"`);
          }
          
          // Initialiser le Set pour ce pays si nécessaire
          if (!countryLayersActive.has(isoCode)) {
            countryLayersActive.set(isoCode, new Set());
          }
          
          const countryLayers = countryLayersActive.get(isoCode);
          
          if (isActive) {
            // Ajouter ce layer pour ce pays
            countryLayers.add(layerType);
            
            const config = LAYER_CONFIGS[layerType];
            
            // Charger le layer s'il n'est pas déjà chargé
            if (!config.loaded) {
              return loadLayer(layerType, currentDetailLevel)
                .then(() => {
                  renderLayer(layerType);
                  updateLayerVisibility(layerType);
                  console.log(`✅ ${layerType} chargé et affiché pour ${isoCode}`);
                })
                .catch(err => {
                  console.error(`❌ Erreur activation ${layerType}:`, err);
                });
            } else {
              // Layer déjà chargé, juste mettre à jour la visibilité
              updateLayerVisibility(layerType);
              console.log(`✅ ${layerType} affiché pour ${isoCode}`);
            }
          } else {
            // Retirer ce layer pour ce pays
            countryLayers.delete(layerType);
            updateLayerVisibility(layerType);
            console.log(`🙈 ${layerType} caché pour ${isoCode}`);
          }
          
          return Promise.resolve();
        },
        
        // Obtenir les layers actifs d'un pays
        getCountryActiveLayers: function(countryCode) {
          const layers = countryLayersActive.get(countryCode);
          return layers ? Array.from(layers) : [];
        },
        
        getSelectedLayers: function() {
          return {
            regions: Array.from(selectedLayers.regions).map(id => {
              return {
                id: id,
                color: layerColors.regions.get(id) || LAYER_CONFIGS.regions.defaultStyle.fill,
                stroke: layerStrokes.regions.get(id) || LAYER_CONFIGS.regions.defaultStyle.stroke
              };
            }),
            lakes: Array.from(selectedLayers.lakes).map(id => {
              return {
                id: id,
                color: layerColors.lakes.get(id) || LAYER_CONFIGS.lakes.defaultStyle.fill,
                stroke: layerStrokes.lakes.get(id) || LAYER_CONFIGS.lakes.defaultStyle.stroke
              };
            }),
            rivers: Array.from(selectedLayers.rivers).map(id => {
              return {
                id: id,
                color: layerColors.rivers.get(id) || LAYER_CONFIGS.rivers.defaultStyle.stroke,
                stroke: layerStrokes.rivers.get(id) || LAYER_CONFIGS.rivers.defaultStyle.stroke
              };
            }),
            capitals: Array.from(selectedLayers.capitals).map(id => {
              return {
                id: id,
                color: layerColors.capitals.get(id) || LAYER_CONFIGS.capitals.defaultStyle.fill,
                stroke: layerStrokes.capitals.get(id) || LAYER_CONFIGS.capitals.defaultStyle.stroke
              };
            })
          };
        },
        
        getCurrentDetailLevel: function() {
          return currentDetailLevel;
        },
        
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
          
          const urls = {
            '110m': 'https://cdn.jsdelivr.net/gh/nvkelso/natural-earth-vector@master/geojson/ne_110m_admin_0_countries.geojson',
            '50m': 'https://cdn.jsdelivr.net/gh/nvkelso/natural-earth-vector@master/geojson/ne_50m_admin_0_countries.geojson',
            '10m': 'https://cdn.jsdelivr.net/gh/nvkelso/natural-earth-vector@master/geojson/ne_10m_admin_0_countries.geojson'
          };
          
          const url = urls[level] || urls['50m'];
          
          d3.json(url)
            .then(data => {
              if (!data || !data.features) {
                throw new Error('Format de données invalide');
              }
              
              loadingEl.text('Parsing...');
              
              setTimeout(() => {
                try {
                  const filteredFeatures = data.features.filter(d => {
                    const name = d.properties.NAME || d.properties.name || '';
                    if (name === 'Antarctica' || name === 'Antarctique') return false;
                    if (!d.geometry || !d.geometry.coordinates) return false;
                    return true;
                  });
                  
                  loadingEl.text('Drawing...');
                  
                  countriesGroup.selectAll('.country').remove();
                  countryCentroids.clear();
                  
                  const paths = countriesGroup.selectAll('path.country')
                    .data(filteredFeatures)
                    .enter()
                    .append('path')
                    .attr('class', 'country')
                    .attr('d', path)
                    .attr('data-country-id', d => d.id || d.properties.ADM0_A3)
                    .attr('data-country-name', d => d.properties.NAME || d.properties.name)
                    .on('click', handleCountryClick);
                  
                  paths.each(function(d) {
                    const countryId = d.id || d.properties.ADM0_A3;
                    const centroid = path.centroid(d);
                    
                    if (isNaN(centroid[0]) || isNaN(centroid[1])) return;
                    
                    countryCentroids.set(countryId, centroid);
                    
                    if (savedColors.has(countryId)) {
                      applyColorToCountry(countryId, savedColors.get(countryId));
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
                  
                  currentDetailLevel = level;
                  reloadAllVisibleLayers();
                  
                  svg.call(zoom.transform, currentZoom);
                  loadingEl.remove();
                  
                  console.log('✅ Niveau de détail changé:', level);
                  updateBubbleState();
                  
                } catch (renderError) {
                  console.error('❌ Erreur de rendu:', renderError);
                  loadingEl.text('Erreur: ' + renderError.message);
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
      
      console.log('✅ MapFlow initialisé avec gestion optimisée des layers par pays');
    }
    
    initMap();
  </script>
</body>
</html>