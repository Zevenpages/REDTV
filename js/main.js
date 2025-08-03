/**
 * RED TV Homepage JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded, initializing scripts...");
    
    // Mobile menu toggle and footer year are now handled in header.js and footer.js
    
    // Wait a bit for the DOM to be fully rendered with the components
    setTimeout(async () => {
        console.log("Executing main page modifications...");
        
        // First adjust position of Ver Planes and Mis Servicios buttons
        adjustQuickAccessButtons();
        
        // Then initialize the interactive coverage map
        initInteractiveCoverageMap();
        
        // Initialize app downloads functionality
        try {
            const { initAppDownloads } = await import('./app-downloads.js');
            initAppDownloads();
        } catch (error) {
            console.error('Error initializing app downloads:', error);
        }
        
        // Finally swap the coverage and app-promo sections if we're on the index page
        swapSections();
        
        console.log("Main page modifications complete!");
    }, 300);
});

/**
 * Adjust the position of the quick access buttons
 * to align with the end of the banner
 */
function adjustQuickAccessButtons() {
    const quickAccessSection = document.querySelector('.quick-access');
    const hero = document.querySelector('.hero');
    
    if (quickAccessSection && hero) {
        // Position the buttons lower, not on the banner
        quickAccessSection.style.marginTop = '20px'; // Changed from -100px to 20px to move down
        quickAccessSection.style.marginBottom = '40px';
        quickAccessSection.style.position = 'relative';
        quickAccessSection.style.zIndex = '10';
        
        // Make the buttons more visible but smaller
        const cards = quickAccessSection.querySelectorAll('.quick-access-card');
        cards.forEach(card => {
            card.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
            card.style.transform = 'translateY(0)';
            card.style.background = 'white';
            card.style.border = '2px solid #f0f0f0';
            card.style.padding = '1.5rem'; // Reduced padding to make cards smaller
        });
        
        // Make the icons smaller
        const icons = quickAccessSection.querySelectorAll('.material-icons');
        icons.forEach(icon => {
            icon.style.fontSize = '2.5rem'; // Reduced from 3rem
        });
    }
}

/**
 * Swap the positions of the RED TV Play section and Coverage Map section
 */
function swapSections() {
    const appPromoSection = document.querySelector('.app-promo');
    const coverageSection = document.querySelector('.coverage-promotion');
    
    if (appPromoSection && coverageSection) {
        // Get the parent element
        const parent = appPromoSection.parentNode;
        
        // Get the next element after the coverage section (if any)
        const nextElement = coverageSection.nextElementSibling;
        
        // Add a small delay to make sure DOM is fully loaded
        setTimeout(() => {
            // Remove the app-promo section from its current position
            parent.removeChild(appPromoSection);
            
            // Add additional spacing to separate sections better
            appPromoSection.style.setProperty('margin-top', '50px', 'important');
            appPromoSection.style.setProperty('margin-bottom', '50px', 'important');
            
            // If there's an element after the coverage section, insert before it
            if (nextElement) {
                parent.insertBefore(appPromoSection, nextElement);
            } else {
                // Otherwise, append it to the end
                parent.appendChild(appPromoSection);
            }
            
            // Apply transition for smoother visual appearance
            appPromoSection.style.transition = 'all 0.3s ease';
            coverageSection.style.transition = 'all 0.3s ease';
        }, 100);
    }
}

/**
 * Initialize the interactive coverage map
 */
function initInteractiveCoverageMap() {
    const mapContainer = document.getElementById('interactive-coverage-map');
    
    if (!mapContainer) return;
    
    // Load the SVG map file
    fetch('departamentos-chaco.svg')
        .then(response => response.text())
        .then(svgContent => {
            // Insert the SVG into the container
            mapContainer.innerHTML = svgContent;
            
            // Get the SVG element
            const svg = mapContainer.querySelector('svg');
            
            // Resize SVG to fit container
            svg.setAttribute('width', '100%');
            svg.setAttribute('height', '100%');
            
            // Set transparent background
            svg.style.backgroundColor = 'transparent';
            
            // Add styling to the SVG paths
            const paths = svg.querySelectorAll('#departamentos-chaco path');
            
            // Coverage data for the departments
            const departmentCoverage = [
                { id: 'dept-1', name: 'San Fernando', status: 'active-service' }, // Resistencia, etc.
                { id: 'dept-2', name: 'Comandante Fernández', status: 'active-service' }, // Sáenz Peña
                { id: 'dept-3', name: 'Mayor Luis J. Fontana', status: 'active-service' }, // Villa Ángela
                { id: 'dept-4', name: 'Chacabuco', status: 'active-service' }, // Charata
                { id: 'dept-5', name: 'Quitilipi', status: 'planned-expansion' },
                { id: 'dept-6', name: 'Maipú', status: 'planned-expansion' },
                { id: 'dept-7', name: 'Güemes', status: 'planned-expansion' },
                { id: 'dept-8', name: 'Libertador General San Martín', status: 'no-service' },
                { id: 'dept-9', name: 'Sargento Cabral', status: 'no-service' },
                { id: 'dept-10', name: 'Bermejo', status: 'no-service' },
                { id: 'dept-11', name: 'Primero de Mayo', status: 'no-service' },
                { id: 'dept-12', name: 'Libertad', status: 'no-service' },
                // Add all other departments as 'no-service' by default
            ];
            
            // Since we don't have IDs in the original SVG, we'll add them
            paths.forEach((path, index) => {
                path.id = `dept-${index + 1}`;
                
                // Default all paths to 'no-service'
                path.classList.add('no-service');
                
                // Find the corresponding data and update class if needed
                const coverageData = departmentCoverage.find(dept => dept.id === path.id);
                if (coverageData) {
                    // Remove the default class and add the correct one
                    path.classList.remove('no-service');
                    path.classList.add(coverageData.status);
                }
                
                // Add tooltip functionality
                path.addEventListener('mouseover', function(e) {
                    const departmentName = coverageData ? coverageData.name : 'Departamento';
                    const status = coverageData ? coverageData.status : 'no-service';
                    
                    showMapTooltip(e, departmentName, status);
                });
                
                path.addEventListener('mousemove', function(e) {
                    updateMapTooltipPosition(e);
                });
                
                path.addEventListener('mouseout', function() {
                    hideMapTooltip();
                });
            });
        })
        .catch(error => {
            console.error('Error loading SVG:', error);
            mapContainer.innerHTML = '<p class="error-message">Error al cargar el mapa. Por favor, recargá la página.</p>';
        });
}

/**
 * Show tooltip when hovering over a department
 */
function showMapTooltip(event, departmentName, status) {
    hideMapTooltip(); // Remove any existing tooltip
    
    const tooltip = document.createElement('div');
    tooltip.className = 'map-tooltip';
    
    let statusText = '';
    switch (status) {
        case 'active-service':
            statusText = 'Con servicio activo';
            break;
        case 'planned-expansion':
            statusText = 'Próxima expansión';
            break;
        case 'no-service':
            statusText = 'Sin servicio disponible';
            break;
        default:
            statusText = 'Estado desconocido';
    }
    
    tooltip.innerHTML = `
        <strong>${departmentName}</strong><br>
        ${statusText}
    `;
    
    // Style the tooltip
    tooltip.style.position = 'absolute';
    tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    tooltip.style.color = 'white';
    tooltip.style.padding = '8px 12px';
    tooltip.style.borderRadius = '4px';
    tooltip.style.fontSize = '14px';
    tooltip.style.zIndex = '1000';
    tooltip.style.pointerEvents = 'none';
    
    document.body.appendChild(tooltip);
    
    // Position the tooltip
    updateMapTooltipPosition(event);
}

/**
 * Update tooltip position as mouse moves
 */
function updateMapTooltipPosition(event) {
    const tooltip = document.querySelector('.map-tooltip');
    if (tooltip) {
        tooltip.style.left = (event.pageX + 15) + 'px';
        tooltip.style.top = (event.pageY + 15) + 'px';
    }
}

/**
 * Hide tooltip when moving away from a department
 */
function hideMapTooltip() {
    const tooltip = document.querySelector('.map-tooltip');
    if (tooltip) {
        tooltip.remove();
    }
} 