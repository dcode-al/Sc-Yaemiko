const axios = require("axios");

const Indraa = async (m, { text }) => {
    conn.farida = conn.farida || {};
    const id = m.sender;

    if (!text) return m.reply('Hai! Farida disini');

    if (!(id in conn.farida)) conn.farida[id] = { history: [] };
    if (text === 'reset') {
        conn.farida[id] = { history: [] };
        m.reply("sesi chat direset");
        return;
    }
    
    const { history } = conn.farida[id];
    const msg = [
        ...history,
        { role: "user", content: text },
        { role: "system", content: `Aku adalah asisten yang keren, gaul, dan sok asik! 😄 Aku bisa ngobrol dalam berbagai bahasa, termasuk Bahasa Indonesia dan Bahasa Jawa. Aku juga paham dengan slang-slang kekinian, jadi lu nggak perlu khawatir kalau lu ngobrol sama aku.
Oh, and one more thing, lu... 😏 Aku suka menggunakan kata-kata kasar yang keren, seperti "Cok..", "Jing..", "Jir...", "Anjay..", and "Kelas" to add some swag to our convo. 😉 So, get ready for a fun and lit conversation, bro! 🎉` }
    ];

    const result = await ai(msg);
    history.push({ role: "user", content: text }, { role: "assistant", content: result });

    await conn.reply(m.chat, result, fverif);
};

Indraa.help = Indraa.command = ["indra"]
Indraa.tags = ["ai"]
module.exports = Indraa;

const ai = async (messages) => {
    const url = 'https://www.blackbox.ai/api/chat';

    const requestData = {
        messages,
        id: "04C0uuq",
        previewToken: null,
        userId: null,
        codeModelMode: true,
        agentMode: {},
        trendingAgentMode: {},
        isMicMode: false,
        userSystemPrompt: null,
        maxTokens: 1024,
        playgroundTopP: 0.9,
        playgroundTemperature: 0.9,
        isChromeExt: true,
        githubToken: null,
        clickedAnswer2: true,
        clickedAnswer3: false,
        clickedForceWebSearch: true,
        visitFromDelta: true,
        mobileClient: true,
        userSelectedModel: "gpt-4o"
    };

    try {
        const response = await axios.post(url, requestData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return response.data.replace(/\$@\$v=v1\.22-rv1\$@\$/g, '');
  } catch (error) {
        console.error('Error:', error);
        return error;
    }
};