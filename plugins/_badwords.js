let badwordRegex = /anj(k|g)|ajn?(g|k)|a?njin(g|k)|bajingan|b(a?n)?gsa?t|ko?nto?l|me?me?(k|q)|pe?pe?(k|q)|meki|titi(t|d)|pe?ler|tetek|toket|ngewe|go?blo?k|to?lo?l|idiot|(k|ng)e?nto?(t|d)|jembut|bego|dajj?al|janc(u|o)k|pantek|puki ?(mak)?|kimak|kampang|lonte|col(i|mek?)|pelacur|henceu?t|nigga|fuck|dick|bitch|tits|bastard|asshole/i;

async function before(m, { isBotAdmin }) {
    if (m.isBaileys && m.fromMe) return;
    let chat = global.db.data.chats[m.chat];
    let user = global.db.data.users[m.sender];
    let isBadword = badwordRegex.exec(m.text);
    if (chat.antiBadword && isBadword && m.isGroup) {
        user.warning += 1;
        m.reply(`${user.warning >= 5 ? '⚠️*PERINGATAN Kamu Sudah Mencapai 5 Maka Kamu Akan Dikick!*' : '*⚠️ Kata Kata Toxic Terdeteksi*'}

⚠️ Warning: ${user.warning} / 5

[❗] Jika warning mencapai 5 Kamu akan dikeluarkan dari group

“Barang siapa yang beriman kepada Allah dan Hari Akhir maka hendaklah dia berkata baik atau diam” (HR. al-Bukhari dan Muslim).`);
        if (user.warning >= 5) {
            user.warning = 0;
            this.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
        }
    }
    return true;
}

module.exports = {
    before
};