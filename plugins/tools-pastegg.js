let fetch = require('node-fetch')

let handler = async (m, {
	args,
	text,
	usedPrefix,
	command
}) => {
		if (!text) throw '• *Example :* .pasteegg Kemii';
		await conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key }})
		const response = await pasteGG(text);
		if (response) {
			const pesan = `*Pesan Anda berhasil terkirim! 🚀*\n\n*Detail:*\n*URL:* ${response}`;
			await m.reply(pesan);
		} else {
			await m.reply('Pesan Anda gagal terkirim. 🙁');
		}
}
handler.help = ['pastegg *<text>*']
handler.tags = ['tools']
handler.command = /^(pastegg)$/i
module.exports = handler

async function pasteGG(input) {
  try {
    const res = await fetch("https://api.paste.gg/v1/pastes", {
        method: "POST",
        body: JSON.stringify({
            files: [
                {
                    content: {
                        format: "text",
                        value: input,
                    },
                },
            ],
        }),
        headers: {
            "Content-Type": "application/json",
        },
    });
    const json = await res.json();
    return `https://paste.gg/p/anonymous/${json.result.id}`;
  } catch (error) {
    console.error('Error:', error.message);
    // Handle errors as needed
  }
}
