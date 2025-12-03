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

  /* SIDEBAR BLANCHE */
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

  .panel-content-wrapper {
    margin-left: 48px;
    width: 330px;
    height: 100%;
    background: #FFFFFF;
    border-right: 1px solid #E5E7EB;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: visible;
    box-sizing: border-box;
  }

  /* RESIZE HANDLE */
  .panel-resize-handle {
    position: absolute;
    right: -4px;
    top: 0;
    width: 8px;
    height: 100%;
    cursor: ew-resize;
    z-index: 3;
    pointer-events: none;
  }

  .panel-content-wrapper:hover .panel-resize-handle {
    pointer-events: auto;
  }

  .panel-resize-handle::before {
    content: '';
    position: absolute;
    left: 2px;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 40px;
    background: #E5E7EB;
    border-radius: 1.5px;
    opacity: 0;
    transition: opacity 0.15s ease;
    pointer-events: none;
  }

  .panel-resize-handle:hover::before {
    opacity: 1;
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
    position: relative;
    z-index: 10;
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
    transition: max-width 0.3s ease;
  }

  .search-container.expanded {
    max-width: 250px;
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
    pointer-events: none;
  }

  /* SEARCH SUGGESTIONS */
  .search-suggestions {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    right: 0;
    background: #FFFFFF;
    border: none;
    border-radius: 4px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    max-height: 200px;
    overflow-y: auto;
    z-index: 1000;
    display: none;
    min-width: 154px;
  }

  .search-suggestions.visible {
    display: block;
  }

  .search-suggestion-item {
    height: 30px;
    padding: 0 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    transition: background 0.15s;
    font-size: 12px;
    gap: 10px;
  }

  .search-suggestion-item:not(.added):hover {
    background: #F5F5F5;
  }

  .search-suggestion-item.added {
    background: rgba(60, 241, 154, 0.20);
    cursor: default;
  }

  .suggestion-country-name {
    color: #1E1E1E;
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
  }

  .suggestion-add-btn {
    width: 24px;
    height: 24px;
    background: rgba(60, 241, 154, 0.20);
    border-radius: 4px;
    border: none;
    cursor: pointer;
    transition: background 0.15s;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
  }

  .suggestion-add-btn svg {
    width: 24px;
    height: 24px;
    stroke: #1E1E1E;
  }

  .search-suggestion-item:not(.added):hover .suggestion-add-btn {
    background: #F5F5F5;
  }

  .search-suggestion-item.added .suggestion-add-btn {
    display: none;
  }

  .no-results {
    padding: 12px;
    text-align: center;
    color: #757575;
    font-size: 11px;
  }

  /* CONTAINER SCROLLABLE */
  .panel-scrollable-content {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    background: #FFFFFF;
  }

  .panel-scrollable-content::-webkit-scrollbar {
    width: 8px;
  }

  .panel-scrollable-content::-webkit-scrollbar-track {
    background: #FFFFFF;
  }

  .panel-scrollable-content::-webkit-scrollbar-thumb {
    background: #E5E7EB;
    border-radius: 4px;
  }

  /* ============================================ */
  /* LAYERS TABLE SECTION */
  /* ============================================ */

  .layers-table-section {
    border-bottom: 1px solid #E5E7EB;
    background: #FFFFFF;
  }

  .layers-table-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px;
    cursor: pointer;
    user-select: none;
    transition: background 0.2s;
    background: #FFFFFF;
  }

  .layers-table-header:hover {
    background: #F5F5F5;
  }

  .layers-header-left {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
  }

  .layers-title {
    font-size: 14px;
    color: #1E1E1E;
    font-weight: 500;
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

  .layers-table-wrapper {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .layers-table-wrapper.expanded {
    max-height: 600px;
  }

  /* TABLE CONTAINER */
  .layers-table-container {
    position: relative;
    overflow: auto;
    max-height: 400px;
    background: #FFFFFF;
  }

  .layers-table-container::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  .layers-table-container::-webkit-scrollbar-track {
    background: #F5F5F5;
  }

  .layers-table-container::-webkit-scrollbar-thumb {
    background: #D1D5DB;
    border-radius: 3px;
  }

  .layers-table {
    width: 100%;
    border-collapse: collapse;
    background: #FFFFFF;
  }

  /* HEADER ROW - Sticky */
  .layers-table thead {
    position: sticky;
    top: 0;
    z-index: 3;
    background: #FFFFFF;
  }

  .layers-table th {
    padding: 8px 10px;
    text-align: center;
    font-size: 12px;
    font-weight: 400;
    color: #757575;
    background: #FFFFFF;
    white-space: nowrap;
    min-width: 65px;
    max-width: 85px;
    height: 30px;
    vertical-align: middle;
    cursor: move;
    user-select: none;
    transition: background 0.15s ease;
  }

  .layers-table th[draggable="true"]:hover {
    background: #F5F5F5;
  }

  .layers-table th:first-child {
    width: 36px;
    min-width: 36px;
    max-width: 36px;
    position: sticky;
    left: 0;
    z-index: 4;
    background: #FFFFFF;
    cursor: default;
  }

  .layers-table th:nth-child(2) {
    width: 80px;
    min-width: 80px;
    text-align: left;
    position: sticky;
    left: 36px;
    z-index: 4;
    background: #FFFFFF;
    font-weight: 500;
    color: #1E1E1E;
    cursor: default;
  }

  .layer-header-label {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
  }

  .layer-color-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  /* BODY ROWS */
  .layers-table tbody tr {
    height: 30px;
    transition: background 0.15s ease;
  }

  .layers-table tbody tr:nth-child(even) {
    background: #FFFFFF;
  }

  .layers-table tbody tr:nth-child(odd) {
    background: #FFFFFF;
  }

  .layers-table tbody tr:hover {
    background: #F0F0F0 !important;
  }

  .layers-table td {
    padding: 0 10px;
    text-align: center;
    font-size: 12px;
    color: #1E1E1E;
    min-width: 65px;
    max-width: 85px;
    height: 30px;
    vertical-align: middle;
    background: #FFFFFF;
  }

  /* Appliquer le fond vert UNIQUEMENT sur les cellules des lignes impaires */
  .layers-table tbody tr:nth-child(odd) td {
    background: linear-gradient(rgba(60, 241, 154, 0.1), rgba(60, 241, 154, 0.1)), #FFFFFF;
  }

  /* COLONNE 1 : Drag + Poubelle */
  .layers-table td:first-child {
    width: 36px;
    min-width: 36px;
    max-width: 36px;
    position: sticky;
    left: 0;
    z-index: 2;
    padding: 0;
  }

  /* Vert plus foncé sur colonne Actions des lignes impaires */
  .layers-table tbody tr:nth-child(odd) td:first-child {
    background: linear-gradient(rgba(60, 241, 154, 0.2), rgba(60, 241, 154, 0.2)), #FFFFFF;
  }

  .row-actions {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2px;
    height: 100%;
    opacity: 0;
    transition: opacity 0.15s ease;
  }

  .layers-table tbody tr:hover .row-actions {
    opacity: 1;
  }

  .drag-handle,
  .delete-btn {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2px;
  }

  .drag-handle {
    cursor: grab;
  }

  .drag-handle:active {
    cursor: grabbing;
  }

  .drag-handle svg,
  .delete-btn svg {
    width: 12px;
    height: 12px;
  }

  .delete-btn:hover svg path,
  .delete-btn:hover svg circle {
    stroke: #EF4444;
  }

  /* COLONNE 2 : Pays (sticky left) */
  .layers-table td:nth-child(2) {
    width: 80px;
    min-width: 80px;
    text-align: left;
    position: sticky;
    left: 36px;
    z-index: 2;
    font-weight: 400;
    line-height: 1.2;
    padding: 4px 10px;
  }

  /* Vert foncé sur colonne Countries des lignes impaires (même vert que Actions) */
  .layers-table tbody tr:nth-child(odd) td:nth-child(2) {
    background: linear-gradient(rgba(60, 241, 154, 0.2), rgba(60, 241, 154, 0.2)), #FFFFFF;
  }

  /* COLONNES LAYERS : Checkbox */
  .layer-cell {
    position: relative;
    z-index: 1;
  }

  .layer-checkbox {
    width: 22px;
    height: 22px;
    border-radius: 4px;
    cursor: pointer;
    transition: opacity 0.15s ease, transform 0.15s ease;
    opacity: 0;
    margin: 0 auto;
  }

  .layer-checkbox.active {
    opacity: 1;
  }

  .layer-checkbox:hover {
    transform: scale(1.05);
  }

  .layer-checkbox[data-layer="regions"] {
    background: rgba(255, 56, 60, 0.80);
  }

  .layer-checkbox[data-layer="lakes"] {
    background: rgba(255, 141, 40, 0.80);
  }

  .layer-checkbox[data-layer="rivers"] {
    background: rgba(52, 199, 89, 0.80);
  }

  .layer-checkbox[data-layer="capitals"] {
    background: rgba(255, 204, 0, 0.80);
  }

  /* Empty state */
  .layers-table-empty {
    padding: 24px;
    text-align: center;
    color: #757575;
    font-size: 11px;
  }

  /* ============================================ */
  /* CONTINENTS SECTION */
  /* ============================================ */

  .continents-section {
    background: #FFFFFF;
  }

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

  .countries-grid-wrapper {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .countries-grid-wrapper.expanded {
    max-height: 2000px;
  }

  .countries-grid {
    display: grid;
    grid-template-columns: repeat(2, 140px);
    justify-content: flex-start;
    gap: 6px;
    padding: 6px 12px 12px 12px;
    background: #FFFFFF;
  }

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

<!-- SIDEBAR BLANCHE -->
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
  <div class="panel-content-wrapper" id="panel-wrapper">
    <!-- RESIZE HANDLE -->
    <div class="panel-resize-handle" id="panel-resize-handle"></div>

    <!-- HEADER -->
    <div class="panel-header">
      <div class="panel-title">Countries to display</div>
      <div class="search-container" id="search-container">
        <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
        <input type="text" class="search-input" id="search-input" placeholder="Search..." autocomplete="off">
        
        <!-- SUGGESTIONS -->
        <div class="search-suggestions" id="search-suggestions">
          <!-- Généré dynamiquement -->
        </div>
      </div>
    </div>

    <!-- CONTENU SCROLLABLE -->
    <div class="panel-scrollable-content" id="scrollable-content">
      
      <!-- SECTION 1 : LAYERS TABLE -->
      <div class="layers-table-section">
        <div class="layers-table-header" id="layers-header">
          <div class="layers-header-left">
            <div class="layers-title">Map Layers</div>
          </div>
          <svg class="expand-icon expanded" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>

        <div class="layers-table-wrapper expanded" id="layers-table-wrapper">
          <div class="layers-table-container">
            <table class="layers-table">
              <thead>
                <tr>
                  <th></th>
                  <th>Countries</th>
                  <th draggable="true" data-layer-index="0">
                    <div class="layer-header-label">
                      <span class="layer-color-dot" style="background: rgba(255, 56, 60, 0.80);"></span>
                      Regions
                    </div>
                  </th>
                  <th draggable="true" data-layer-index="1">
                    <div class="layer-header-label">
                      <span class="layer-color-dot" style="background: rgba(255, 141, 40, 0.80);"></span>
                      Lakes
                    </div>
                  </th>
                  <th draggable="true" data-layer-index="2">
                    <div class="layer-header-label">
                      <span class="layer-color-dot" style="background: rgba(52, 199, 89, 0.80);"></span>
                      Rivers
                    </div>
                  </th>
                  <th draggable="true" data-layer-index="3">
                    <div class="layer-header-label">
                      <span class="layer-color-dot" style="background: rgba(255, 204, 0, 0.80);"></span>
                      Capitals
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody id="layers-table-body">
                <tr>
                  <td colspan="6" class="layers-table-empty">
                    Search for countries and click "+ Add to layers" to configure layers
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- SECTION 2 : CONTINENTS -->
      <div class="continents-section" id="continents-list">
        <!-- Généré par JavaScript -->
      </div>

    </div>
  </div>
</div>

<script>
  // ============================================
  // DONNÉES
  // ============================================
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

  const LAYERS = ['regions', 'lakes', 'rivers', 'capitals'];

  // ============================================
  // ÉTAT
  // ============================================
  let panelOpen = false;
  let expandedContinents = {};
  let selectedCountries = {};
  let searchQuery = '';
  let layersTableExpanded = true;
  let layersTableCountries = [];
  let countryLayers = {};

  // Initialiser tous les pays comme cochés, Afrique ouverte
  Object.keys(COUNTRIES_DATA).forEach(continentKey => {
    expandedContinents[continentKey] = (continentKey === 'africa');
    COUNTRIES_DATA[continentKey].countries.forEach(country => {
      selectedCountries[country] = true;
    });
  });

  // ============================================
  // RESIZE FUNCTIONALITY
  // ============================================
  const MIN_WIDTH = 330;
  const MAX_WIDTH = 420;
  let isResizing = false;
  let startX = 0;
  let startWidth = 0;
  let currentPanelWidth = MIN_WIDTH;

  const resizeHandle = document.getElementById('panel-resize-handle');
  const panelWrapper = document.getElementById('panel-wrapper');
  const sidePanel = document.getElementById('countries-panel');

  // Force repaint de la bordure au chargement
  if (panelWrapper) {
    void panelWrapper.offsetHeight;
    panelWrapper.style.borderRight = '1px solid #E5E7EB';
  }

  if (!resizeHandle || !panelWrapper || !sidePanel) {
    console.warn('⚠️ Resize elements not found, disabling resize functionality');
  } else {
    
    function startResize(e) {
      if (e.target !== resizeHandle && !resizeHandle.contains(e.target)) {
        return;
      }

      isResizing = true;
      startX = e.clientX;
      startWidth = panelWrapper.offsetWidth;
      
      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none';
      
      e.preventDefault();
      e.stopPropagation();
      
      console.log('🎯 Resize started:', { startX, startWidth });
      
      // ✅ CRITIQUE: Attacher les listeners SEULEMENT pendant le resize
      document.addEventListener('mousemove', doResize, false);
      document.addEventListener('mouseup', stopResize, false);
    }

    function doResize(e) {
      if (!isResizing) return;
      
      const deltaX = e.clientX - startX;
      const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, startWidth + deltaX));
      
      if (panelWrapper && sidePanel) {
        panelWrapper.style.width = `${newWidth}px`;
        sidePanel.style.width = `${newWidth + 48}px`;
        currentPanelWidth = newWidth;
        updateClosedPosition();
      }
      
      // Ne PAS faire preventDefault/stopPropagation ici
    }

    function stopResize(e) {
      if (!isResizing) return;
      
      isResizing = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      
      // ✅ CRITIQUE: Retirer les listeners après le resize
      document.removeEventListener('mousemove', doResize, false);
      document.removeEventListener('mouseup', stopResize, false);
      
      console.log('✅ Resize finished:', currentPanelWidth + 'px');
    }

    function updateClosedPosition() {
      if (!panelOpen && sidePanel) {
        sidePanel.style.left = `-${currentPanelWidth + 48}px`;
      }
    }

    // Events UNIQUEMENT sur la poignée
    resizeHandle.addEventListener('mousedown', startResize, false);
    resizeHandle.addEventListener('touchstart', function(e) {
      e.preventDefault();
      e.stopPropagation();
      startResize(e.touches[0]);
    }, { passive: false, capture: false });
    
    // Safety: stop resize si on perd le focus
    window.addEventListener('blur', function() {
      if (isResizing) {
        console.log('⚠️ Window blur, stopping resize');
        stopResize();
      }
    });
  }

  // ============================================
  // ÉLÉMENTS DOM
  // ============================================
  const countriesIcon = document.getElementById('countries-icon');
  const countriesPanel = document.getElementById('countries-panel');
  const searchInput = document.getElementById('search-input');
  const searchContainer = document.getElementById('search-container');
  const searchSuggestions = document.getElementById('search-suggestions');
  const continentsList = document.getElementById('continents-list');
  const layersHeader = document.getElementById('layers-header');
  const layersTableWrapper = document.getElementById('layers-table-wrapper');
  const layersTableBody = document.getElementById('layers-table-body');

  // ============================================
  // TOGGLE PANNEAU
  // ============================================
  countriesIcon.addEventListener('click', () => {
    panelOpen = !panelOpen;
    
    if (panelOpen) {
      countriesPanel.style.left = '0';
    } else {
      // Use dynamic width for closed position
      countriesPanel.style.left = `-${currentPanelWidth + 48}px`;
    }
    
    countriesIcon.classList.toggle('active', panelOpen);
  });

  // ============================================
  // RECHERCHE
  // ============================================
  let searchTimeout;
  let lastSearchValue = '';

  searchInput.addEventListener('focus', () => {
    searchContainer.classList.add('expanded');
    
    // ✅ Si du texte est présent, réouvrir automatiquement le dropdown
    if (searchInput.value.trim() !== '') {
      searchQuery = searchInput.value.toLowerCase().trim();
      updateSearchSuggestions();
    }
  });

  searchInput.addEventListener('blur', () => {
    // ✅ Délai pour permettre le clic sur le bouton
    setTimeout(() => {
      searchContainer.classList.remove('expanded');
      searchSuggestions.classList.remove('visible');
    }, 250);
  });

  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase().trim();
    lastSearchValue = searchQuery;
    
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      updateSearchSuggestions();
      renderContinents();
    }, 150);
  });

  function updateSearchSuggestions() {
    if (!searchQuery) {
      searchSuggestions.classList.remove('visible');
      return;
    }

    const allCountries = Object.values(COUNTRIES_DATA)
      .flatMap(continent => continent.countries);
    
    const matches = allCountries.filter(country =>
      country.toLowerCase().includes(searchQuery)
    ).slice(0, 5);

    if (matches.length === 0) {
      searchSuggestions.innerHTML = '<div class="no-results">No countries found</div>';
      searchSuggestions.classList.add('visible');
      return;
    }

    searchSuggestions.innerHTML = matches.map(country => {
      const isInTable = layersTableCountries.includes(country);
      // ✅ Échapper les apostrophes pour éviter les bugs avec Côte d'Ivoire, etc.
      const escapedCountry = country.replace(/'/g, "\\'");
      return `
        <div class="search-suggestion-item ${isInTable ? 'added' : ''}">
          <span class="suggestion-country-name">${country}</span>
          ${!isInTable ? `
            <button class="suggestion-add-btn" onmousedown="event.preventDefault(); addCountryToTable('${escapedCountry}');">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14"/>
                <path d="M12 5v14"/>
              </svg>
            </button>
          ` : ''}
        </div>
      `;
    }).join('');

    searchSuggestions.classList.add('visible');
  }

  function addCountryToTable(countryName) {
    if (layersTableCountries.includes(countryName)) {
      return;
    }

    layersTableCountries.push(countryName);
    countryLayers[countryName] = [];
    
    renderLayersTable();
    
    // ✅ Mettre à jour l'affichage avec un délai pour ne pas interférer avec le focus
    setTimeout(() => {
      updateSearchSuggestions();
    }, 50);
    
    console.log(`✅ Added ${countryName} to layers table, menu stays open`);
  }

  function addCountryToTableAndClose(countryName) {
    if (layersTableCountries.includes(countryName)) {
      return;
    }

    layersTableCountries.push(countryName);
    countryLayers[countryName] = [];
    
    renderLayersTable();
    
    // ✅ Fermer le dropdown
    searchSuggestions.classList.remove('visible');
    searchContainer.classList.remove('expanded');
    searchInput.blur();
    
    console.log(`✅ Added ${countryName} to layers table and closed dropdown`);
  }

  // ============================================
  // LAYERS TABLE - Toggle Section
  // ============================================
  layersHeader.addEventListener('click', () => {
    layersTableExpanded = !layersTableExpanded;
    layersTableWrapper.classList.toggle('expanded', layersTableExpanded);
    layersHeader.querySelector('.expand-icon').classList.toggle('expanded', layersTableExpanded);
  });

  // ============================================
  // LAYERS TABLE - Render
  // ============================================
  function renderLayersTable() {
    if (layersTableCountries.length === 0) {
      layersTableBody.innerHTML = `
        <tr>
          <td colspan="6" class="layers-table-empty">
            Search for countries and click "+ Add to layers" to configure layers
          </td>
        </tr>
      `;
      return;
    }

    layersTableBody.innerHTML = '';

    layersTableCountries.forEach(country => {
      const escapedCountry = country.replace(/'/g, "\\'");
      
      const row = document.createElement('tr');
      row.setAttribute('data-country', country);
      row.setAttribute('draggable', 'true');

      // Col 1 : Actions
      const actionsCell = document.createElement('td');
      actionsCell.innerHTML = `
        <div class="row-actions">
          <div class="drag-handle">
            <svg width="8" height="13" viewBox="0 0 8 13" fill="none">
              <circle cx="1.77778" cy="1.77778" r="1.77778" fill="#B3B3B3"/>
              <circle cx="6.22224" cy="10.6667" r="1.77778" fill="#B3B3B3"/>
              <circle cx="6.22224" cy="6.22224" r="1.77778" fill="#B3B3B3"/>
              <circle cx="6.22224" cy="1.77778" r="1.77778" fill="#B3B3B3"/>
              <circle cx="1.77778" cy="6.22224" r="1.77778" fill="#B3B3B3"/>
              <circle cx="1.77778" cy="10.6667" r="1.77778" fill="#B3B3B3"/>
            </svg>
          </div>
          <div class="delete-btn" onclick="deleteCountryRow('${escapedCountry}')">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M9.5 3V10C9.5 10.2652 9.39464 10.5196 9.20711 10.7071C9.01957 10.8946 8.76522 11 8.5 11H3.5C3.23478 11 2.98043 10.8946 2.79289 10.7071C2.60536 10.5196 2.5 10.2652 2.5 10V3" stroke="#B3B3B3" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M1.5 3H10.5" stroke="#B3B3B3" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M4 3V2C4 1.73478 4.10536 1.48043 4.29289 1.29289C4.48043 1.10536 4.73478 1 5 1H7C7.26522 1 7.51957 1.10536 7.70711 1.29289C7.89464 1.48043 8 1.73478 8 2V3" stroke="#B3B3B3" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
      `;
      row.appendChild(actionsCell);

      // Col 2 : Country
      const countryCell = document.createElement('td');
      countryCell.textContent = country;
      row.appendChild(countryCell);

      // Cols 3-6 : Layers
      LAYERS.forEach(layer => {
        const layerCell = document.createElement('td');
        layerCell.className = 'layer-cell';
        
        const isActive = countryLayers[country] && countryLayers[country].includes(layer);
        
        layerCell.innerHTML = `
          <div class="layer-checkbox ${isActive ? 'active' : ''}" 
               data-layer="${layer}" 
               data-country="${country}"
               onclick="toggleLayer('${escapedCountry}', '${layer}')">
          </div>
        `;
        
        row.appendChild(layerCell);
      });

      layersTableBody.appendChild(row);
    });

    setupRowDragAndDrop();
  }

  // ============================================
  // TOGGLE LAYER
  // ============================================
  function toggleLayer(country, layer) {
    if (!countryLayers[country]) {
      countryLayers[country] = [];
    }

    const index = countryLayers[country].indexOf(layer);
    if (index > -1) {
      countryLayers[country].splice(index, 1);
    } else {
      countryLayers[country].push(layer);
    }

    renderLayersTable();
    
    if (typeof window.mapFunctions !== 'undefined' && window.mapFunctions.toggleLayerForCountry) {
      window.mapFunctions.toggleLayerForCountry(country, layer, countryLayers[country].includes(layer));
    }

    console.log(`Toggle ${layer} for ${country}:`, countryLayers[country]);
  }

  // ============================================
  // DELETE COUNTRY ROW
  // ============================================
  function deleteCountryRow(country) {
    const index = layersTableCountries.indexOf(country);
    if (index > -1) {
      layersTableCountries.splice(index, 1);
      delete countryLayers[country];
      renderLayersTable();
    }
  }

  // ============================================
  // DRAG & DROP ROWS
  // ============================================
  let draggedRow = null;

  function setupRowDragAndDrop() {
    const rows = layersTableBody.querySelectorAll('tr');

    rows.forEach(row => {
      row.addEventListener('dragstart', (e) => {
        draggedRow = row;
        row.style.opacity = '0.5';
      });

      row.addEventListener('dragend', (e) => {
        row.style.opacity = '1';
        
        const newOrder = [];
        layersTableBody.querySelectorAll('tr').forEach(r => {
          const country = r.getAttribute('data-country');
          if (country) newOrder.push(country);
        });
        layersTableCountries = newOrder;
        
        draggedRow = null;
      });

      row.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (draggedRow && draggedRow !== row) {
          const rect = row.getBoundingClientRect();
          const midpoint = rect.top + rect.height / 2;
          
          if (e.clientY < midpoint) {
            row.parentNode.insertBefore(draggedRow, row);
          } else {
            row.parentNode.insertBefore(draggedRow, row.nextSibling);
          }
        }
      });
    });
  }

  // ============================================
  // DRAG & DROP COLUMNS (LAYERS)
  // ============================================
  let draggedColumn = null;

  function setupColumnDragAndDrop() {
    const headers = document.querySelectorAll('.layers-table th[draggable="true"]');

    headers.forEach(header => {
      header.addEventListener('dragstart', (e) => {
        draggedColumn = header;
        header.style.opacity = '0.5';
      });

      header.addEventListener('dragend', (e) => {
        header.style.opacity = '1';
        
        // ✅ Lire l'ordre actuel du DOM (après les déplacements visuels)
        const headersInOrder = document.querySelectorAll('.layers-table th[draggable="true"]');
        const newOrder = [];
        
        // ✅ Mettre à jour les data-layer-index pour correspondre à la position visuelle
        headersInOrder.forEach((h, visualIndex) => {
          const oldIndex = parseInt(h.getAttribute('data-layer-index'));
          newOrder.push(LAYERS[oldIndex]);
          h.setAttribute('data-layer-index', visualIndex);
        });
        
        // ✅ Mettre à jour l'array LAYERS avec le nouvel ordre
        LAYERS.length = 0;
        LAYERS.push(...newOrder);
        
        // ✅ Redessiner le tableau avec le nouvel ordre
        renderLayersTable();
        
        draggedColumn = null;
      });

      header.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (draggedColumn && draggedColumn !== header) {
          const rect = header.getBoundingClientRect();
          const midpoint = rect.left + rect.width / 2;
          
          if (e.clientX < midpoint) {
            header.parentNode.insertBefore(draggedColumn, header);
          } else {
            header.parentNode.insertBefore(draggedColumn, header.nextSibling);
          }
        }
      });
    });
  }

  setupColumnDragAndDrop();

  // ============================================
  // CONTINENTS - Filtrage
  // ============================================
  function shouldShowContinent(continentData) {
    if (!searchQuery) return true;
    if (continentData.name.toLowerCase().includes(searchQuery)) return true;
    return continentData.countries.some(c => c.toLowerCase().includes(searchQuery));
  }

  function shouldShowCountry(countryName, continentData) {
    if (!searchQuery) return true;
    return countryName.toLowerCase().includes(searchQuery);
  }

  // ============================================
  // TOGGLE CONTINENT
  // ============================================
  function toggleContinent(continentKey) {
    const scrollPosition = document.getElementById('scrollable-content').scrollTop;
    
    expandedContinents[continentKey] = !expandedContinents[continentKey];
    
    const sections = continentsList.querySelectorAll('.continent-section');
    const continentKeys = Object.keys(COUNTRIES_DATA);
    const index = continentKeys.indexOf(continentKey);
    
    if (sections[index]) {
      const wrapper = sections[index].querySelector('.countries-grid-wrapper');
      const icon = sections[index].querySelector('.expand-icon');
      
      if (wrapper) {
        wrapper.classList.toggle('expanded', expandedContinents[continentKey]);
      }
      
      if (icon) {
        icon.classList.toggle('expanded', expandedContinents[continentKey]);
      }
    }
    
    requestAnimationFrame(() => {
      document.getElementById('scrollable-content').scrollTop = scrollPosition;
    });
  }

  // ============================================
  // CLEAR CONTINENT
  // ============================================
  function clearContinent(continentKey, e) {
    e.stopPropagation();
    
    const scrollPosition = document.getElementById('scrollable-content').scrollTop;
    
    const allChecked = COUNTRIES_DATA[continentKey].countries.every(c => selectedCountries[c]);
    COUNTRIES_DATA[continentKey].countries.forEach(country => {
      selectedCountries[country] = !allChecked;
    });
    
    renderContinents();
    syncWithMap();
    
    requestAnimationFrame(() => {
      document.getElementById('scrollable-content').scrollTop = scrollPosition;
    });
  }

  // ============================================
  // TOGGLE COUNTRY
  // ============================================
  function toggleCountry(countryName) {
    selectedCountries[countryName] = !selectedCountries[countryName];
    
    const scrollPosition = document.getElementById('scrollable-content').scrollTop;
    
    renderContinents();
    syncWithMap();
    
    requestAnimationFrame(() => {
      document.getElementById('scrollable-content').scrollTop = scrollPosition;
    });
  }

  // ============================================
  // SYNC WITH MAP
  // ============================================
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

    console.log('📊 Sync:', visibleCountries.length, 'visible,', hiddenCountries.length, 'hidden');
  }

  // ============================================
  // SVG PATHS
  // ============================================
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
      console.warn(`SVG error for ${countryName}:`, error);
      return `
        <svg viewBox="0 0 100 80" xmlns="http://www.w3.org/2000/svg">
          <text x="50" y="40" text-anchor="middle" font-size="8" fill="currentColor" opacity="0.3">
            ${countryName.substring(0, 3).toUpperCase()}
          </text>
        </svg>
      `;
    }
  }

  // ============================================
  // RENDER CONTINENTS
  // ============================================
  function renderContinents() {
    continentsList.innerHTML = '';

    if (searchQuery) {
      Object.keys(COUNTRIES_DATA).forEach(key => {
        if (shouldShowContinent(COUNTRIES_DATA[key])) {
          expandedContinents[key] = true;
        }
      });
    }

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

  // ============================================
  // INITIALISATION
  // ============================================
  renderLayersTable();
  renderContinents();
  syncWithMap();

  setTimeout(() => {
    const countryElements = document.querySelectorAll('[data-country-name]');
    
    if (countryElements.length === 0) {
      console.warn('⚠️ No countries found in MapFlow');
      return;
    }
    
    console.log(`🗺️ Extracting ${countryElements.length} SVG paths...`);
    
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
      console.log(`✅ ${extracted} SVG paths extracted`);
      renderContinents();
    }
  }, 2000);

  // ============================================
  // API PUBLIQUE
  // ============================================
  window.countriesPanel = {
    toggle: () => {
      panelOpen = !panelOpen;
      if (panelOpen) {
        countriesPanel.style.left = '0';
      } else {
        countriesPanel.style.left = `-${currentPanelWidth + 48}px`;
      }
      countriesIcon.classList.toggle('active', panelOpen);
    },
    open: () => {
      panelOpen = true;
      countriesPanel.style.left = '0';
      countriesIcon.classList.add('active');
    },
    close: () => {
      panelOpen = false;
      countriesPanel.style.left = `-${currentPanelWidth + 48}px`;
      countriesIcon.classList.remove('active');
    },
    getSelectedCountries: () => {
      return Object.keys(selectedCountries).filter(c => selectedCountries[c]);
    },
    getLayersTableCountries: () => {
      return layersTableCountries;
    },
    getCountryLayers: (countryName) => {
      return countryLayers[countryName] || [];
    }
  };

  console.log('✅ Countries panel initialized with resizable width (Bubble-optimized)');
</script>