const cp = require('child_process');
const { promisify } = require('util');
const exec = promisify(cp.exec).bind(cp);

let handler = async (m, { conn, isROwner, usedPrefix, command, text }) => {
    switch (command) {
        case 'cp':
            if (!isROwner) return;
            if (!text) throw `Masukkan nama plugin yang ingin dicari`;

            let pluginsList = Object.keys(plugins).map(v => v.replace('.js', ''));
            let matchedPlugins = pluginsList.filter(v => v.includes(text));

            if (matchedPlugins.length === 0) {
                return m.reply(`*Tidak Ditemukan*\n\nPlugin yang cocok tidak ditemukan dengan nama "${text}".`);
            }

            let results = matchedPlugins.map(v => `- ${v}`).join('\n');
            m.reply(`*Plugin yang cocok dengan "${text}":*\n${results}`);
            break;

        case 'cekplugins':
            if (!isROwner) return;
            let allPlugins = Object.keys(plugins).map(v => v.replace('.js', ''));
            if (allPlugins.length === 0) {
                return m.reply(`*Tidak Ditemukan*\n\nTidak ada plugin yang tersedia.`);
            }
            m.reply(`*Daftar semua plugin:*\n${allPlugins.map(v => ' ' + v).join`\n`}`);
            break;

        case 'cekplugin':
            if (!isROwner) return;
            let allPluginsCek = Object.keys(plugins).map(v => v.replace('.js', ''));
            if (allPluginsCek.length === 0) {
                return m.reply(`*Tidak Ditemukan*\n\nTidak ada plugin yang tersedia.`);
            }
            m.reply(`*Daftar semua plugin:*\n${allPluginsCek.map(v => ' ' + v).join`\n`}`);
            break;

        case 'getplugin':
        case 'gp':
            if (!isROwner) return;
            if (!text) throw `Masukkan nama plugin`;
            let ar1 = Object.keys(plugins).map(v => v.replace('.js', ''));
            if (!ar1.includes(text)) return m.reply(`*Tidak Ditemukan*\n\n${ar1.map(v => ' ' + v).join`\n`}`);
            let o;
            try {
                o = await exec('cat plugins/' + text + '.js');
            } catch (e) {
                o = e;
            } finally {
                let { stdout, stderr } = o;
                if (stdout.trim()) m.reply(stdout);
                if (stderr.trim()) m.reply(stderr);
            }
            break;

        case 'gf':
            if (!isROwner) return;
            if (!text) throw `Masukkan nama file`;

            let O;
            try {
                O = await exec('cat ' + text);
            } catch (e) {
                O = e;
            } finally {
                let { stdout, stderr } = O;
                if (stdout.trim()) m.reply(stdout);
                if (stderr.trim()) m.reply(stderr);
            }
            break;
    }
};

handler.help = ['getplugin', 'gp', 'getplugins', 'cp', 'cekplugin', 'cekplugins'];
handler.command = /^(getplugin|gp|getplugins|cp|cekplugin|cekplugins)$/i;
handler.tags = ['owner'];
handler.rowner = true;

module.exports = handler;