const handler = async (m, { conn, command, args, usedPrefix }) => {
    try {
        const user = global.db.data.users[m.sender];
        const tag = '@' + m.sender.split('@')[0]; // Get user tag

        // Function to format number properly
        function formatNumber(number) {
            return number.replace(/\s/g, '').replace(/[@+-]/g, '') + '@s.whatsapp.net';
        }

        if (command === 'akuntt') {
            let targetNumber = m.sender; // By default, check the user's own account
            let targetTag = tag; // By default, use the user's own tag

            // Check if there are arguments passed (assuming it's a WhatsApp number)
            if (args.length > 0) {
                // Validate and format the WhatsApp number
                targetNumber = formatNumber(args[0]);
                targetTag = '@' + args[0].split('@')[0]; // Get tag from the number
            }

            // Check if the target user has a TikTok account
            if (!global.db.data.users[targetNumber]?.tiktok_account) {
                return conn.reply(m.chat, `Hey ${targetTag}, kamu belum memiliki akun TikTok.\nBuat akun terlebih dahulu.\nKetik: ${usedPrefix}createakuntt`, m);
            }

            // Fetch the target user's account details
            const targetUser = global.db.data.users[targetNumber];
            const formattedFans = new Intl.NumberFormat().format(targetUser.fans || 0);
            const formattedViewerstt = new Intl.NumberFormat().format(targetUser.viewerstt || 0);
            const formattedLikestt = new Intl.NumberFormat().format(targetUser.likestt || 0);
            const formattedComments = new Intl.NumberFormat().format(targetUser.comments || 0);
            const formattedMoney = new Intl.NumberFormat().format(targetUser.money || 0);

            // Reply with the target user's TikTok account details
            return conn.reply(m.chat, `📈 *Akun TikTok ${targetTag}* 📉\n
🧑🏻‍💻 *Uploader:* ${targetUser.registered ? targetTag : conn.getName(targetNumber)}
👥 *Fans:* ${formattedFans}
👀 *Viewers:* ${formattedViewerstt}
👍🏻 *Likes:* ${formattedLikestt}
💬 *Total Comments:* ${formattedComments}
💹 *Total Money:* ${formattedMoney}`, m);

        } else if (/^uploadtt/i.test(command)) {
            // Check if the user has a TikTok account
            if (!user.tiktok_account) {
                return conn.reply(m.chat, `Hey ${tag}, kamu belum memiliki akun TikTok.\nBuat akun terlebih dahulu.\nKetik: ${usedPrefix}createakuntt`, m);
            }

            // Check for cooldown
            const now = Date.now();
            const cooldownTime = 5 * 60 * 1000; // 5 minutes in milliseconds
            if (user.lastUpload && (now - user.lastUpload < cooldownTime)) {
                const timeLeft = Math.ceil((cooldownTime - (now - user.lastUpload)) / 1000);
                const minutesLeft = Math.floor(timeLeft / 60);
                const secondsLeft = timeLeft % 60;
                return conn.reply(m.chat, `${tag}, tunggu ${minutesLeft} menit dan ${secondsLeft} detik lagi sebelum melakukan upload lagi.`, m);
            }

            // Check if TikTok video link is provided
            let videoLink = args[0];
            if (!videoLink) {
                return conn.reply(m.chat, `${tag}, silakan berikan judul untuk di upload.`, m);
            }

            // Simulate upload process (replace with actual upload process if API available)
            const uploadResult = await simulateUpload(videoLink);

            // Update user information (if necessary)
            user.viewerstt = (user.viewerstt || 0) + uploadResult.viewerstt;
            user.likestt = (user.likestt || 0) + uploadResult.likestt;
            user.comments = (user.comments || 0) + uploadResult.comments;
            user.fans = (user.fans || 0) + uploadResult.fans;
            user.money = (user.money || 0) + uploadResult.coinsEarned;
            user.lastUpload = now; // Update the last upload time

            // Send upload results message
            return conn.sendMessage(m.chat, {
                text: `
📤 *Hasil Upload TikTok*

🧑🏻‍💻 *Uploader:* ${tag}
📹 *Judul:* ${videoLink}
🎉 *Viewers:* ${new Intl.NumberFormat('en-US').format(uploadResult.viewerstt)}
👍🏻 *Likes:* ${new Intl.NumberFormat('en-US').format(uploadResult.likestt)}
🗣️ *Comments:* ${new Intl.NumberFormat('en-US').format(uploadResult.comments)}
👥 *Fans Baru:* ${new Intl.NumberFormat('en-US').format(uploadResult.fans)}
📊 *Total Coins Earned:* ${new Intl.NumberFormat().format(uploadResult.coinsEarned)}
`,
                contextInfo: {
                    mentionedJid: [m.sender],
                    externalAdReply: {
                        title: 'Hasil Upload TikTok',
                        body: 'Hasil upload video TikTok.',
                        thumbnailUrl: 'https://telegra.ph/file/bd03c2a4b63b9272661b6.jpg',
                        mediaType: 1,
                        renderLargerThumbnail: true
                    }
                }
            }, { quoted: m });

        } else {
            return conn.reply(m.chat, "Perintah tidak dikenali.\n*.akuntt *@taguser*\n> Untuk mengecek akun TikTok Anda\n*.uploadtt [judul video]*\n> Untuk memulai aktivitas upload video.", m);
        }
    } catch (err) {
        console.error(err); // Log the error for debugging
        return conn.reply(m.chat, "Terjadi kesalahan dalam memproses perintah.", m);
    }
};

// Function to simulate upload process (replace with actual upload process if API available)
async function simulateUpload(videoLink) {
    // Simulate data for uploaded video
    const randomViewerstt = Math.floor(Math.random() * (1000000 - 100 + 1)) + 1;
    const randomLikestt = Math.floor(Math.random() * (1000 - 20 + 1)) + 10;
    const randomComments = Math.floor(Math.random() * (500 - 10 + 1)) + 10;
    const randomFans = Math.floor(Math.random() * (500 - 10 + 1)) + 10;
    const randomCoinsEarned = Math.floor(Math.random() * (200000 - 10000 + 1)) + 10000;

    return {
        viewerstt: randomViewerstt,
        likestt: randomLikestt,
        comments: randomComments,
        fans: randomFans,
        coinsEarned: randomCoinsEarned
    };
}

handler.help = ['akuntt *@taguser*', 'uploadtt [judul video]'];
handler.tags = ['rpg'];
handler.command = /^(akuntt|uploadtt)$/i;
handler.register = true;
handler.group = true;

module.exports = handler;