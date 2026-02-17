class KeepAliveService {
    constructor() {
        this.interval = null;
        this.apiUrl = process.env.REACT_APP_API_BASE || 'http://localhost:8080';
        this.healthEndpoint = `${this.apiUrl}/api/health`;
    }

    start() {
        this.interval = setInterval(() => {
            this.pingServer();
        }, 14 * 60 * 1000);

        this.pingServer();
        
        console.log('🔄 Keep-alive service started - Pinging every 14 minutes');
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
            const response = await fetch(this.healthEndpoint, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                signal: AbortSignal.timeout(10000)
            });

            if (response.ok) {
                console.log('✅ Server ping successful');
            } else {
                console.warn('⚠️ Server ping failed:', response.status);
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
