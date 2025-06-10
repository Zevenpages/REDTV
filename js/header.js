/**
 * Global Header Component for RED TV
 */

document.addEventListener('DOMContentLoaded', function() {
    const headerContainer = document.querySelector('header.header');
    
    if (headerContainer) {
        // Get current page path
        const currentPath = window.location.pathname;
        const pageName = currentPath.split('/').pop();
        
        // Create the header HTML
        const headerHTML = `
            <div class="container header-container">
                <div class="logo">
                    <a href="index.html">
                        <img src="assets/logo.svg" alt="RED TV Logo" style="height: 80px;">
                    </a>
                </div>
                <nav class="main-nav">
                    <ul>
                        <li><a href="index.html" ${pageName === 'index.html' || pageName === '' ? 'class="active"' : ''}>Inicio</a></li>
                        <li><a href="planes.html" ${pageName === 'planes.html' ? 'class="active"' : ''}>Planes</a></li>
                        <li><a href="contacto.html" ${pageName === 'contacto.html' ? 'class="active"' : ''}>Contacto</a></li>
                        <li><a href="sobre-nosotros.html" ${pageName === 'sobre-nosotros.html' ? 'class="active"' : ''}>Sobre Nosotros</a></li>
                    </ul>
                </nav>
                <div class="customer-access">
                    <a href="mis-servicios.html" class="btn btn-secondary">Mis Servicios</a>
                </div>
                <button class="mobile-menu-toggle">
                    <span class="material-icons">menu</span>
                </button>
            </div>
        `;
        
        // Insert the header content
        headerContainer.innerHTML = headerHTML;
        
        // Initialize mobile menu toggle
        const menuToggle = headerContainer.querySelector('.mobile-menu-toggle');
        const mainNav = headerContainer.querySelector('.main-nav');
        
        if (menuToggle && mainNav) {
            menuToggle.addEventListener('click', function() {
                mainNav.classList.toggle('active');
                const menuIcon = menuToggle.querySelector('.material-icons');
                
                if (mainNav.classList.contains('active')) {
                    menuIcon.textContent = 'close';
                } else {
                    menuIcon.textContent = 'menu';
                }
            });
        }
    }
}); 