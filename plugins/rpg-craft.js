let handler = async (m, { conn, command, args, usedPrefix }) => {
    let type = (args[0] || '').toLowerCase();
    let user = global.db.data.users[m.sender];

    // Pastikan semua properti diinisialisasi
    user.pickaxe = user.pickaxe || 0;
    user.sword = user.sword || 0;
    user.fishingrod = user.fishingrod || 0;
    user.armor = user.armor || 0;
    user.atm = user.atm || 0;
    user.robo = user.robo || 0;

    let caption = `
⛊ Pickaxe ⛏️
⛊ Sword ⚔️
⛊ Fishingrod 🎣
⛊ Armor 🛡️
⛊ ATM 💳
⛊ Robo 🤖

*「 RECIPE 」*

⬡ Pickaxe ⛏️
│• 10 Kayu
│• 5 Batu
│• 5 Iron
│• 20 String
╰────┈⭑
⬡ Sword ⚔️
│• 10 Kayu
│• 15 Iron
╰────┈⭑
⬡ Fishingrod 🎣
│• 10 Kayu
│• 2 Iron
│• 20 String
╰────┈⭑
⬡ Armor 🥼
│• 30 Iron
│• 1 Emerald
│• 5 Diamond
╰────┈⭑
⬡ Atm 💳
│• 3 Emerald
│• 6 Diamond
│• 10k Money
╰────┈⭑
⬡ Robo 🤖
│• 6 Emerald
│• 12 Diamond
│• 100k Money
╰────┈⭑
`;

    try {
        if (/craft|Crafting/i.test(command)) {
            const count = args[1] && args[1].length > 0 ? Math.min(99999999, Math.max(parseInt(args[1]), 1)) : 1;
            switch (type) {
                case 'pickaxe':
                    if (user.pickaxe > 0) return m.reply('Kamu sudah memiliki ini.');

                    // Cek bahan
                    if (user.kayu < 10 * count || user.batu < 5 * count || user.iron < 5 * count || user.string < 20 * count) {
                        return m.reply(`Barang tidak cukup!\nUntuk membuat ${count} pickaxe, kamu memerlukan :\n${10 * count} kayu🪵\n${5 * count} batu🪨\n${5 * count} iron⛓\n${20 * count} string🕸️`);
                    }
                    user.kayu -= 10 * count;
                    user.iron -= 5 * count;
                    user.batu -= 5 * count;
                    user.string -= 20 * count;
                    user.pickaxe += count;
                    user.pickaxedurability = 40; // Durability default
                    m.reply(`Sukses membuat ${count} pickaxe 🔨`);
                    break;

                case 'sword':
                    if (user.sword > 0) return m.reply('Kamu sudah memiliki ini.');
                    if (user.kayu < 10 * count || user.iron < 15 * count) {
                        return m.reply(`Barang tidak cukup!\nUntuk membuat ${count} sword, kamu memerlukan :\n${10 * count} kayu🪵\n${15 * count} iron⛓️`);
                    }
                    user.kayu -= 10 * count;
                    user.iron -= 15 * count;
                    user.sword += count;
                    user.sworddurability = 40; // Durability default
                    m.reply(`Sukses membuat ${count} sword 🗡️`);
                    break;

                case 'fishingrod':
                    if (user.fishingrod > 0) return m.reply('Kamu sudah memiliki ini.');
                    if (user.kayu < 10 * count || user.iron < 2 * count || user.string < 20 * count) {
                        return m.reply(`Barang tidak cukup!\nUntuk membuat ${count} fishingrod, kamu memerlukan :\n${10 * count} kayu🪵\n${2 * count} iron⛓️\n${20 * count} string🕸️`);
                    }
                    user.kayu -= 10 * count;
                    user.iron -= 2 * count;
                    user.string -= 20 * count;
                    user.fishingrod += count;
                    user.fishingroddurability = 40; // Durability default
                    m.reply(`Sukses membuat ${count} fishingrod 🎣`);
                    break;

                case 'armor':
                    if (user.armor > 0) return m.reply('Kamu sudah memiliki ini.');
                    if (user.iron < 30 * count || user.emerald < 1 * count || user.diamond < 5 * count) {
                        return m.reply(`Barang tidak cukup!\nUntuk membuat ${count} armor, kamu memerlukan :\n${30 * count} iron ⛓️\n${1 * count} emerald ❇️\n${5 * count} diamond 💎`);
                    }
                    user.iron -= 30 * count;
                    user.emerald -= 1 * count;
                    user.diamond -= 5 * count;
                    user.armor += count;
                    user.armordurability = 50; // Durability default
                    m.reply(`Sukses membuat ${count} armor 🛡️`);
                    break;

                case 'atm':
                    if (user.atm > 0) return m.reply('Kamu sudah memiliki ini.');
                    if (user.emerald < 3 * count || user.money < 10000 * count || user.diamond < 6 * count) {
                        return m.reply(`Barang tidak cukup!\nUntuk membuat ${count} ATM, kamu memerlukan :\n${10 * count}k Money 💹\n${3 * count} emerald ❇️\n${6 * count} diamond 💎`);
                    }
                    user.emerald -= 3 * count;
                    user.money -= 10000 * count;
                    user.diamond -= 6 * count;
                    user.atm += count;
                    user.fullatm = 5000000; // Limit ATM default
                    m.reply(`Sukses membuat ${count} ATM 💳`);
                    break;

                case 'robo':
                    if (user.robo > 0) return m.reply('Kamu sudah memiliki ini.');
                    if (user.emerald < 6 * count || user.money < 100000 * count || user.diamond < 12 * count) {
                        return m.reply(`Barang tidak cukup!\nUntuk membuat ${count} Robo, kamu memerlukan :\n${100 * count}k Money 💹\n${6 * count} emerald ❇️\n${12 * count} diamond 💎`);
                    }
                    user.emerald -= 6 * count;
                    user.money -= 100000 * count;
                    user.diamond -= 12 * count;
                    user.robo += count;
                    user.roboxp = 5; // XP default
                    m.reply(`Sukses membuat ${count} Robo 🤖`);
                    break;

                default:
                    return await conn.reply(m.chat, caption, m);
            }
        } else if (/enchant|enchan/i.test(command)) {
            const count = args[2] && args[2].length > 0 ? Math.min(99999999, Math.max(parseInt(args[2]), 1)) : 1;
            // Logika enchant bisa ditambahkan di sini
            switch (type) {
                case 't':
                    break;
                case '':
                    break;

                default:
                    return conn.reply(m.chat, caption, m);
            }
        }
    } catch (err) {
        m.reply("Error\n\n\n" + err.stack);
    }
}

handler.help = ['craft'];
handler.tags = ['rpg'];
handler.command = /^(craft|crafting|chant)/i;
handler.rpg = true;

module.exports = handler;