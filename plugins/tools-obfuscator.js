const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require('fs');
const path = require('path');

let handler = async (m, { conn, text }) => {
    let teks = text || (m.quoted ? m.quoted.text : ''); 
    if (!teks) return conn.reply(m.chat, `• *Contoh:* .encrypt teksnya`, m);
    
    let res = JavaScriptObfuscator.obfuscate(teks);
    let obfuscatedCode = res.getObfuscatedCode();
    
    // Tentukan path file
    let filePath = path.join(__dirname, 'obfuscated.js');
    
    // Tulis hasil enkripsi ke dalam file
    fs.writeFile(filePath, obfuscatedCode, (err) => {
        if (err) {
            console.error(err);
            return conn.reply(m.chat, `Gagal menulis ke file`, m);
        }
        
        // Kirim file ke pengguna
        conn.sendFile(m.chat, filePath, 'obfuscated.js', `Berikut adalah file yang telah di-encrypt.`, m)
            .then(() => {
                fs.unlink(filePath, (err) => {
                    if (err) console.error('Gagal menghapus file:', err);
                });
            })
            .catch(err => {
                console.error('Gagal mengirim file:', err);
                conn.reply(m.chat, `Gagal mengirim file`, m);
            });
    });

    // Balas dengan teks obfuscated jika file berhasil diproses
    conn.reply(m.chat, `Kode Anda telah di-encrypt.`, m);
};

handler.help = ['encrypt *<text>*'];
handler.tags = ['tools'];
handler.command = /^enc(rypt)?$/i;

module.exports = handler;