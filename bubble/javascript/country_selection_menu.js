<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'JetBrains Mono', 'Courier New', monospace;
    overflow: hidden;
  }

  /* NOUVELLE SIDEBAR BLANCHE - Au-dessus de tout */
  .custom-sidebar {
    position: fixed;
    left: 0;
    top: 114px;
    width: 48px;
    height: calc(100vh - 114px);
    background: #FFFFFF;
    border-right: 1px solid #E5E7EB;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 40px;
    gap: 12px;
    z-index: 20000;
  }

  .custom-sidebar-icon {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 6px;
    transition: background 0.2s ease;
    color: #1E1E1E;
  }

  .custom-sidebar-icon:hover {
    background: #E5E7EB;
  }

  .custom-sidebar-icon.active {
    background: #E5E7EB;
  }

  .custom-sidebar-icon svg {
    width: 24px;
    height: 24px;
  }

  /* PANNEAU LATÉRAL */
  .side-panel {
    position: fixed;
    left: -378px;
    top: 114px;
    width: 378px;
    height: calc(100vh - 114px);
    background: transparent;
    z-index: 19000;
    transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    flex-direction: column;
  }

  .side-panel.open {
    left: 0;
  }

  /* Wrapper interne pour le contenu */
  .panel-content-wrapper {
    margin-left: 48px;
    width: 330px;
    height: 100%;
    background: #FFFFFF;
    border-right: 1px solid #E5E7EB;
    display: flex;
    flex-direction: column;
  }

  /* HEADER DU PANNEAU */
  .panel-header {
    padding: 14px 12px;
    border-bottom: 1px solid #E5E7EB;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-shrink: 0;
    background: #FFFFFF;
  }

  .panel-title {
    font-size: 16px;
    font-weight: 700;
    color: #1E1E1E;
    white-space: nowrap;
  }

  .search-container {
    position: relative;
    flex: 1;
    max-width: 120px;
  }

  .search-input {
    width: 100%;
    padding: 6px 8px 6px 28px;
    border: 1px solid #E5E7EB;
    border-radius: 4px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    color: #1E1E1E;
    outline: none;
    transition: border-color 0.2s;
    background: #FFFFFF;
  }

  .search-input:focus {
    border-color: #3cf19a;
  }

  .search-input::placeholder {
    color: rgba(29, 32, 37, 0.4);
  }

  .search-icon {
    position: absolute;
    left: 8px;
    top: 50%;
    transform: translateY(-50%);
    width: 14px;
    height: 14px;
    color: rgba(29, 32, 37, 0.4);
  }

  /* LISTE DES CONTINENTS */
  .continents-list {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    background: #FFFFFF;
  }

  .continents-list::-webkit-scrollbar {
    width: 8px;
  }

  .continents-list::-webkit-scrollbar-track {
    background: #FFFFFF;
  }

  .continents-list::-webkit-scrollbar-thumb {
    background: #E5E7EB;
    border-radius: 4px;
  }

  /* CONTINENT SECTION */
  .continent-section {
    border-bottom: 1px solid #E5E7EB;
  }

  .continent-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px;
    cursor: pointer;
    user-select: none;
    transition: background 0.2s;
    background: #FFFFFF;
  }

  .continent-header:hover {
    background: #F5F5F5;
  }

  .continent-left {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
  }

  .continent-name {
    font-size: 14px;
    color: #1E1E1E;
  }

  .continent-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .clear-btn {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0.6;
    transition: opacity 0.2s;
  }

  .clear-btn:hover {
    opacity: 1;
  }

  .expand-icon {
    width: 16px;
    height: 16px;
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    color: rgba(29, 32, 37, 0.6);
  }

  .expand-icon.expanded {
    transform: rotate(180deg);
  }

  /* 🎨 WRAPPER pour animation fluide avec max-height - Très douce */
  .countries-grid-wrapper {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .countries-grid-wrapper.expanded {
    max-height: 2000px;
  }

  /* GRILLE DE PAYS */
  .countries-grid {
    display: grid;
    grid-template-columns: repeat(2, 140px);
    justify-content: center;
    gap: 6px;
    padding: 6px 12px 12px 12px;
    background: #FFFFFF;
  }

  /* CARTE PAYS */
  .country-card {
    width: 140px;
    height: 70px;
    border-radius: 4px;
    border: 1px solid #D9D9D9;
    display: inline-flex;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 6px;
    cursor: pointer;
    transition: background 0.15s ease;
    background: transparent;
    position: relative;
    overflow: hidden;
  }

  .country-card:hover {
    background: #F5F5F5;
  }

  /* INDICATEUR GAUCHE */
  .country-indicator {
    align-self: stretch;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
  }

  .country-card.selected .country-indicator {
    width: 19px;
    padding-left: 18px;
    background: #3CF19A;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }

  .country-card:not(.selected) .country-indicator {
    height: 70px;
    padding-left: 18px;
  }

  .country-card:not(.selected) .country-indicator::before {
    content: '';
    width: 1px;
    height: 100%;
    background: #D9D9D9;
  }

  /* CONTENU DU PAYS */
  .country-content {
    padding-top: 6px;
    padding-bottom: 6px;
    padding-left: 0;
    padding-right: 8px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    flex: 1;
    min-width: 0;
    pointer-events: none;
  }

  .country-name {
    font-family: 'JetBrains Mono', 'Courier New', monospace;
    font-size: 12px;
    font-weight: 400;
    word-wrap: break-word;
    text-align: left;
    transition: color 0.15s ease;
    width: 100%;
    z-index: 2;
    position: relative;
    pointer-events: auto;
  }

  .country-card.selected .country-name {
    color: #1E1E1E;
  }

  .country-card:not(.selected) .country-name {
    color: #B3B3B3;
  }

  /* SVG CONTAINER */
  .country-svg-container {
    position: absolute;
    bottom: 4px;
    right: 4px;
    width: 55px;
    height: 50px;
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    z-index: 1;
    pointer-events: none;
  }

  .country-card.selected .country-svg-container svg {
    opacity: 0.6;
    color: #303030;
  }

  .country-card:not(.selected) .country-svg-container svg {
    opacity: 0.5;
    color: #D9D9D9;
  }

  .country-card:hover .country-svg-container svg {
    opacity: 0.7;
  }

  /* RESPONSIVE */
  @media (max-width: 768px) {
    .custom-sidebar {
      width: 50px;
    }
    .side-panel {
      width: 280px;
      margin-left: 50px;
    }
  }
</style>

<!-- NOUVELLE SIDEBAR BLANCHE -->
<div class="custom-sidebar">
  <div class="custom-sidebar-icon" id="countries-icon" title="Countries">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  </div>
</div>

<!-- PANNEAU LATÉRAL -->
<div class="side-panel" id="countries-panel">
  <div class="panel-content-wrapper">
    <div class="panel-header">
      <div class="panel-title">Countries to display</div>
      <div class="search-container">
        <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
        <input type="text" class="search-input" id="search-input" placeholder="Search...">
      </div>
    </div>

    <div class="continents-list" id="continents-list">
      <!-- Les continents seront générés par JavaScript -->
    </div>
  </div>
</div>

<script>
  // DONNÉES DES PAYS PAR CONTINENT
  const COUNTRIES_DATA = {
      africa: {
          name: 'Africa',
          countries: [
          'Algeria', 'Angola', 'Benin', 'Botswana', 'Burkina Faso', 'Burundi', 'Cameroon', 
          'Central African Rep.', 'Chad', 'Congo', 'Dem. Rep. Congo', 
          "Côte d'Ivoire", 'Djibouti', 'Egypt', 'Eq. Guinea', 'Eritrea', 'Ethiopia',
          'Gabon', 'Gambia', 'Ghana', 'Guinea', 'Guinea-Bissau', 'Kenya', 'Lesotho', 
          'Liberia', 'Libya', 'Madagascar', 'Malawi', 'Mali', 'Mauritania', 'Morocco',
          'Mozambique', 'Namibia', 'Niger', 'Nigeria', 'Rwanda', 'Senegal', 'Sierra Leone',
          'Somalia', 'South Africa', 'S. Sudan', 'Sudan', 'eSwatini', 'Tanzania',
          'Togo', 'Tunisia', 'Uganda', 'Zambia', 'Zimbabwe'
          ]
      },
      asia: {
          name: 'Asia',
          countries: [
          'Afghanistan', 'Armenia', 'Azerbaijan', 'Bahrain', 'Bangladesh', 'Bhutan', 'Brunei',
          'Cambodia', 'China', 'Georgia', 'India', 'Indonesia', 'Iran', 'Iraq', 'Israel',
          'Japan', 'Jordan', 'Kazakhstan', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Lebanon',
          'Malaysia', 'Mongolia', 'Myanmar', 'Nepal', 'North Korea', 'Oman', 'Pakistan',
          'Palestine', 'Philippines', 'Qatar', 'Saudi Arabia', 'Singapore', 'South Korea',
          'Sri Lanka', 'Syria', 'Taiwan', 'Tajikistan', 'Thailand', 'Turkey', 'Turkmenistan',
          'United Arab Emirates', 'Uzbekistan', 'Vietnam', 'Yemen'
          ]
      },
      europe: {
          name: 'Europe',
          countries: [
              'Albania', 'Andorra', 'Austria', 'Belarus', 'Belgium', 'Bosnia and Herz.',
              'Bulgaria', 'Croatia', 'Cyprus', 'Czechia', 'Denmark', 'Estonia', 'Finland',
              'France', 'Germany', 'Greece', 'Greenland', 'Hungary', 'Iceland', 'Ireland', 'Italy', 'Kosovo',
              'Latvia', 'Lithuania', 'Luxembourg', 'Macedonia', 'Malta', 'Moldova', 'Monaco',
              'Montenegro', 'Netherlands', 'Norway', 'Poland', 'Portugal', 'Romania', 'Russia',
              'San Marino', 'Serbia', 'Slovakia', 'Slovenia', 'Spain', 'Sweden', 'Switzerland',
              'Ukraine', 'United Kingdom', 'Vatican'
          ]
      },
      northAmerica: {
          name: 'North America',
          countries: [
          'Antigua and Barb.', 'Bahamas', 'Barbados', 'Belize', 'Canada', 'Costa Rica',
          'Cuba', 'Dominica', 'Dominican Rep.', 'El Salvador', 'Grenada', 'Guatemala',
          'Haiti', 'Honduras', 'Jamaica', 'Mexico', 'Nicaragua', 'Panama', 'Saint Kitts and Nevis',
          'Saint Lucia', 'St. Vin. and Gren.', 'Trinidad and Tobago', 'United States of America'
          ]
      },
      southAmerica: {
          name: 'South America',
          countries: [
          'Argentina', 'Bolivia', 'Brazil', 'Chile', 'Colombia', 'Ecuador', 'Guyana',
          'Paraguay', 'Peru', 'Suriname', 'Uruguay', 'Venezuela'
          ]
      },
      oceania: {
          name: 'Oceania',
          countries: [
          'Australia', 'Fiji', 'Kiribati', 'Marshall Is.', 'Micronesia', 'Nauru',
          'New Zealand', 'Palau', 'Papua New Guinea', 'Samoa', 'Solomon Is.', 'Tonga',
          'Tuvalu', 'Vanuatu'
          ]
      }
  };

  // ÉTAT DE L'APPLICATION
  let panelOpen = false;
  let expandedContinents = {};
  let selectedCountries = {};
  let searchQuery = '';

  // Initialiser tous les pays comme cochés, seule l'Afrique ouverte
  Object.keys(COUNTRIES_DATA).forEach(continentKey => {
    expandedContinents[continentKey] = (continentKey === 'africa'); // Seule l'Afrique ouverte
    COUNTRIES_DATA[continentKey].countries.forEach(country => {
      selectedCountries[country] = true;
    });
  });

  // ÉLÉMENTS DOM
  const countriesIcon = document.getElementById('countries-icon');
  const countriesPanel = document.getElementById('countries-panel');
  const searchInput = document.getElementById('search-input');
  const continentsList = document.getElementById('continents-list');

  // TOGGLE PANNEAU
  countriesIcon.addEventListener('click', () => {
    panelOpen = !panelOpen;
    countriesPanel.classList.toggle('open', panelOpen);
    countriesIcon.classList.toggle('active', panelOpen);
  });

  // RECHERCHE
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase();
    renderContinents();
  });

  // FILTRAGE
  function shouldShowContinent(continentData) {
    if (!searchQuery) return true;
    if (continentData.name.toLowerCase().includes(searchQuery)) return true;
    return continentData.countries.some(c => c.toLowerCase().includes(searchQuery));
  }

  function shouldShowCountry(countryName, continentData) {
    if (!searchQuery) return true;
    if (countryName.toLowerCase().includes(searchQuery)) return true;
    if (continentData.name.toLowerCase().includes(searchQuery)) return true;
    return false;
  }

  // 🔧 TOGGLE CONTINENT avec préservation du scroll ET sans re-render
  function toggleContinent(continentKey) {
    const scrollPosition = continentsList.scrollTop;
    
    expandedContinents[continentKey] = !expandedContinents[continentKey];
    
    // 🎯 Trouver le wrapper et toggle la classe directement
    const sections = continentsList.querySelectorAll('.continent-section');
    const continentKeys = Object.keys(COUNTRIES_DATA);
    const index = continentKeys.indexOf(continentKey);
    
    if (sections[index]) {
      const wrapper = sections[index].querySelector('.countries-grid-wrapper');
      const icon = sections[index].querySelector('.expand-icon');
      
      if (wrapper) {
        if (expandedContinents[continentKey]) {
          wrapper.classList.add('expanded');
        } else {
          wrapper.classList.remove('expanded');
        }
      }
      
      if (icon) {
        if (expandedContinents[continentKey]) {
          icon.classList.add('expanded');
        } else {
          icon.classList.remove('expanded');
        }
      }
    }
    
    requestAnimationFrame(() => {
      continentsList.scrollTop = scrollPosition;
    });
  }

  // CLEAR CONTINENT
  function clearContinent(continentKey, e) {
    e.stopPropagation();
    
    const scrollPosition = continentsList.scrollTop;
    
    const allChecked = COUNTRIES_DATA[continentKey].countries.every(c => selectedCountries[c]);
    COUNTRIES_DATA[continentKey].countries.forEach(country => {
      selectedCountries[country] = !allChecked;
    });
    renderContinents();
    syncWithMap();
    
    requestAnimationFrame(() => {
      continentsList.scrollTop = scrollPosition;
    });
  }

  // TOGGLE COUNTRY
  function toggleCountry(countryName) {
    selectedCountries[countryName] = !selectedCountries[countryName];
    
    const scrollPosition = continentsList.scrollTop;
    
    renderContinents();
    syncWithMap();
    
    requestAnimationFrame(() => {
      continentsList.scrollTop = scrollPosition;
    });
  }

  // SYNCHRONISER AVEC LA CARTE
  function syncWithMap() {
    const visibleCountries = [];
    const hiddenCountries = [];
    
    Object.keys(selectedCountries).forEach(country => {
      if (selectedCountries[country]) {
        visibleCountries.push(country);
      } else {
        hiddenCountries.push(country);
      }
    });

    if (typeof window.showCountriesOnMap === 'function') {
      window.showCountriesOnMap(visibleCountries);
    }
    if (typeof window.hideCountriesOnMap === 'function') {
      window.hideCountriesOnMap(hiddenCountries);
    }

    console.log('📊 Sync with map:', visibleCountries.length, 'visible,', hiddenCountries.length, 'hidden');
  }

  const COUNTRY_SVG_PATHS = {};

  function getCountrySVGPath(countryName) {
    if (COUNTRY_SVG_PATHS[countryName]) {
      return COUNTRY_SVG_PATHS[countryName];
    }
    
    if (typeof document !== 'undefined') {
      const mapElement = document.querySelector(`[data-country-name="${countryName}"]`);
      if (mapElement) {
        const path = mapElement.getAttribute('d');
        if (path) {
          COUNTRY_SVG_PATHS[countryName] = path;
          return path;
        }
      }
    }
    
    return null;
  }

  function getPathBoundingBox(pathData) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathData);
    svg.appendChild(path);
    svg.style.position = 'absolute';
    svg.style.visibility = 'hidden';
    document.body.appendChild(svg);
    
    const bbox = path.getBBox();
    document.body.removeChild(svg);
    
    return bbox;
  }

  function generateCountrySVG(countryName) {
    const pathData = getCountrySVGPath(countryName);
    
    if (!pathData) {
      return `
        <svg viewBox="0 0 100 80" xmlns="http://www.w3.org/2000/svg">
          <text x="50" y="40" text-anchor="middle" font-size="8" fill="currentColor" opacity="0.3">
            ${countryName.substring(0, 3).toUpperCase()}
          </text>
        </svg>
      `;
    }
    
    try {
      const bbox = getPathBoundingBox(pathData);
      const padding = Math.max(bbox.width, bbox.height) * 0.15;
      const viewBoxX = bbox.x - padding;
      const viewBoxY = bbox.y - padding;
      const viewBoxWidth = bbox.width + (padding * 2);
      const viewBoxHeight = bbox.height + (padding * 2);
      const strokeWidth = Math.max(viewBoxWidth, viewBoxHeight) * 0.008;
      
      return `
        <svg 
          viewBox="${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}" 
          xmlns="http://www.w3.org/2000/svg" 
          preserveAspectRatio="xMidYMid meet"
        >
          <path 
            d="${pathData}" 
            fill="none" 
            stroke="currentColor" 
            stroke-width="${strokeWidth}"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      `;
    } catch (error) {
      console.warn(`Erreur SVG pour ${countryName}:`, error);
      return `
        <svg viewBox="0 0 100 80" xmlns="http://www.w3.org/2000/svg">
          <text x="50" y="40" text-anchor="middle" font-size="8" fill="currentColor" opacity="0.3">
            ${countryName.substring(0, 3).toUpperCase()}
          </text>
        </svg>
      `;
    }
  }

  function renderContinents() {
    continentsList.innerHTML = '';

    Object.keys(COUNTRIES_DATA).forEach(continentKey => {
      const continentData = COUNTRIES_DATA[continentKey];
      
      if (!shouldShowContinent(continentData)) return;

      const section = document.createElement('div');
      section.className = 'continent-section';

      const header = document.createElement('div');
      header.className = 'continent-header';
      header.onclick = () => toggleContinent(continentKey);

      const allChecked = continentData.countries.every(c => selectedCountries[c]);

      header.innerHTML = `
        <div class="continent-left">
          <div class="continent-name">${continentData.name}</div>
        </div>
        <div class="continent-actions">
          <div class="clear-btn" onclick="clearContinent('${continentKey}', event)" title="${allChecked ? 'Uncheck all' : 'Check all'}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </div>
          <svg class="expand-icon ${expandedContinents[continentKey] ? 'expanded' : ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      `;

      section.appendChild(header);

      // 🎨 Wrapper avec animation max-height
      const gridWrapper = document.createElement('div');
      gridWrapper.className = `countries-grid-wrapper ${expandedContinents[continentKey] ? 'expanded' : ''}`;

      const grid = document.createElement('div');
      grid.className = 'countries-grid';

      continentData.countries.forEach(country => {
        if (!shouldShowCountry(country, continentData)) return;

        const card = document.createElement('div');
        card.className = `country-card ${selectedCountries[country] ? 'selected' : ''}`;
        card.onclick = () => toggleCountry(country);

        card.innerHTML = `
          <div class="country-indicator"></div>
          <div class="country-content">
            <div class="country-name">${country}</div>
            <div class="country-svg-container">
              ${generateCountrySVG(country)}
            </div>
          </div>
        `;

        grid.appendChild(card);
      });

      gridWrapper.appendChild(grid);
      section.appendChild(gridWrapper);
      continentsList.appendChild(section);
    });
  }

  renderContinents();
  syncWithMap();

  setTimeout(() => {
    const countryElements = document.querySelectorAll('[data-country-name]');
    
    if (countryElements.length === 0) {
      console.warn('⚠️ Aucun pays trouvé dans MapFlow.');
      return;
    }
    
    console.log(`🗺️ Extraction de ${countryElements.length} SVG paths depuis MapFlow...`);
    
    let extracted = 0;
    countryElements.forEach(element => {
      const name = element.getAttribute('data-country-name');
      const path = element.getAttribute('d');
      if (name && path) {
        COUNTRY_SVG_PATHS[name] = path;
        extracted++;
      }
    });
    
    if (extracted > 0) {
      console.log(`✅ ${extracted} SVG paths extraits`);
      renderContinents();
    }
  }, 2000);

  window.countriesPanel = {
    toggle: () => {
      panelOpen = !panelOpen;
      countriesPanel.classList.toggle('open', panelOpen);
      countriesIcon.classList.toggle('active', panelOpen);
    },
    open: () => {
      panelOpen = true;
      countriesPanel.classList.add('open');
      countriesIcon.classList.add('active');
    },
    close: () => {
      panelOpen = false;
      countriesPanel.classList.remove('open');
      countriesIcon.classList.remove('active');
    },
    selectCountry: (countryName) => {
      if (selectedCountries.hasOwnProperty(countryName)) {
        selectedCountries[countryName] = true;
        renderContinents();
      }
    },
    deselectCountry: (countryName) => {
      if (selectedCountries.hasOwnProperty(countryName)) {
        selectedCountries[countryName] = false;
        renderContinents();
      }
    },
    getSelectedCountries: () => {
      return Object.keys(selectedCountries).filter(c => selectedCountries[c]);
    }
  };

  console.log('✅ Countries panel initialized');
</script>