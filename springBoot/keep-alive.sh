#!/bin/bash

# Script keep-alive pour Render
# À exécuter toutes les 10-14 minutes pour éviter l'endormissement

BACKEND_URL="https://votre-backend-url.onrender.com"
HEALTH_ENDPOINT="/actuator/health"

echo "[$(date)] Keep-alive ping to backend..."

# Ping du backend
response=$(curl -s -o /dev/null -w "%{http_code}" "${BACKEND_URL}${HEALTH_ENDPOINT}")

if [ "$response" = "200" ]; then
    echo "[$(date)] ✅ Backend is alive (HTTP $response)"
else
    echo "[$(date)] ❌ Backend ping failed (HTTP $response)"
fi

# Ping supplémentaire pour maintenir l'activité
curl -s "${BACKEND_URL}/api/services-medicaux" > /dev/null 2>&1

echo "[$(date)] Keep-alive completed"
