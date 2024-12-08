const { fileTypeFromBuffer } = require ('file-type');

const handler = async (m, {
    args
}) => {t
    if (!args[0]) return m.reply("Penggunaan:\n!notoemoji < emoji >\n\nContoh:\n!notoemoji 😅")
    try {
        m.reply("Wait...")
        const unicode = await emojiUnicode(args[0])
        const url = "https://fonts.gstatic.com/s/e/notoemoji/latest/" + unicode + "/512.webp"
        const buffer = await (await fetch(url)).buffer()
        const mimeType = await getMimeTypeFromBuffer(buffer)
        if (!/image/.test(mimeType)) return m.reply("Emoji tidak di dukung")
        conn.sendFile(m.chat, url, "", "", m)
    } catch (e) {
        m.reply("Error!")
    }
}
handler.command = ["notoemoji"]
handler.help = ["notoemoji"]
handler.tags = ["tools"]

module.exports = handler

async function getMimeTypeFromBuffer(buffer) {
    const type = await fileTypeFromBuffer(buffer);
    if (type) {
        return type.mime;
    } else {
        console.error('Tipe file tidak ditemukan.');
        return null;
    }
}

/**
 * emojiUnicode
 * Get the unicode code of an emoji in base 16.
 *
 * @name emojiUnicode
 * @function
 * @param {String} input The emoji character.
 * @returns {String} The base 16 unicode code.
 */

function emojiUnicode(input) {
    return emojiUnicode.raw(input).split(' ').map(function (val) {
        return parseInt(val).toString(16);
    }).join(' ');
}

/**
 * emojiunicode.raw
 * Get the unicode code points of an emoji in base 16.
 *
 * @name emojiunicode.raw
 * @function
 * @param {String} input The emoji character.
 * @returns {String} The unicode code points.
 */
emojiUnicode.raw = function (input) {
    if (input.length === 1) {
        return input.charCodeAt(0).toString();
    } else if (input.length > 1) {
        var pairs = [];
        for (var i = 0; i < input.length; i++) {
            if (
            // high surrogate
            input.charCodeAt(i) >= 0xd800 && input.charCodeAt(i) <= 0xdbff) {
                if (input.charCodeAt(i + 1) >= 0xdc00 && input.charCodeAt(i + 1) <= 0xdfff) {1
                    // low surrogate
                    pairs.push((input.charCodeAt(i) - 0xd800) * 0x400 + (input.charCodeAt(i + 1) - 0xdc00) + 0x10000);
                }
            } else if (input.charCodeAt(i) < 0xd800 || input.charCodeAt(i) > 0xdfff) {
                // modifiers and joiners
                pairs.push(input.charCodeAt(i));
            }
        }
        return pairs.join(' ');
    }

    return '';
};