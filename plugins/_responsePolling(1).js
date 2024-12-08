const { proto, generateWAMessage, areJidsSameUser } = require('@whiskeysockets/baileys');

async function before(m, chatUpdate) {
    if (m.isBaileys) return;
    if (!m.message) return;

    // Menangani respon polling
    if (m.message.pollUpdateMessage) {
        let pollUpdate = m.message.pollUpdateMessage;
        let selectedOptions = pollUpdate?.vote?.selectedOptionVotes || [];
        if (!selectedOptions.length) return;

        let selectedOption = selectedOptions[0]?.optionName || "Unknown Option";
        let isIdMessage = false, usedPrefix;
        
        for (let name in global.plugins) {
            let plugin = global.plugins[name];
            if (!plugin) continue;
            if (plugin.disabled) continue;
            if (!opts['restrict']) {
                if (plugin.tags && plugin.tags.includes('admin')) continue;
            }
            if (typeof plugin !== 'function') continue;
            if (!plugin.command) continue;

            const str2Regex = str => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
            let _prefix = plugin.customPrefix ? plugin.customPrefix : this.prefix ? this.prefix : global.prefix;

            let match = (_prefix instanceof RegExp ? 
                [[_prefix.exec(selectedOption), _prefix]] : Array.isArray(_prefix) ? 
                    _prefix.map(p => {
                        let re = p instanceof RegExp ? 
                            p : new RegExp(str2Regex(p));
                        return [re.exec(selectedOption), re];
                    }) : typeof _prefix === 'string' ? 
                [[new RegExp(str2Regex(_prefix)).exec(selectedOption), new RegExp(str2Regex(_prefix))]] : [[[], new RegExp]]
            ).find(p => p[1]);

            if ((usedPrefix = (match[0] || '')[0])) {
                let noPrefix = selectedOption.replace(usedPrefix, '');
                let [command] = noPrefix.trim().split` `.filter(v => v);
                command = (command || '').toLowerCase();
                let isId = plugin.command instanceof RegExp ? 
                    plugin.command.test(command) : Array.isArray(plugin.command) ? 
                        plugin.command.some(cmd => cmd instanceof RegExp ? 
                    cmd.test(command) : cmd === command) : typeof plugin.command === 'string' ? 
                plugin.command === command : false;

                if (!isId) continue;
                isIdMessage = true;
                // Jalankan plugin terkait
                await plugin.call(this, m, { conn, text: selectedOption, args: [selectedOption], usedPrefix, command });
                break;  // Berhenti setelah menemukan dan menjalankan plugin yang sesuai
            }
        }
    }
}

module.exports = {
    before,
};