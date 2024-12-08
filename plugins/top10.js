const canvafy = require('canvafy');

let handler = async (m, { conn }) => {
    let pengguna = await Promise.all(
        Object.entries(global.db.data.users)
            .filter(([jid, user]) => user.registered)
            .sort(([, a], [, b]) => b.message - a.message)
            .slice(0, 10)
            .map(async ([jid, user], index) => {
                let pp = await conn
                    .profilePictureUrl(jid, 'image')
                    .catch(
                        (_) =>
                            'https://telegra.ph/file/24fa902ead26340f3df2c.png'
                    );
                return {
                    top: index + 1,
                    avatar: pp,
                    tags: user.jid,
                    tag: user.name,
                    score: Func.formatter(user.message),
                };
            })
    );

    const top = await new canvafy.Top()
        .setOpacity(0.6)
        .setScoreMessage('Pesan:')
        .setabbreviateNumber(false)
        .setBackground(
            'image',
            'https://telegra.ph/file/6e94e0f591a26d0238de7.jpg'
        )
        .setColors({
            box: '#212121',
            username: '#ffffff',
            score: '#ffffff',
            firstRank: '#f7c716',
            secondRank: '#9e9e9e',
            thirdRank: '#94610f',
        })
        .setUsersData(pengguna)
        .build();

    if (!pengguna.length) pengguna = 'Tidak ada pengguna yang terdaftar';
    let capt = pengguna
        .map(
            (user, index) =>
                `*${index + 1}.* @${user.tags.replace(/@.+/g, '')}\nTotal: ${user.score} (Pesan)`
        )
        .join('\n\n');
    await conn.sendMessage(
        m.chat,
        {
            image: top,
            caption: '*Top 10 Pengguna Bot :*\n\n' + capt,
            mentions: conn.parseMention(capt),
        },
        { quoted: m }
    );
};

handler.tags = ['top10'];
handler.help = handler.command = ['top10'];
handler.register = true;

module.exports = handler;