/**
 * RED TV Contact Page JavaScript
 */

// Log immediately when script loads
console.log('CONTACTO JS: Script file loaded');

document.addEventListener('DOMContentLoaded', function() {
    console.log('CONTACTO JS: DOM loaded, starting initialization');
    
    // Get elements with detailed logging
    const contactForm = document.getElementById('contact-form');
    const toggleButton = document.getElementById('toggle-email-form');
    const contactFormSection = document.getElementById('contact-form-section');
    
    console.log('CONTACTO JS: Looking for elements...');
    console.log('Contact form:', contactForm);
    console.log('Toggle button:', toggleButton);
    console.log('Form section:', contactFormSection);
    
    // Simple button test
    if (toggleButton) {
        console.log('CONTACTO JS: Toggle button found! Setting up click handler...');
        
        // Add a simple click test first
        toggleButton.addEventListener('click', function(e) {
            console.log('CONTACTO JS: BUTTON CLICKED!');
        });
        
        // Then add the real functionality
        toggleButton.addEventListener('click', function(e) {
            console.log('CONTACTO JS: Toggle functionality triggered');
            
            if (!contactFormSection) {
                console.error('CONTACTO JS: Form section not found!');
                return;
            }
            
            const isHidden = contactFormSection.style.display === 'none' || contactFormSection.style.display === '';
            console.log('CONTACTO JS: Form is hidden:', isHidden);
            
            if (isHidden) {
                // Show the form section
                contactFormSection.style.display = 'block';
                toggleButton.innerHTML = '<span class="material-icons">close</span>Cerrar formulario';
                console.log('CONTACTO JS: Form section shown');
                
                // Scroll to form
                setTimeout(() => {
                    contactFormSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            } else {
                // Hide the form section
                contactFormSection.style.display = 'none';
                toggleButton.innerHTML = '<span class="material-icons">email</span>Enviar un mail';
                console.log('CONTACTO JS: Form section hidden');
                
                // Reset form
                if (contactForm) {
                    contactForm.reset();
                }
            }
        });
        
    } else {
        console.error('CONTACTO JS: Toggle button NOT FOUND!');
        // Let's check what buttons exist
        const allButtons = document.querySelectorAll('button');
        console.log('CONTACTO JS: All buttons on page:', allButtons);
        allButtons.forEach((btn, index) => {
            console.log(`Button ${index}:`, btn.id, btn.className, btn.innerHTML);
        });
    }
    
    // Form submission handler
    if (contactForm) {
        console.log('CONTACTO JS: Setting up form submission handler');
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('CONTACTO JS: Form submitted');
            
            // Get form values
            const nombre = document.getElementById('nombre').value;
            const email = document.getElementById('email').value;
            const asunto = document.getElementById('asunto').value;
            const mensaje = document.getElementById('mensaje').value;
            
            // Simple validation
            if (!nombre || !email || !asunto || !mensaje) {
                alert('Por favor, complete todos los campos obligatorios.');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Por favor, ingrese un email válido.');
                return;
            }
            
            // Reset and hide form
            contactForm.reset();
            if (contactFormSection) {
                contactFormSection.style.display = 'none';
            }
            if (toggleButton) {
                toggleButton.innerHTML = '<span class="material-icons">email</span>Enviar un mail';
            }
        });
    } else {
        console.error('CONTACTO JS: Contact form not found!');
    }
    
    console.log('CONTACTO JS: Initialization complete');
}); 