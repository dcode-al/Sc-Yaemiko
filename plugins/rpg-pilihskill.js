let handler = async (m, { conn, usedPrefix, text, command }) => {
    const user = global.db.data.users[m.sender];

    const skills = [
        "swordmaster", "necromancer", "witch", "archer", "magicswordmaster", "thief", "shadow"
    ];

    const starRatings = {
        "satu": "⭐",
        "dua": "⭐⭐",
        "tiga": "⭐⭐⭐",
        "empat": "⭐⭐⭐⭐",
        "lima": "⭐⭐⭐⭐⭐",
        "enam": "⭐⭐⭐⭐⭐⭐"
    };

    let skil = text.trim().toLowerCase();

    // If skill is not in the list, show the available skills and instructions
    if (!skills.includes(skil)) {
        const caption = `Pilih skill yang sesuai dengan keinginan Anda:\n\n` +
            `${skills.map((skill, index) => `${index + 1}. ${skill} ${starRatings[Object.keys(starRatings)[Math.floor(Math.random() * Object.keys(starRatings).length)]]}`).join('\n')}` +
            `\n\nCara menggunakan: ${usedPrefix + command} <nama_skill>\n\n` +
            `Contoh: ${usedPrefix + command} shadow`;

        return conn.sendFile(m.chat, 'https://telegra.ph/file/78883151d4bad328be4ce.jpg', 'image.jpg', caption, m);
    }

    // If the user has already selected a skill, notify them
    if (user.skill) {
        return m.reply(`Anda sudah memilih skill ${user.skill} dan tidak bisa diganti.`);
    }

    // Assign the skill if the user has not selected one yet
    user.skill = skil;
    m.reply(`Anda telah memilih skill ${skil}.`);
};

handler.help = ['selectskill <type>'];
handler.tags = ['rpg'];
handler.group = true;
handler.rpg = true;
handler.command = /^(selectskill|pilihskill)$/i;

module.exports = handler;