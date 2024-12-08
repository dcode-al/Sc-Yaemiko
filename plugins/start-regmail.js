let nodemailer = require('nodemailer');
let fs = require('fs');
let { createCanvas, loadImage } = require('canvas');
let verify = JSON.parse(fs.readFileSync('./system/verify.json', 'utf-8'));

let handler = async function (m, { conn, args, usedPrefix, command }) {
    try {
        let users = global.db.data.users[m.sender];
        let name = await conn.getName(m.sender);
        if (users.registered === true) return conn.reply(m.chat, Func.texted('bold', `✅ Your number is already verified.`), m);
        if (!args || !args[0]) return conn.reply(m.chat, `• *Example :* .${command} ${global.email}`, m);
        await conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key }});

        if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/ig.test(args[0])) return conn.reply(m.chat, Func.texted('bold', '🚩 Invalid email.'), m);

        let code = `${getRandomInt(100, 900)}-${getRandomInt(100, 900)}`;
        let kemii = conn.user.jid.split("@")[0];
        users.codeExpire = new Date() * 1;
        users.code = code;
        users.email = args[0];

        // Generate image with code
        let imageUrl = 'https://i.ibb.co/x7pWX1z/20240804-153752.png';
        let img = await loadImage(imageUrl);
        let scale = 1.5; // Scale factor for image
        let canvas = createCanvas(img.width * scale, img.height * scale); // Enlarge the canvas
        let ctx = canvas.getContext('2d');

        // Draw the base image
        ctx.drawImage(img, -50, 0, img.width * scale, img.height * scale); // Shift image to the left and scale it

        // Set border around the image
        ctx.lineWidth = 10; // Border thickness
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)'; // Border color
        ctx.strokeRect(0, 0, canvas.width, canvas.height); // Draw the border

        // Set font properties for the code
        ctx.font = 'bold 80px Arial'; // Decreased font size for code
        ctx.fillStyle = 'rgba(255, 255, 255, 1)'; // White text
        ctx.textAlign = 'center';

        // Calculate text position (move it far right)
        const xPos = (img.width * scale) - 250; // Shift code to the left
        const yPos = (img.height * scale) / 2; // Center the vertical position

        // Draw the code on the image
        ctx.fillText(code, xPos, yPos);

        let imageBuffer = canvas.toBuffer();

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
                name: 'Furina Registrasi',
                address: 'furinabussines@gmail.com'
            },
            to: args[0],
            subject: 'Email Verification',
            html: `<div style="padding: 20px; border: 1px dashed #222; font-size: 15px; font-family: Arial, sans-serif; line-height: 1.6; background-color: #f9f9f9; color: #333;">
                    <div style="text-align: center;">
                        <h2 style="color: #333;">Hi <b>${name} 😘</b></h2>
                        <div style="text-align: center; margin: 20px 0;">
                            <img src="cid:unique@codeimage" alt="Thumbnail" style="width: 300px; height: auto; border-radius: 10px;">
                        </div>
                    </div>
                    <p>Confirm your email to be able to use Furina-Botz. Send this code to the bot and it will expire in 3 minutes:</p>
                    <div style="text-align: center; font-size: 32px; font-weight: bold; color: #d9534f; margin: 20px 0;">
                        ${code}
                    </div>
                    <div style="text-align: center; margin: 20px 0;">
                        <a href="https://wa.me/${kemii}?text=${code}" style="text-decoration: none;">
                            <span style="display: inline-block; padding: 12px 25px; background-color: #0275d8; color: #fff; border: 2px solid #025aa5; border-radius: 5px; cursor: pointer; font-size: 16px;">
                                Verify via WhatsApp
                            </span>
                        </a>
                    </div>
                    <hr style="border: 0; border-top: 1px dashed #222; margin: 20px 0;">
                    <div style="text-align: center; color: #555;">
                        Powered by: <b>Furina Register | Indraa</b>
                    </div>
                </div>`,
            attachments: [{
                filename: 'code-image.png',
                content: imageBuffer,
                cid: 'unique@codeimage'
            }]
        };

        transport.sendMail(mailOptions, function (err, data) {
            if (err) return m.reply(Func.texted('bold', `❌ SMTP Error !!`));
            return conn.reply(m.chat, Func.texted('bold', `✅ Check your mailbox to get a verification code.`), m);
        });
    } catch (e) {
        conn.reply(m.chat, Func.jsonFormat(e), m);
    }
};

handler.help = ['reg *<email>*'];
handler.tags = ['start'];
handler.command = /^(reg|regmail)$/i;
handler.private = false;

module.exports = handler;

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}