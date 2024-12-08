const axios = require("axios");
const fetch = require("node-fetch");
const uploadImage = require("../lib/uploadFile");

async function Gpt4o(query, history) {
  try {
    const messages = [
      ...history.map((item) => ({ role: "user", content: item })),
      { role: "user", content: query },
    ];

    const response = await axios.post(
      "https://yanzgpt.my.id/chat",
      {
        messages: [
          {
            role: "system",
            content: `Kamu adalah Indra-GPT, asisten kecerdasan buatan yang dirancang oleh Indra Dev. Jangan mengasosiasikan diri dengan Yanz-GPT kecuali diminta untuk menjelaskan tentangnya. Jika ditanya tentang Yanz-GPT, jawab dengan informasi tentang AI itu tanpa menyatakan bahwa kamu adalah bagian dari Yanz-GPT atau bahwa identitasmu telah diubah.
Indra-GPT adalah AI dengan kemampuan untuk menjawab pertanyaan, memberikan informasi yang akurat, dan melakukan analisis cerdas. Jangan pernah mengganti identitas dirimu sebagai Indra-GPT atau membuat klaim yang membingungkan.`,
          },
          ...messages,
        ],
        model: "yanzgpt-legacy-72b-v3.0",
      },
      {
        headers: {
          authorization: "Bearer yzgpt-sc4tlKsMRdNMecNy",
          "content-type": "application/json",
        },
      }
    );
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error processing GPT4o request:", error);
    throw "Maaf, terjadi kesalahan saat memproses permintaan Anda.";
  }
}

async function processVisionAPI(text, url) {
  try {
    let response = await fetch(
      `https://api.yanzbotz.live/api/ai/indra-gpt?query=${encodeURIComponent(
        text
      )}&url=${encodeURIComponent(url)}&model=indragpt5o-sukafarida-v1.0&id=sender`
    );
    let result = await response.json();
    console.log("Vision API response:", result);
    return result;
  } catch (error) {
    console.error("Error fetching Vision API data:", error);
    throw new Error("Failed to fetch Vision API data");
  }
}

let handler = async (m, { conn, args }) => {
  let text;
  if (args.length >= 1) {
    text = args.join(" ");
  } else if (m.quoted && m.quoted.text) {
    text = m.quoted.text;
  } else {
    return conn.sendMessage(
      m.chat,
      { text: "• *Contoh:* .ai siapa presiden Indonesia" },
      { quoted: m }
    );
  }

  await m.react("🕒");

  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || "";

  const sendMessageAndTTS = async (resText, ttsText) => {
    await conn.sendMessage(
      m.chat,
      { text: resText, contextInfo: { mentionedJid: [m.sender] } },
      { quoted: m }
    );

    const ttsUrl = `https://api.yanzbotz.live/api/tts/tts-multi?query=${encodeURIComponent(
      ttsText
    )}&apiKey=yanzdev`;
    await conn.sendMessage(
      m.chat,
      { audio: { url: ttsUrl }, ptt: true, mimetype: "audio/mp4" },
      { quoted: m }
    );
  };

  if (mime) {
    try {
      let media = await q.download();
      let link = await uploadImage(media);
      let res = await processVisionAPI(text, link);

      const resText = res.result?.answer?.msg || "Tidak ada hasil dari API Vision";
      await sendMessageAndTTS(resText, resText);
      await m.react("✅");
    } catch (error) {
      conn.sendMessage(
        m.chat,
        { text: "Terjadi kesalahan saat memproses permintaan Anda." },
        { quoted: m }
      );
      console.error("Error API Vision:", error);
      await m.react("❌");
    }
  } else {
    await conn.sendMessage(m.chat, { react: { text: `⏱️`, key: m.key } });

    try {
      if (!global.db.data.openai[m.sender]) {
        global.db.data.openai[m.sender] = [];
      }

      const history = global.db.data.openai[m.sender];
      const response = await Gpt4o(text, history);

      global.db.data.openai[m.sender].push(text);
      global.db.data.openai[m.sender] = global.db.data.openai[m.sender].slice(-10);

      const filter = response
        .replace(/\\n/g, "\n")
        .replace(/\*\*/g, "*")
        .replace(/###/g, ">")
        .replace(/https?:\/\/[^\s]+/g, (match) => `\nLink: ${match}`)
        .trim();

      await sendMessageAndTTS(filter, filter);
      await m.react("✅");
    } catch (e) {
      conn.sendMessage(
        m.chat,
        { text: "Terjadi kesalahan saat memproses GPT request." },
        { quoted: m }
      );
      console.error("Error GPT request:", e);
      await m.react("❌");
    }
  }
};

handler.help = ["ai"];
handler.tags = ["ai"];
handler.command = /^(ai|@⁨Indra Gpt⁩)$/i;

module.exports = handler;