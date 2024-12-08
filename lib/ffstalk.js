const fetch = require('node-fetch');

async function ffStalk(playerId) {
    try {
        const response = await fetch(`https://www.public.freefireinfo.site/api/info/sg/${playerId}?key=Kemii`);
        const data = await response.json();

        if (data) {
            if (data["Equipped Items"] && data["Equipped Items"]["profile"] && data["Equipped Items"]["profile"]["Equipped Skills"]) {
                delete data["Equipped Items"]["profile"]["Equipped Skills"];
            }

            return {
                creator: 'Indra Ganteng',
                status: true,
                stalkerFreeFire: data
            };
        } else {
            throw new Error('Player not found or invalid data');
        }
    } catch (error) {
        return { error: true, message: error.message };
    }
}

module.exports = { ffStalk };