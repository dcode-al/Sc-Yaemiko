const fetch = require('node-fetch')

let handler = async (m, {
    command,
    usedPrefix,
    conn,
    text,
    args
}) => {
    let [tema, urutan] = text.split(/[^\w\s]/g)
    if (!tema) return m.reply("• *Example :* .tenor [tema]|[angka]")
    if (!urutan) return m.reply("• *Example :* .tenor [tema]|[angka]")
    if (isNaN(urutan)) return m.reply("• *Example :* .tenor [tema]|[angka]")
    conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key }})
    try {
        let json = await getTemplateImageUrl(tema, urutan)
        let data = json.one
        let all = json.all
        if (urutan > all.length) return m.reply("• *Example :* .tenor [tema]|[angka]\n\n*Pilih angka yg ada*\n" + all.map((item, index) => `*${index + 1}.* ${item.content_description}`).join("\n"))
        if (isValidURL(data.media[0].mp4.url)) {            
            let caption = '```Result from:```' + ' `'+tema+'`'
            await conn.sendMessage(m.chat, {
                video: {
                    url: data.media[0].mp4.url
                },
                caption: caption,
                gifPlayback: true,
                gifAttribution: 2
            }, {
                quoted: m
            })
        }
    } catch (e) {
        await m.reply(eror)
    }
}
handler.help = ["tenor *<tema>|<number>*"]
handler.tags = ["sticker"]
handler.command = /^(tenor)$/i
module.exports = handler

function isValidURL(message) {
    const urlPattern = /https?:\/\/[^\s/$.?#].[^\s]*/;
    return urlPattern.test(message);
}

async function getTemplateImageUrl(input, number) {
    try {
        const data = await (await fetch(`https://g.tenor.com/v1/search?q=${input}&key=LIVDSRZULELA`)).json();
        const selectedId = data.results[number - 1];
        return {
            one: selectedId,
            all: data.results
        };
    } catch (error) {
        console.error("Error fetching data:", error);
        return "Error fetching data.";
    }
}