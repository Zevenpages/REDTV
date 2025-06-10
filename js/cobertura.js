/**
 * RED TV Coverage Map JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the map
    initCoverageMap();
    
    // Initialize accordion functionality
    initAccordion();
    
    // Add event listeners to filter checkboxes
    setupFilters();
});

/**
 * Initialize the interactive coverage map
 */
function initCoverageMap() {
    const mapContainer = document.getElementById('chaco-map');
    if (!mapContainer) return;
    
    // Load the SVG map file
    fetch('departamentos-chaco.svg')
        .then(response => response.text())
        .then(svgContent => {
            // Insert the SVG into the container
            mapContainer.innerHTML = svgContent;
            
            // After the SVG is loaded, add data and event listeners
            setupMapInteractivity();
            
            // Populate the list of localities with coverage
            populateLocalitiesList();
        })
        .catch(error => {
            console.error('Error loading SVG:', error);
            mapContainer.innerHTML = '<p class="error-message">Error al cargar el mapa. Por favor, recargá la página.</p>';
        });
}

/**
 * Add interactivity to the map
 */
function setupMapInteractivity() {
    // Get all department paths from the SVG
    const departmentPaths = document.querySelectorAll('#departamentos-chaco path');
    
    // Department coverage data (this would ideally come from a database)
    const departmentData = {
        // Key is the path ID, which can be assigned in the SVG file
        'dept-1': { 
            name: 'San Fernando',
            localities: [
                { name: 'Resistencia', services: ['fiber'] },
                { name: 'Barranqueras', services: ['fiber'] },
                { name: 'Fontana', services: ['fiber'] },
                { name: 'Puerto Vilelas', services: ['fiber'] }
            ]
        },
        'dept-2': { 
            name: 'Comandante Fernández',
            localities: [
                { name: 'Presidencia Roque Sáenz Peña', services: ['fiber'] }
            ]
        },
        'dept-3': { 
            name: 'Mayor Luis J. Fontana',
            localities: [
                { name: 'Villa Ángela', services: ['fiber'] }
            ]
        },
        'dept-4': { 
            name: 'Chacabuco',
            localities: [
                { name: 'Charata', services: ['fiber'] }
            ]
        },
        'dept-5': { 
            name: 'Quitilipi',
            localities: [
                { name: 'Quitilipi', services: ['expansion'] }
            ]
        },
        'dept-6': { 
            name: 'Maipú',
            localities: [
                { name: 'Tres Isletas', services: ['expansion'] }
            ]
        },
        'dept-7': { 
            name: 'Güemes',
            localities: [
                { name: 'Juan José Castelli', services: ['wireless'] }
            ]
        },
        'dept-8': { 
            name: 'Libertador General San Martín',
            localities: [
                { name: 'General José de San Martín', services: ['wireless'] }
            ]
        },
        'dept-9': { 
            name: 'Sargento Cabral',
            localities: [
                { name: 'Las Garcitas', services: ['wireless'] },
                { name: 'Colonia Elisa', services: ['expansion'] }
            ]
        },
        'dept-10': {
            name: 'Bermejo',
            localities: [
                { name: 'General Vedia', services: ['wireless'] },
                { name: 'Las Palmas', services: ['wireless'] }
            ]
        }
    };
    
    // Since we don't have IDs in the original SVG, we'll add them
    // This is a workaround; in a real scenario, the SVG would already have appropriate IDs
    departmentPaths.forEach((path, index) => {
        // Assign IDs to paths
        path.id = `dept-${index + 1}`;
        
        // If we have data for this department, add the appropriate classes
        if (departmentData[path.id]) {
            const data = departmentData[path.id];
            
            // Check what kind of services are available
            let hasWireless = false;
            let hasFiber = false;
            let hasExpansion = false;
            
            data.localities.forEach(locality => {
                if (locality.services.includes('fiber')) hasFiber = true;
                if (locality.services.includes('wireless')) hasWireless = true;
                if (locality.services.includes('expansion')) hasExpansion = true;
            });
            
            // Add appropriate classes
            if (hasFiber) path.classList.add('fiber-coverage');
            if (hasExpansion) path.classList.add('expansion');
            if (hasWireless) path.classList.add('wireless');
        }
        
        // Add event listeners for interactivity
        path.addEventListener('mouseover', function(e) {
            showPathTooltip(e, path, departmentData[path.id]);
        });
        
        path.addEventListener('mouseout', function() {
            hidePathTooltip();
        });
        
        path.addEventListener('click', function() {
            selectDepartment(path, departmentData[path.id]);
        });
    });
}

/**
 * Show tooltip when hovering over a department
 */
function showPathTooltip(event, path, departmentData) {
    const tooltip = document.createElement('div');
    tooltip.className = 'map-tooltip';
    
    if (departmentData) {
        tooltip.textContent = departmentData.name;
    } else {
        tooltip.textContent = 'Departamento';
    }
    
    document.body.appendChild(tooltip);
    
    // Position the tooltip near the mouse
    updateTooltipPosition(event);
    
    // Update position on mousemove
    path.addEventListener('mousemove', updateTooltipPosition);
    
    function updateTooltipPosition(e) {
        tooltip.style.left = (e.pageX + 15) + 'px';
        tooltip.style.top = (e.pageY + 15) + 'px';
    }
}

/**
 * Hide tooltip when moving away from a department
 */
function hidePathTooltip() {
    const tooltip = document.querySelector('.map-tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

/**
 * Select a department and show details
 */
function selectDepartment(path, departmentData) {
    // Remove selection from all departments
    document.querySelectorAll('#departamentos-chaco path.selected').forEach(p => {
        p.classList.remove('selected');
    });
    
    // Add selected class to this department
    path.classList.add('selected');
    
    // Update info panel
    const infoPanel = document.getElementById('map-hover-info');
    
    if (departmentData) {
        let servicesAvailable = [];
        
        departmentData.localities.forEach(locality => {
            locality.services.forEach(service => {
                if (!servicesAvailable.includes(service)) {
                    servicesAvailable.push(service);
                }
            });
        });
        
        let servicesText = '';
        if (servicesAvailable.includes('fiber')) servicesText += '<span>✓ Red de Fibra Óptica</span>';
        if (servicesAvailable.includes('expansion')) servicesText += '<span>✓ Próxima Expansión</span>';
        if (servicesAvailable.includes('wireless')) servicesText += '<span>✓ Internet Inalámbrico</span>';
        
        infoPanel.innerHTML = `
            <h4>${departmentData.name}</h4>
            <p>Localidades con cobertura: ${departmentData.localities.length}</p>
            <div class="coverage-details">
                ${servicesText}
            </div>
        `;
        
        // Highlight this department's localities in the list
        highlightLocalitiesInList(departmentData.localities.map(l => l.name));
    } else {
        infoPanel.innerHTML = `
            <p>No hay información disponible para este departamento.</p>
        `;
        
        // Reset highlighting in the list
        resetLocalitiesHighlight();
    }
}

/**
 * Populate the list of localities with coverage
 */
function populateLocalitiesList() {
    const localitiesList = document.querySelector('.localities-with-service');
    if (!localitiesList) return;
    
    // This would ideally come from a database or API
    const localities = [
        { name: 'Resistencia', services: ['fiber'] },
        { name: 'Barranqueras', services: ['fiber'] },
        { name: 'Fontana', services: ['fiber'] },
        { name: 'Puerto Vilelas', services: ['fiber'] },
        { name: 'Presidencia Roque Sáenz Peña', services: ['fiber'] },
        { name: 'Villa Ángela', services: ['fiber'] },
        { name: 'Charata', services: ['fiber'] },
        { name: 'Quitilipi', services: ['expansion'] },
        { name: 'Tres Isletas', services: ['expansion'] },
        { name: 'Machagai', services: ['expansion'] },
        { name: 'Las Breñas', services: ['expansion'] },
        { name: 'Colonia Elisa', services: ['expansion'] },
        { name: 'Juan José Castelli', services: ['wireless'] },
        { name: 'General José de San Martín', services: ['wireless'] },
        { name: 'Las Garcitas', services: ['wireless'] },
        { name: 'General Vedia', services: ['wireless'] },
        { name: 'Las Palmas', services: ['wireless'] }
    ];
    
    // Sort by name
    localities.sort((a, b) => a.name.localeCompare(b.name));
    
    // Generate HTML for each locality
    let html = '';
    localities.forEach(locality => {
        let serviceIcons = '';
        
        if (locality.services.includes('fiber')) {
            serviceIcons += '<span class="service-icon fiber" title="Red de Fibra Óptica"></span>';
        }
        if (locality.services.includes('expansion')) {
            serviceIcons += '<span class="service-icon expansion" title="Próxima Expansión"></span>';
        }
        if (locality.services.includes('wireless')) {
            serviceIcons += '<span class="service-icon wireless" title="Internet Inalámbrico"></span>';
        }
        
        html += `
            <div class="locality-item" data-name="${locality.name}">
                <span class="locality-name">${locality.name}</span>
                <div class="service-icons">${serviceIcons}</div>
            </div>
        `;
    });
    
    localitiesList.innerHTML = html;
}

/**
 * Highlight localities in list that belong to selected department
 */
function highlightLocalitiesInList(localityNames) {
    // Remove highlight from all
    resetLocalitiesHighlight();
    
    // Add highlight to matching localities
    localityNames.forEach(name => {
        const item = document.querySelector(`.locality-item[data-name="${name}"]`);
        if (item) {
            item.classList.add('highlighted');
        }
    });
}

/**
 * Reset highlighting for all localities
 */
function resetLocalitiesHighlight() {
    document.querySelectorAll('.locality-item.highlighted').forEach(item => {
        item.classList.remove('highlighted');
    });
}

/**
 * Set up filter checkboxes functionality
 */
function setupFilters() {
    const fiberCheckbox = document.getElementById('show-fiber');
    const expansionCheckbox = document.getElementById('show-expansion');
    const wirelessCheckbox = document.getElementById('show-wireless');
    
    if (!fiberCheckbox || !expansionCheckbox || !wirelessCheckbox) return;
    
    // Function to apply filters
    function applyFilters() {
        const showFiber = fiberCheckbox.checked;
        const showExpansion = expansionCheckbox.checked;
        const showWireless = wirelessCheckbox.checked;
        
        // Update map visibility
        document.querySelectorAll('#departamentos-chaco path').forEach(path => {
            const hasFiber = path.classList.contains('fiber-coverage');
            const hasExpansion = path.classList.contains('expansion');
            const hasWireless = path.classList.contains('wireless');
            
            // Determine if path should be visible
            const visible = (hasFiber && showFiber) || 
                           (hasExpansion && showExpansion) || 
                           (hasWireless && showWireless);
                           
            // Set opacity based on visibility
            path.style.opacity = visible ? '1' : '0.3';
        });
        
        // Update locality list visibility
        document.querySelectorAll('.locality-item').forEach(item => {
            const icons = item.querySelectorAll('.service-icon');
            let visible = false;
            
            icons.forEach(icon => {
                if ((icon.classList.contains('fiber') && showFiber) ||
                    (icon.classList.contains('expansion') && showExpansion) ||
                    (icon.classList.contains('wireless') && showWireless)) {
                    visible = true;
                }
            });
            
            item.style.display = visible ? 'flex' : 'none';
        });
    }
    
    // Add event listeners to checkboxes
    fiberCheckbox.addEventListener('change', applyFilters);
    expansionCheckbox.addEventListener('change', applyFilters);
    wirelessCheckbox.addEventListener('change', applyFilters);
}

/**
 * Initialize accordion functionality for FAQs
 */
function initAccordion() {
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        
        header.addEventListener('click', () => {
            // Close all accordions
            document.querySelectorAll('.accordion-item.active').forEach(activeItem => {
                if (activeItem !== item) {
                    activeItem.classList.remove('active');
                }
            });
            
            // Toggle this accordion
            item.classList.toggle('active');
        });
    });
} 