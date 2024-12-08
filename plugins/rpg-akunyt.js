let handler = async (m, { conn, command, args, usedPrefix }) => {
    try {
        const user = global.db.data.users[m.sender];
        const tag = '@' + m.sender.split('@')[0]; // Corrected to get user tag without '@'
        let playButton = user.playButton || 0; // Default to 0 if playButton is undefined

        // Function to format number properly
        function formatNumber(number) {
            if (number >= 1000000) {
                return (number / 1000000).toFixed(1) + 'Jt';
            } else if (number >= 1000) {
                return (number / 1000).toFixed(1) + 'K';
            } else {
                return number;
            }
        }

        if (command === 'akunyt') {
            let targetNumber = m.sender; // By default, check the user's own account
            let targetTag = tag; // By default, use the user's own tag

            // Check if there are arguments passed (assuming it's a WhatsApp number)
            if (args.length > 0) {
                // Validate and format the WhatsApp number
                targetNumber = formatNumber(args[0]);
                targetTag = '@' + args[0].split('@')[0]; // Get tag from the number
            }

            // Check if the target user has a YouTube account
            if (!global.db.data.users[targetNumber]?.youtube_account) {
                return conn.reply(m.chat, `Hey ${targetTag}, buat akun terlebih dahulu\nKetik: ${usedPrefix}createakun`, m);
            }

            // Fetch the target user's account details
            const targetUser = global.db.data.users[targetNumber];
            const formattedSubscribers = formatNumber(targetUser.subscribers || 0);
            const formattedViewers = formatNumber(targetUser.viewers || 0);
            const formattedLike = formatNumber(targetUser.like || 0);

            const silverButton = targetUser.playButton >= 1 ? '✅' : '❎';
            const goldButton = targetUser.playButton >= 2 ? '✅' : '❎';
            const diamondButton = targetUser.playButton >= 3 ? '✅' : '❎';

            // Reply with the target user's YouTube account details
            return conn.reply(m.chat, `📈 Akun YouTube ${targetTag} 📉\n
🧑🏻‍💻 *Streamer:* ${targetUser.registered ? targetTag : conn.getName(targetNumber)}
🌐 *Channel:* ${targetUser.youtube_account}
👥 *Subscribers:* ${formattedSubscribers}
🪬 *Viewers:* ${formattedViewers}
👍🏻 *Like:* ${formattedLike}

⬜ *Silver PlayButton:* ${silverButton}
🟧 *Gold PlayButton:* ${goldButton}
💎 *Diamond PlayButton:* ${diamondButton}`, m);

        } else if (/^live youtuber/i.test(command)) {
            // Logic for 'live youtuber' command can be implemented here if needed
            // const liveTitle = args.join(' '); // Example of capturing live title
            // Perform actions related to starting a live stream

        } else {
            return await m.reply("Perintah tidak dikenali.\n*.akunyt*\n> Untuk mengecek akun YouTube Anda\n*.live youtuber [judul live]*\n> Untuk memulai aktivitas live streaming.");
        }
    } catch (err) {
        console.error(err); // Log the error for debugging
        return m.reply("Terjadi kesalahan dalam memproses perintah.");
    }
};

handler.help = ['akunyt [nomor]'];
handler.tags = ['rpg'];
handler.command = /^(akunyt)$/i;
handler.register = true;
handler.group = true;

module.exports = handler;