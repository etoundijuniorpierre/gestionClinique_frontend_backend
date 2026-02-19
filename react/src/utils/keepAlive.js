class KeepAliveService {
    constructor() {
        this.interval = null;
        this.apiUrl = process.env.REACT_APP_API_BASE || 'http://localhost:8080';
        this.healthEndpoint = `${this.apiUrl}/actuator/health`;
        this.servicesEndpoint = `${this.apiUrl}/api/services-medicaux`;
    }

    start() {
        this.interval = setInterval(() => {
            this.pingServer();
        }, 10 * 60 * 1000); // Réduit à 10 minutes pour Render

        this.pingServer();
        
        console.log('🔄 Keep-alive service started - Pinging every 10 minutes');
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
            console.log('⏹️ Keep-alive service stopped');
        }
    }

    async pingServer() {
        try {
            // Ping du health endpoint principal
            const healthResponse = await fetch(this.healthEndpoint, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                signal: AbortSignal.timeout(10000)
            });

            if (healthResponse.ok) {
                console.log('Health endpoint ping successful');
            } else {
                console.warn('⚠️ Health endpoint ping failed:', healthResponse.status);
            }

            // Ping supplémentaire pour maintenir l'activité
            const servicesResponse = await fetch(this.servicesEndpoint, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                signal: AbortSignal.timeout(5000)
            });

            if (servicesResponse.ok) {
                console.log('Services endpoint ping successful');
            }

        } catch (error) {
            console.error('❌ Server ping error:', error.message);
        }
    }
}

export const keepAliveService = new KeepAliveService();

if (typeof window !== 'undefined') {
    let isUserActive = true;
    
    const handleUserActivity = () => {
        isUserActive = true;
    };

    const checkUserInactivity = () => {
        if (!isUserActive) {
            keepAliveService.stop();
            console.log('🔒 User inactive - Keep-alive paused');
        } else {
            if (!keepAliveService.interval) {
                keepAliveService.start();
            }
            isUserActive = false;
        }
    };

    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keypress', handleUserActivity);
    window.addEventListener('scroll', handleUserActivity);
    window.addEventListener('click', handleUserActivity);

    setInterval(checkUserInactivity, 30 * 60 * 1000);

    keepAliveService.start();
}
