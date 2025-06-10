/**
 * RED TV Plans Page JavaScript - Database Connected Version
 */

import { initSupabase, getSupabase, DatabaseService } from './supabase-cdn.js';

// Global variables
let localities = [];
let zoneTypes = [];
let selectedLocality = null;
let selectedZoneType = null;
let availablePlans = [];

// DOM elements
let localitySelect, localityNextBtn, zoneToggle, servicesSection;
let selectedLocalitySpan, selectedZoneSpan, servicesGrid;
let servicesLoading, servicesError, servicesEmpty;

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Planes page initialized - Database version');
    initPlanesPage();
});

/**
 * Initialize the Plans page with database connection
 */
async function initPlanesPage() {
    // Get DOM elements
    getDOMElements();
    
    try {
        // Initialize Supabase silently
        await initSupabase();
        console.log('✅ Supabase initialized successfully');
        
        // Load initial data immediately
        await loadInitialData();
        
        // Setup event listeners
        setupEventListeners();
        
        // Handle verified location from URL
        handleVerifiedLocation();
        
        console.log('✅ Planes page fully initialized');
        
    } catch (error) {
        console.error('❌ Failed to initialize planes page:', error);
        // Show user-friendly error in locality select
        if (localitySelect) {
            localitySelect.innerHTML = '<option value="" disabled selected>Error al cargar localidades. Recarga la página.</option>';
        }
        }
    }

    /**
 * Get DOM elements
 */
function getDOMElements() {
    localitySelect = document.getElementById('locality-select');
    localityNextBtn = document.getElementById('locality-next');
    zoneToggle = document.getElementById('zone-toggle');
    servicesSection = document.getElementById('services-section');
    selectedLocalitySpan = document.getElementById('selected-locality');
    selectedZoneSpan = document.getElementById('selected-zone');
    servicesGrid = document.getElementById('services-grid');
    servicesLoading = document.getElementById('services-loading');
    servicesError = document.getElementById('services-error');
    servicesEmpty = document.getElementById('services-empty');
}

/**
 * Load initial data from database
 */
async function loadInitialData() {
    try {
        console.log('📍 Loading localities and zone types...');
        
        // Load localities and zone types in parallel
        [localities, zoneTypes] = await Promise.all([
            DatabaseService.getLocalities(),
            DatabaseService.getZoneTypes()
        ]);
        
        console.log(`✅ Loaded ${localities.length} localities and ${zoneTypes.length} zone types`);
        
        // Populate locality select
        populateLocalitySelect();
        
        // Populate zone types
        populateZoneTypes();
        
    } catch (error) {
        console.error('❌ Error loading initial data:', error);
        throw error;
    }
}

/**
 * Populate locality select dropdown
 */
function populateLocalitySelect() {
    localitySelect.innerHTML = '<option value="" disabled selected>Seleccioná tu localidad</option>';
    
    localities.forEach(locality => {
        const option = document.createElement('option');
        option.value = locality.id;
        option.textContent = locality.name;
        localitySelect.appendChild(option);
        });
    }

    /**
 * Populate zone types
 */
function populateZoneTypes() {
    zoneToggle.innerHTML = '';
    
    zoneTypes.forEach((zoneType, index) => {
        const toggleOption = document.createElement('div');
        toggleOption.className = 'toggle-option';
        
        const icon = getZoneTypeIcon(zoneType.name);
        const isChecked = index === 0 ? 'checked' : '';
        
        toggleOption.innerHTML = `
            <input type="radio" id="zone-${zoneType.id}" name="zone-type" value="${zoneType.id}" ${isChecked}>
            <label for="zone-${zoneType.id}">
                <span class="material-icons">${icon}</span>
                <span>${zoneType.name}</span>
            </label>
        `;
        
        zoneToggle.appendChild(toggleOption);
    });
    
    // Set default selected zone type
    if (zoneTypes.length > 0) {
        selectedZoneType = zoneTypes[0];
    }
}

/**
 * Get icon for zone type
 */
function getZoneTypeIcon(zoneName) {
    const iconMap = {
        'Urbano': 'location_city',
        'Rural': 'landscape',
        'Suburbano': 'home'
    };
    return iconMap[zoneName] || 'place';
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Locality selection
    localitySelect.addEventListener('change', function() {
        const selectedId = this.value;
        selectedLocality = localities.find(loc => loc.id === selectedId);
        localityNextBtn.disabled = !selectedLocality;
        
        console.log('📍 Selected locality:', selectedLocality?.name);
    });
    
    // Zone type selection
    zoneToggle.addEventListener('change', function(e) {
        if (e.target.name === 'zone-type') {
            const selectedId = e.target.value;
            selectedZoneType = zoneTypes.find(zone => zone.id === selectedId);
            
            console.log('🏘️ Selected zone type:', selectedZoneType?.name);
        }
    });
    
    // Navigation buttons
    document.querySelectorAll('.next-step').forEach(btn => {
        btn.addEventListener('click', goToNextStep);
    });
    
    document.querySelectorAll('.prev-step').forEach(btn => {
        btn.addEventListener('click', goToPreviousStep);
    });
}

/**
 * Handle verified location from URL parameters
 */
function handleVerifiedLocation() {
    if (window.verifiedLocation) {
        console.log('🔍 Handling verified location:', window.verifiedLocation);
        
        // Find the locality by name
        const locality = localities.find(loc => 
            loc.name.toLowerCase() === window.verifiedLocation.toLowerCase()
        );
        
        if (locality) {
            selectedLocality = locality;
            
            // Skip to zone selection
            skipToZoneSelection();
        } else {
            console.warn('⚠️ Verified location not found in database:', window.verifiedLocation);
        }
    }
}

/**
 * Skip to zone selection step
 */
function skipToZoneSelection() {
    const step1 = document.getElementById('step-locality');
    const step2 = document.getElementById('step-zone');
    
    if (step1 && step2) {
        step1.classList.remove('active');
        step1.style.display = 'none';
        
        step2.classList.add('active');
        step2.style.display = 'block';
        
        // Update step 2 header
        const step2Header = step2.querySelector('h2');
        if (step2Header) {
            step2Header.textContent = `2. Tipo de zona en ${selectedLocality.name}`;
        }
        
        console.log('⏭️ Skipped to zone selection for:', selectedLocality.name);
    }
}

/**
 * Go to next step
 */
function goToNextStep() {
    const activeStep = document.querySelector('.wizard-step.active');
    
    if (activeStep.id === 'step-locality') {
        if (!selectedLocality) {
            alert('Por favor selecciona una localidad');
            return;
        }
        
        // Go to zone selection
        activeStep.classList.remove('active');
        document.getElementById('step-zone').classList.add('active');
        
    } else if (activeStep.id === 'step-zone') {
        if (!selectedZoneType) {
            alert('Por favor selecciona un tipo de zona');
            return;
        }
        
        // Load and show services
        showServices();
    }
}

/**
 * Go to previous step
 */
function goToPreviousStep() {
    const activeStep = document.querySelector('.wizard-step.active');
    
    if (activeStep.id === 'step-zone') {
        activeStep.classList.remove('active');
        document.getElementById('step-locality').classList.add('active');
        document.getElementById('step-locality').style.display = 'block';
    }
}

/**
 * Show services section and load available plans
 */
async function showServices() {
    console.log('🔍 Loading services for:', selectedLocality.name, selectedZoneType.name);
    
    // Hide wizard and show services section
    document.querySelector('.service-wizard').style.display = 'none';
    servicesSection.style.display = 'block';
    
    // Update section headers
    selectedLocalitySpan.textContent = selectedLocality.name;
    selectedZoneSpan.textContent = selectedZoneType.name;
    
    // Load available services
    await loadAvailableServices();
    
    // Update WhatsApp link
    updateWhatsAppLink();
}

/**
 * Load available services from database
 */
async function loadAvailableServices() {
    try {
        // Show loading state
        showServicesState('loading');
        
        console.log('📋 Loading plans for locality:', selectedLocality.id, 'zone:', selectedZoneType.id);
        
        // Get available plans for the selected locality and zone type
        availablePlans = await DatabaseService.getAvailablePlans(selectedLocality.id, selectedZoneType.id);
        
        console.log(`✅ Found ${availablePlans.length} available plans`);
        
        if (availablePlans.length === 0) {
            showServicesState('empty');
        } else {
            showServicesState('success');
            renderServiceCards();
        }
        
    } catch (error) {
        console.error('❌ Error loading services:', error);
        showServicesState('error');
    }
}

/**
 * Show different states for services section
 */
function showServicesState(state) {
    // Hide all states
    servicesLoading.style.display = 'none';
    servicesError.style.display = 'none';
    servicesEmpty.style.display = 'none';
    servicesGrid.style.display = 'none';
    
    switch (state) {
        case 'loading':
            servicesLoading.style.display = 'block';
            break;
        case 'error':
            servicesError.style.display = 'block';
            break;
        case 'empty':
            servicesEmpty.style.display = 'block';
            break;
        case 'success':
            servicesGrid.style.display = 'grid';
            break;
    }
}

/**
 * Render service cards
 */
function renderServiceCards() {
    servicesGrid.innerHTML = '';
    
    availablePlans.forEach(plan => {
        const card = createServiceCard(plan);
        servicesGrid.appendChild(card);
    });
}

/**
 * Create a service card element
 */
function createServiceCard(plan) {
    const card = document.createElement('div');
    card.className = 'service-card';
    
    // Get category icon
    const icon = getCategoryIcon(plan.plan_category);
    
    // Format features
    const featuresHTML = plan.features
        .sort((a, b) => a.sort_order - b.sort_order)
        .map(feature => `
            <li>
                <span class="material-icons">${getFeatureIcon(feature.icon_name)}</span>
                ${feature.description}
            </li>
        `).join('');
    
    card.innerHTML = `
        <div class="service-header">
            <div class="service-icon">
                <span class="material-icons">${icon}</span>
            </div>
            <h3>${plan.name}</h3>
            <div class="service-price">
                <span class="currency">$</span>
                <span class="amount">${Number(plan.price).toLocaleString()}</span>
                <span class="period">/mes</span>
            </div>
        </div>
        <div class="service-features">
            <ul>
                ${featuresHTML}
            </ul>
        </div>
        <div class="service-actions">
            <button class="btn btn-primary" onclick="showContratacionModal('${plan.name}', '${plan.id}')">
                Contratar
            </button>
            <button class="btn btn-secondary" onclick="contactarAsesor('${plan.name}')">
                Contactar un asesor
            </button>
        </div>
    `;
    
    return card;
}

/**
 * Get icon for plan category
 */
function getCategoryIcon(category) {
    const iconMap = {
        'internet': 'wifi',
        'tv': 'tv',
        'combo': 'devices'
    };
    return iconMap[category] || 'star';
}

/**
 * Get icon for feature
 */
function getFeatureIcon(iconName) {
    const iconMap = {
        'speed': 'speed',
        'wifi': 'wifi',
        'tv': 'tv',
        'router': 'router',
        'support': 'support_agent',
        'hd': 'high_quality',
        'upload': 'upload',
        'device_hub': 'device_hub',
        'check_circle': 'check_circle'
    };
    return iconMap[iconName] || 'check_circle';
}

/**
 * Update WhatsApp contact link
 */
function updateWhatsAppLink() {
    const whatsappLink = document.getElementById('whatsapp-link');
    if (whatsappLink && selectedLocality) {
        const message = `Hola%20%F0%9F%91%8B%0A%0AVengo%20de%20la%20p%C3%A1gina%20de%20Red%20TV%2C%20quiero%20obtener%20informaci%C3%B3n%20sobre%20servicios%20en%20${encodeURIComponent(selectedLocality.name)}%20(zona%20${encodeURIComponent(selectedZoneType.name)})`;
        whatsappLink.href = `https://api.whatsapp.com/send?phone=543794069046&text=${message}`;
    }
}

/**
 * Modal functions
 */
function showConfigModal() {
    const modal = document.getElementById('configOptionsModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

function closeConfigModal() {
    const modal = document.getElementById('configOptionsModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function showContratacionModal(planName, planId) {
    const modal = document.getElementById('contratacionModal');
    const servicioInput = document.getElementById('servicio');
    
    if (modal && servicioInput) {
        servicioInput.value = planName;
        modal.style.display = 'block';
    }
    }

    function closeContratacionModal() {
    const modal = document.getElementById('contratacionModal');
    if (modal) {
        modal.style.display = 'none';
        // Reset form
        const form = document.getElementById('contratacionForm');
        if (form) form.reset();
    }
}

/**
 * Contact advisor for specific plan
 */
function contactarAsesor(planName) {
    const localidad = selectedLocality?.name || '';
    const zona = selectedZoneType?.name || '';
    
    const message = `Hola 👋 Tengo dudas sobre el plan ${planName} en ${localidad}, zona ${zona}.`;
    const encodedMessage = encodeURIComponent(message);
    
    window.open(`https://api.whatsapp.com/send?phone=543794069046&text=${encodedMessage}`, '_blank');
}

/**
 * Contact support function
 */
function contactSupport() {
    const message = `Hola%20%F0%9F%91%8B%0A%0AVengo%20de%20la%20p%C3%A1gina%20de%20Red%20TV%2C%20necesito%20ayuda%20y%20asesoramiento%20para%20elegir%20la%20mejor%20opci%C3%B3n%20de%20servicio.`;
    window.open(`https://api.whatsapp.com/send?phone=543794069046&text=${message}`, '_blank');
}

// Make functions available globally
window.loadAvailableServices = loadAvailableServices;
window.showConfigModal = showConfigModal;
window.closeConfigModal = closeConfigModal;
window.showContratacionModal = showContratacionModal;
window.closeContratacionModal = closeContratacionModal;
window.contactSupport = contactSupport;
window.contactarAsesor = contactarAsesor;

// Handle modal close buttons
document.addEventListener('DOMContentLoaded', function() {
    // Config modal close
    const configCloseBtn = document.querySelector('#configOptionsModal .close-button');
    const configEntendidoBtn = document.getElementById('modalEntendidoBtn');
    
    if (configCloseBtn) configCloseBtn.addEventListener('click', closeConfigModal);
    if (configEntendidoBtn) configEntendidoBtn.addEventListener('click', closeConfigModal);
    
    // Contratacion modal close
    const contratacionCloseBtn = document.querySelector('#contratacionModal .close-button');
    if (contratacionCloseBtn) contratacionCloseBtn.addEventListener('click', closeContratacionModal);
    
    // Form submission
    const contratacionForm = document.getElementById('contratacionForm');
    if (contratacionForm) {
        contratacionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Create WhatsApp message for contracting
            const message = `Hola 👋

Quiero conocer más información sobre contrataciones del plan ${data.servicio}.

Mi nombre es: ${data.nombreCompleto}
El servicio es deseado en: ${data.direccion}

Gracias!`;
            
            const encodedMessage = encodeURIComponent(message);
            
            // Open WhatsApp
            window.open(`https://api.whatsapp.com/send?phone=543794069046&text=${encodedMessage}`, '_blank');
            
            // Close modal
            closeContratacionModal();
        });
    }

    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        const configModal = document.getElementById('configOptionsModal');
        const contratacionModal = document.getElementById('contratacionModal');
        
        if (e.target === configModal) closeConfigModal();
        if (e.target === contratacionModal) closeContratacionModal();
    });
}); 