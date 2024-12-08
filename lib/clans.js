const fs = require('fs');
const path = require('path');

const CLAN_FILE = path.join(__dirname, 'clans.json');

const readClans = () => {
    if (!fs.existsSync(CLAN_FILE)) {
        return {};
    }
    const data = fs.readFileSync(CLAN_FILE, 'utf-8');
    return JSON.parse(data);
};

const writeClans = (clanData) => {
    fs.writeFileSync(CLAN_FILE, JSON.stringify(clanData, null, 2));
};

const playerOnClan = (sender, chat, clanData) => {
    const userClan = Object.values(clanData).find(c => 
        c.members && c.members.some(m => m.id === sender)
    );
    return !!userClan;
};

module.exports = { playerOnClan, readClans, writeClans };