/**
 * Global Footer Component for RED TV
 */

document.addEventListener('DOMContentLoaded', function() {
    const footerContainer = document.querySelector('footer.footer');
    
    if (footerContainer) {
        // Create the footer HTML
        const footerHTML = `
            <div class="container">
                <div class="footer-grid">
                    <div class="footer-column footer-column-logo">
                        <p>Red Televisión, tu proveedor de internet y televisión HD.</p>
                    </div>
                    <div class="footer-column">
                        <h4>Navegación</h4>
                        <ul>
                            <li><a href="index.html">Inicio</a></li>
                            <li><a href="planes.html">Planes</a></li>
                            <li><a href="contacto.html">Contacto</a></li>
                            <li><a href="sobre-nosotros.html">Sobre Nosotros</a></li>
                        </ul>
                    </div>
                    <div class="footer-column">
                        <h4>Contacto</h4>
                        <ul>
                            <li><span class="material-icons">location_on</span> <strong>Charata:</strong> Maipú 550</li>
                            <li><span class="material-icons">location_on</span> <strong>Gral. Pinedo:</strong> Moreno 363</li>
                            <li><span class="material-icons">phone</span> Teléfono: 03731-420159</li>
                            <li><span class="material-icons">smartphone</span> Móvil: 03731-480203</li>
                            <li><span class="material-icons">email</span> info@redtv.com.ar</li>
                        </ul>
                    </div>
                    <div class="footer-column">
                        <h4>¡Seguinos en nuestras redes!</h4>
                        <div class="social-links">
                            <a href="https://www.facebook.com/RedTelevisionSrl/?locale=es_LA" class="social-link" target="_blank">
                                <span class="material-icons">facebook</span>
                            </a>
                            <a href="https://www.instagram.com/redtelevisionsrl/" class="social-link" target="_blank">
                                <img src="assets/instagram-icon.svg" alt="Instagram" class="instagram-icon">
                            </a>
                            <a href="http://redtvsrl.com.ar" class="social-link" target="_blank">
                                <span class="material-icons">language</span>
                            </a>
                            <a href="https://www.youtube.com/@redtelevisionsrl5" class="social-link" target="_blank">
                                <span class="material-icons">smart_display</span>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="footer-bottom">
                    <div class="legal-links">
                        <a href="terminos.html">Términos y Condiciones</a>
                        <a href="privacidad.html">Política de Privacidad</a>
                    </div>
                    <div class="copyright">
                        &copy; <span id="current-year"></span> RED TV. Todos los derechos reservados.
                    </div>
                </div>
            </div>
        `;
        
        // Insert the footer content
        footerContainer.innerHTML = footerHTML;
        
        // Set current year in footer
        document.getElementById('current-year').textContent = new Date().getFullYear();
    }
}); 