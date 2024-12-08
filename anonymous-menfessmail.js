const nodemailer = require('nodemailer');
const fs = require('fs');

let handler = async (m, { conn, text, usedPrefix, command }) => {
    conn.menfess = conn.menfess ? conn.menfess : {};

    if (!text) return conn.reply(m.chat, `• *Example :* .menfessmail email@gmail.com|Your Name|Your Message`, m);

    let [email, name, pesan] = text.split('|');
    if (!email || !name || !pesan) return conn.reply(m.chat, `• *Example :* .menfessmail email@gmail.com|Your Name|Your Message`, m);

    if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/ig.test(email)) {
        return conn.reply(m.chat, `🚩 Invalid email address.`, m);
    }

    let mf = Object.values(conn.menfess).find(mf => mf.status === true);
    if (mf) return conn.reply(m.chat, `Another menfess message is currently being processed.`, m);

    // Create transport for sending email
    let transport = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'furinabussines@gmail.com', 
            pass: 'bnhdizqizikxobdp'           
        }
    });

    let mailOptions = {
        from: {
            name: 'Menfess Service',
            address: 'furinabussines@gmail.com' 
        },
        to: email,
        subject: 'Anonymous Message',
        html: `
            <div style="padding: 20px; border: 1px dashed #222; font-size: 15px; font-family: Arial, sans-serif; line-height: 1.6; background-color: #f9f9f9; color: #333;">
                <div style="text-align: center;">
                    <h2 style="color: #333;">Pesan Dari <b>${name}</b></h2>
                    <p>Kamu menerima Pesan dari ${name} :</p>
                    <div style="text-align: center; font-size: 20px; font-weight: bold; color: #d9534f; margin: 20px 0;">
                        ${pesan}
                    </div>
                </div>
                <hr style="border: 0; border-top: 1px dashed #222; margin: 20px 0;">
                <div style="text-align: center; color: #555;">
                    Powered by: <b>Menfess Service</b>
                </div>
            </div>`
    };

    transport.sendMail(mailOptions, (err, data) => {
        if (err) return conn.reply(m.chat, `❌ Error sending email: ${err.message}`, m);

        conn.reply(m.chat, `✅ Successfully sent menfess message to ${email}.`, m);

        let id = +new Date();
        conn.menfess[id] = {
            id,
            dari: m.sender,
            nama: name,
            penerima: email,
            pesan: pesan,
            status: false
        };
    });
};

handler.tags = ['anonymous'];
handler.help = ['menfessmail', 'menfesmail'].map(v => v + ' *<email|name|text>*');
handler.command = /^(menfessmail|menfesmail|confessmail|confesmail)$/i;
handler.private = true;

module.exports = handler;