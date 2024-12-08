const axios = require('axios');

class Fuck extends Error {
    constructor(msg) {
        super(msg);
        this.name = "Fuck";
    }
}

class API {
    constructor(api) {
        this.endpoints = { cek: api };
    }

    headers(custom = {}) {
        return {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'User-Agent': 'Postify/1.0.0',
            'Referer': 'https://id.xcash.gg/',
            ...custom
        };
    }

    handleError(e, context) {
        const errors = e.response ? JSON.stringify(e.response.data || e.message) : e.message;
        console.error(`${context}:`, errors);
        throw new Fuck(errors);
    }
}

class StalkML extends API {
    constructor() {
        super('https://id.xcash.gg/cek');
    }

    async request(body) {
        try {
            // Proxy settings if needed
            const proxy = 'http://your-proxy-server:port'; // Replace with your proxy server
            const { data } = await axios.post(this.endpoints.cek, body, {
                headers: this.headers(),
                proxy: {
                    host: 'your-proxy-server',
                    port: port_number
                }
            });
            return data;
        } catch (e) {
            this.handleError(e, 'request');
        }
    }

    async cek(userId, zoneId) {
        const body = {
            userId,
            zoneId
        };
        return this.request(body);
    }
}

module.exports = StalkML;