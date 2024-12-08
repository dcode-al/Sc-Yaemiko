async function before(m) {
    this.listAfk = this.listAfk || {};
    let user = global.db.data.users[m.sender];

    // Deteksi saat mengetik
    const commands = Object.values(global.plugins).flatMap((plugin) => [].concat(plugin.command));
    const presenceStatus = commands.some((cmd) => (cmd instanceof RegExp ? cmd.test(m.text) : m.text.includes(cmd))) ? 'composing' : null;

    if (presenceStatus) {
        await this.sendPresenceUpdate(presenceStatus, m.chat);
    }

    // Deteksi jika pengguna mengetik pesan setelah AFK
    if (user.afk > -1 && m.text) { // Menambahkan pengecekan m.text
        const idToRemove = m.sender;
        this.listAfk[m.chat] = this.listAfk[m.chat] ?
            this.listAfk[m.chat].filter(user => user.id !== idToRemove) : [];

        let caption = `
${this.getName(m.sender)} @${m.sender.split("@")[0]} berhenti AFK${user.afkReason ? ' setelah ' + user.afkReason : ''}
Selama ${clockString(new Date - user.afk)}
`.trim();

        this.reply(m.chat, caption, m, {
            mentions: await this.parseMention(caption)
        });

        // Reset status AFK pengguna
        user.afk = -1;
        user.afkReason = '';
    }

    // Deteksi mention dan quoted message untuk pemberitahuan AFK
    let jids = [...new Set([...(m.mentionedJid || []), ...(m.quoted ? [m.quoted.sender] : [])])];
    for (let jid of jids) {
        let user = global.db.data.users[jid];
        if (!user) continue;

        let afkTime = user.afk;
        if (!afkTime || afkTime < 0) continue;

        let reason = user.afkReason || '';
        let caption = `
*Jangan tag: @${jid.split("@")[0]}!*\n
Dia sedang AFK${reason ? ' 🗒️Alasan: ' + reason : ' tanpa alasan'}
Nama: ${this.getName(jid)}
⏰Selama: ${clockString(new Date - user.afk)}
`.trim();

        this.reply(m.chat, caption, m, {
            mentions: await this.parseMention(caption)
        });
    }

    return true;
}

function clockString(ms) {
    let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000);
    let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60;
    let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60;
    return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':');
}

module.exports = {
    before,
};