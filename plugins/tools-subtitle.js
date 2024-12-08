const axios = require("axios")
const handler = async (m, {
    conn,
    args,
    usedPrefix,
    command
}) => {
    const text = args.length >= 1 ? args.slice(0).join(" ") : (m.quoted && m.quoted?.text || m.quoted?.caption || m.quoted?.description) || null;

    if (!text) return m.reply(`Masukkan teks atau reply pesan dengan teks yang ingin diolah.\nContoh penggunaan:\n*${usedPrefix}${command} https://youtu.be/2n_pCQsh09E?si=QG0IhoDUkXnTzka_*`);
    try {
        const transcribe = await subtitle(text);
        await m.reply(transcribe);
    } catch (error) {
        console.error("Error in handler:", error);
    }
};

handler.help = ['subtitleyt', 'subtitle'];
handler.tags = ['tools'];
handler.command = /^(subtitleyt|subtitleyoutube|subtitle)$/i;
module.exports = handler;
const apiInstance = axios.create({
    baseURL: "https://api.kome.ai",
    headers: {
        "Content-Type": "application/json",
        "Referer": "https://api.kome.ai"
    }
});

const subtitle = async (videoId) => {
    try {
        const response = await apiInstance.post("/api/tools/youtube-transcripts", {
            video_id: videoId,
            format: true
        });

        if (response.data.transcript === undefined) {
            throw new Error("Transcript not found");
        }

        return response.data.transcript;
    } catch (error) {
        console.error("Error in youtubeTranscript:", error);
    }
};