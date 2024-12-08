/*
 * @Wm By Indra
 * https://whatsapp.com/channel/0029VaYVlVP9hXF9Ig83hJ3L
 * Don't Delete My Wm
 */

const PDFDocument = require('pdfkit');
const { Writable } = require('stream');

let handler = async (m, { conn, args, usedPrefix, command }) => {
    // Usage example
    let query = `*Contoh*: .${command} Namaku Indra`;
    let text;
    
    if (args.length >= 1) {
        text = args.slice(0).join(" ");
    } else if (m.quoted && m.quoted.text) {
        text = m.quoted.text;
    } else {
        throw query;
    }

    await m.reply('Please wait...');
    
    try {
        let pdf = await textToPDFBuffer(text);
        await conn.sendMessage(m.chat, {
            document: pdf,
            mimetype: "application/pdf",
            fileName: `For ${m.name}.pdf`
        }, {
            quoted: m
        });
    } catch (e) {
        await m.reply('An error occurred.');
    }
};

handler.help = ['texttopdf'];
handler.tags = ['tools'];
handler.command = /^(texttopdf)$/i;

module.exports = handler;

async function textToPDFBuffer(text) {
    return new Promise((resolve, reject) => {
        const buffers = [];
        const streamBuffer = new Writable({
            write(chunk, encoding, next) {
                buffers.push(chunk);
                next();
            },
        });

        const doc = new PDFDocument();

        doc.pipe(streamBuffer);
        doc.text(text);
        doc.end();

        streamBuffer.on('finish', () => {
            const pdfBuffer = Buffer.concat(buffers);
            resolve(pdfBuffer);
        });

        streamBuffer.on('error', reject);
    });
}