// App Downloads Handler
// This file handles downloading app files from Supabase storage

import { getSupabase } from './supabase-cdn.js';

// App file configurations
const APP_FILES = {
    'basic-tv': {
        filename: 'RedTv Basic - Smart TV.apk',
        bucket: 'descargas',
        description: 'REDTV Basic para TV'
    },
    'basic-celular': {
        filename: 'Red Tv Basic - Celular.apk',
        bucket: 'descargas',
        description: 'REDTV Basic para Celular'
    },
    'premium-tv': {
        filename: 'RedTv Premium - Smart TV.apk', // Update if you have a separate Premium TV file
        bucket: 'descargas',
        description: 'REDTV Premium para TV'
    },
    'premium-celular': {
        filename: 'Red Tv Premium - Celular.apk',
        bucket: 'descargas',
        description: 'REDTV Premium para Celular'
    }
};

/**
 * Initialize app download functionality
 */
export function initAppDownloads() {
    console.log('Initializing app downloads...');
    
    // Add click event listeners to all download buttons
    const downloadButtons = document.querySelectorAll('.app-buttons .btn');
    
    downloadButtons.forEach(button => {
        button.addEventListener('click', handleDownloadClick);
    });
    
    console.log('App downloads initialized');
}

/**
 * Handle download button clicks
 */
async function handleDownloadClick(event) {
    event.preventDefault();
    
    const button = event.currentTarget;
    const buttonText = button.textContent.trim();
    
    // Determine which app to download based on button text
    let appType = null;
    
    if (buttonText.includes('Basic TV')) {
        appType = 'basic-tv';
    } else if (buttonText.includes('Basic Celular')) {
        appType = 'basic-celular';
    } else if (buttonText.includes('Premium TV')) {
        appType = 'premium-tv';
    } else if (buttonText.includes('Premium Celular')) {
        appType = 'premium-celular';
    }
    
    if (!appType) {
        console.error('Unknown app type for button:', buttonText);
        showDownloadError('Tipo de aplicación no reconocido');
        return;
    }
    
    // Show loading state
    const originalText = button.textContent;
    button.textContent = 'Descargando...';
    button.disabled = true;
    
    try {
        await downloadApp(appType);
        showDownloadSuccess(APP_FILES[appType].description);
    } catch (error) {
        console.error('Download error:', error);
        showDownloadError('Error al descargar la aplicación');
    } finally {
        // Restore button state
        button.textContent = originalText;
        button.disabled = false;
    }
}

/**
 * Download app file from Supabase storage
 */
async function downloadApp(appType) {
    const appConfig = APP_FILES[appType];
    if (!appConfig) {
        throw new Error(`App configuration not found for: ${appType}`);
    }

    // Use direct public URL for public files
    const publicUrl = `https://leepimkwdqpgkqhxrmqm.supabase.co/storage/v1/object/public/descargas/${encodeURIComponent(appConfig.filename)}`;

    // Create a temporary link and trigger download
    const link = document.createElement('a');
    link.href = publicUrl;
    link.download = appConfig.filename;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log(`Download initiated for ${appConfig.description}`);
}

/**
 * Show download success message
 */
function showDownloadSuccess(appName) {
    showNotification(`¡Descarga iniciada! ${appName} se está descargando.`, 'success');
}

/**
 * Show download error message
 */
function showDownloadError(message) {
    showNotification(message, 'error');
}

/**
 * Show notification to user
 */
function showNotification(message, type = 'info') {
    // Remove any existing notifications
    const existingNotification = document.querySelector('.download-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `download-notification download-notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        animation: slideIn 0.3s ease-out;
    `;
    
    // Set background color based on type
    switch (type) {
        case 'success':
            notification.style.backgroundColor = '#4CAF50';
            break;
        case 'error':
            notification.style.backgroundColor = '#f44336';
            break;
        default:
            notification.style.backgroundColor = '#2196F3';
    }
    
    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

/**
 * Check if app files exist in storage (for debugging)
 */
export async function checkAppFiles() {
    const supabase = getSupabase();
    
    console.log('Checking app files in storage...');
    
    for (const [appType, config] of Object.entries(APP_FILES)) {
        try {
            const { data, error } = await supabase.storage
                .from(config.bucket)
                .list('', {
                    search: config.filename
                });
            
            if (error) {
                console.error(`Error checking ${appType}:`, error);
            } else {
                const exists = data.some(file => file.name === config.filename);
                console.log(`${appType}: ${exists ? '✅ Found' : '❌ Not found'}`);
            }
        } catch (error) {
            console.error(`Error checking ${appType}:`, error);
        }
    }
} 