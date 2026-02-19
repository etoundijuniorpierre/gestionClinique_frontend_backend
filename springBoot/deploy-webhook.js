#!/usr/bin/env node

const https = require('https');

// Configuration du webhook Render
const RENDER_WEBHOOK_URL = process.env.RENDER_WEBHOOK_URL;
const RENDER_SERVICE_ID = process.env.RENDER_SERVICE_ID;
const RENDER_API_KEY = process.env.RENDER_API_KEY;

// Fonction pour déclencher le déploiement
async function triggerDeployment() {
    console.log('🚀 Triggering Render deployment...');
    
    try {
        // Méthode 1: Webhook simple
        if (RENDER_WEBHOOK_URL) {
            const response = await fetch(RENDER_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    event: 'push',
                    branch: 'main'
                })
            });
            
            if (response.ok) {
                console.log('Deployment triggered via webhook');
                return true;
            }
        }
        
        // Méthode 2: API Render
        if (RENDER_API_KEY && RENDER_SERVICE_ID) {
            const apiResponse = await fetch(`https://api.render.com/v1/services/${RENDER_SERVICE_ID}/deploys`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${RENDER_API_KEY}`,
                    'Content-Type': 'application/json',
                }
            });
            
            if (apiResponse.ok) {
                console.log('Deployment triggered via API');
                return true;
            }
        }
        
        console.log('❌ Failed to trigger deployment');
        return false;
        
    } catch (error) {
        console.error('❌ Deployment trigger error:', error.message);
        return false;
    }
}

// Si exécuté directement
if (require.main === module) {
    triggerDeployment();
}

module.exports = { triggerDeployment };
