const fetch = require ('node-fetch')
let handler = async (m, { conn, usedPrefix, command, text }) => {
 if (!text) throw `Use ${usedPrefix + command} Hii`
	conn.sendMessage(m.chat, { react: { text: '✨', key: m.key }})
try {
let data = await nvidia(text) 
await conn.sendMessage(m.chat, { text: `${data}` }, { quoted: m}) 
} catch (e) {
  m.reply('Failed request to server') 
 }
}

handler.help = ['nvidia']
handler.tags = ['ai']
handler.command = /^(nvidia)$/i
module.exports = handler
/** 
 *  Scrapper by Irull2nd
 *  Delete wm? Ywdh Sih😹
 *  My Github : https://github.com/izumii44
 *  My Channell : https://bit.ly/3VHEPEL
*/

async function nvidia(q) {
    try {
    let key = "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";
    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${key}`,
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.1 Mobile/15E148',
        },
        body: JSON.stringify({
        model: 'nvidia/nemotron-4-340b-instruct',
        messages: [
        {
        role: 'user',
        content: q,
        }
        ],
        temperature: '0.2',
        top_p: '0.9',
        max_tokens: '1024',
        stream: false
        }),
    });
    const data = await response.json();
    
    let res = data.choices[0]?.message?.content || '';
    return res;
        } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}