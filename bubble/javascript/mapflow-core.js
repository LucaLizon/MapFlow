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
      transition: fill 0.2s ease, transform 0.2s ease;
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
    
    .group-selection-active .text-box.active .text-box-rect {
      stroke: transparent;
      stroke-width: 0;
    }
    
    .group-selection-active .text-box.active .resize-handle {
      opacity: 0;
      pointer-events: none;
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
      let activeTextBoxes = new Set();
      let activeTextarea = null;
      let isResizingGlobal = false;
      let isDrawingBox = false;
      let justFinishedBoxSelection = false;
      let groupBoundingBox = null;
      let countryCentroids = new Map();
      let currentSpacing = 0;
      
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
      }
      
      function updateGroupBoundingBox() {
        if (activeTextBoxes.size <= 1) {
          if (groupBoundingBox) {
            groupBoundingBox.remove();
            groupBoundingBox = null;
          }
          g.classed('group-selection-active', false);
          return;
        }
        
        g.classed('group-selection-active', true);
        
        let minX = Infinity, minY = Infinity;
        let maxX = -Infinity, maxY = -Infinity;
        
        activeTextBoxes.forEach(textBoxNode => {
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
            .style('pointer-events', 'none')
            .attr('rx', 1);
        }
        
        groupBoundingBox
          .attr('x', minX)
          .attr('y', minY)
          .attr('width', boxWidth)
          .attr('height', boxHeight);
      }
      
      function handleBackgroundClick(event) {
        if (justFinishedBoxSelection) return;
        if (isDrawingBox) return;
        
        if (event.target.tagName === 'svg' || event.target.tagName === 'rect') {
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
        }
      }
      
      function handleCountryClick(event, d) {
        event.stopPropagation();
        
        if (isPanMode || !isSelectionMode) return;
        
        if (activeTextBoxes.size > 0) {
          activeTextBoxes.forEach(textBox => {
            deactivateTextBox(d3.select(textBox));
          });
          activeTextBoxes.clear();
          return;
        }
        
        const countryId = d.id;
        const countryElement = event.target;
        const isCtrlPressed = event.ctrlKey || event.metaKey;
        
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
      
      function createTextBox(g, x, y) {
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
          textDecoration: 'none'
        });
        
        addManipulationHandles(textBoxGroup);
        
        activeTextBoxes.add(textBoxGroup.node());
        
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
        
        updateGroupBoundingBox();
      }
      
      function deactivateTextBox(textBoxGroup) {
        if (!textBoxGroup || !textBoxGroup.node()) return;
        
        if (activeTextarea && activeTextarea.textBoxGroup === textBoxGroup) {
          closeTextEditor();
        }
        
        textBoxGroup.classed('active', false);
        activeTextBoxes.delete(textBoxGroup.node());
        
        const data = textBoxGroup.datum();
        if ((!data.text || data.text.trim() === '') && activeTextBoxes.size === 0) {
          textBoxGroup.remove();
        }
        
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
                    group.attr('transform', 
                      `translate(${startPos.x + dx}, ${startPos.y + dy}) rotate(${currentRotation} ${data.width/2} ${data.height/2})`
                    );
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
              
              textBoxGroup.select('.text-box-rect')
                .attr('width', newWidth)
                .attr('height', newHeight);
              
              const textElement = textBoxGroup.select('.text-box-text');
              textElement
                .attr('x', newWidth / 2)
                .attr('y', newHeight / 2);
              
              updateHandles(textBoxGroup);
              
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
      
      // 🆕 FONCTION EXPOSÉE : Mettre à jour le slider depuis Bubble (pour les boutons Close/Medium/Far)
      window.updateSliderFromBubble = function(value) {
        const slider = document.getElementById('country-spacing-slider');
        if (slider) {
          slider.value = value;
          
          // Mettre à jour le gradient visuel
          const percentage = value;
          slider.style.background = `linear-gradient(to right, #3cf19a 0%, #3cf19a ${percentage}%, #E5E7EB ${percentage}%, #E5E7EB 100%)`;
          
          // Appliquer l'écartement
          applyCountrySpacing(value);
          currentSpacing = value;
          
          // 🆕 METTRE À JOUR L'INPUT VISIBLE
          if (typeof window.updateVisibleInput === 'function') {
            window.updateVisibleInput(value);
          }
          
          console.log('🎛️ Slider + Input mis à jour depuis Bubble:', value + '%');
        } else {
          console.warn('⚠️ Slider non trouvé pour mise à jour');
        }
      };
      
      window.mapFunctions = {
        applyColorToSelected: applyColorToSelected,
        applyStrokeToSelected: applyStrokeToSelected,
        updateStrokeWidth: updateStrokeWidth,
        clearSelection: clearSelection,
        resetAllColors: resetAllColors,
        getSelectedCountries: () => window.selectedCountriesData || [],
        
        applyCountrySpacing: applyCountrySpacing,
        
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
        }
      };
      
      console.log('✅ MapFlow initialisé - prêt pour connexion Bubble');
    }
    
    initMap();
  </script>
</body>
</html>