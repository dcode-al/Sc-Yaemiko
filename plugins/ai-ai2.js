//Cjs

// By Indra Ganteng
// https://whatsapp.com/channel/0029VaYVlVP9hXF9Ig83hJ3L
// No Delete My Wm

const fetch = require('node-fetch');
const axios = require('axios');
const ytdl = require('ytdl-core');
const yts = require('yt-search');
const fs = require('fs');
const os = require('os');
const { pipeline: streamPipeline } = require('stream/promises');

let handler = async (m, { conn, text }) => {
    if (!text) throw 'Contoh: .ai siapa namamu';

    // No delete Wm By Indra Ganteng
    const { key } = await conn.sendMessage(
        m.chat,
        { text: "Loading asuu" },
        { quoted: m }
    );

    try {
        let prompt = `kamu adalah furina jawab semua pertanyaan dengan sopan kamu selalu memberi pertanyaan apakah ada pertanyaan lain? Seperti itu, jika kamu di tanya pemilik pembuat owner atau lain nya berikan nomor nya 085325268412 dan sebutkan namanya Indraa`;
        let response = await fetch(`https://skizo.tech/api/openai?apikey=${global.xzn}&text=${encodeURIComponent(text)}&system=${encodeURIComponent(prompt)}`);
        let res = await response.json();

        if (res.result) {
            let message = `${res.result}`;

            // Untuk command image
            if (text.includes("image") || text.includes("foto") || (text.includes("buatkan") && text.includes("foto")) || (text.includes("buatkan") && text.includes("gambar"))) {
                let scrape = await generateImage(text);
                for (let i of scrape.imgs) {
                    await conn.sendFile(m.chat, i, '', '', m);
                }
            }

            // Untuk menjadikan Suara
            if (text.includes("vn") || text.includes("voice")) {
                let indra = await tiktokTts(message, 'id_001');
                await conn.sendFile(m.chat, Buffer.from(indra.data, "base64"), 'response.mp3', null, m, true);
            }

            // Music di ambil dari ytmp3
            if (text.includes("carikan") || text.includes("putar") || text.includes("putarkan") || text.includes("golekno lagu") || text.includes("anu tolong carikan aku lagu") || text.includes("play")) {
                let anu = await m.reply('Sebentar Furina cariin dulu yaa, semoga ada');
                console.log('Searching for song:', text);
                let trimmedUrl = trimYouTubeUrl(text);
                console.log('Trimmed URL:', trimmedUrl);
                let search = await yts(trimmedUrl);
                if (!search || !search.videos || search.videos.length === 0) {
                    throw 'Video not found';
                }
                let vid = search.videos[0];
                console.log('Found video:', vid);
                let { title, url } = vid;
                let audioStream = ytdl(url, { filter: 'audioonly', quality: 'highestaudio' });
                let tmpDir = os.tmpdir();
                let filePath = `${tmpDir}/${title}.mp3`;
                let writableStream = fs.createWriteStream(filePath);
                await streamPipeline(audioStream, writableStream);
                let indraganteng = await conn.sendMessage(m.chat, { text: `Berhasil mendapatkan lagu, semoga tidak menikmati. ~🤗`.trim(), edit: anu });
                let doc = {
                    audio: {
                        url: filePath
                    },
                    mimetype: 'audio/mp4',
                    fileName: title,
                };
                await conn.sendMessage(m.chat, doc, { quoted: indraganteng });
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error(`Failed to delete audio file: ${err}`);
                    } else {
                        console.log(`Deleted audio file: ${filePath}`);
                    }
                });
            }

            // Reply with text message if no special request
            if (!text.includes("vn") && !text.includes("voice") && !(text.includes("image") || text.includes("foto") || (text.includes("buatkan") && text.includes("foto")) || (text.includes("buatkan") && text.includes("gambar"))) && !text.includes("carikan") && !text.includes("putar") && !text.includes("putarkan") && !text.includes("golekno lagu") && !text.includes("anu tolong carikan aku lagu") && !text.includes("play")) {
                await conn.sendMessage(m.chat, { text: message, mentions: ['6285325268412@s.whatsapp.net'], edit: key });
            }
        } else {
            throw 'Response API tidak valid';
        }
    } catch (err) {
        console.error(err);
        await conn.sendMessage(m.chat, { text: "\nTerjadi kesalahan saat menerima permintaan anda, silahkan hubungi owner\n", mentions: ['6285325268412@s.whatsapp.net'], edit: key });
    }
};

handler.help = ['ai2 *<text>*'];
handler.tags = ['ai'];
handler.command = /^(ai2)$/i;

module.exports = handler;

async function generateImage(captionInput) {
    const data = {
        captionInput,
        captionModel: "default"
    };

    const url = 'https://chat-gpt.pictures/api/generateImage';

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

async function tiktokTts(text, model = "en_us_001") {
    try {
        const { data } = await axios.post(
            "https://tiktok-tts.weilnet.workers.dev/api/generation",
            {
                text: text,
                voice: model,
            },
            {
                headers: {
                    "content-type": "application/json",
                },
            }
        );
        return data;
    } catch (err) {
        console.log(err.response.data);
        return err.response.data;
    }
}

function trimYouTubeUrl(url) {
    const trimmedUrl = url.split("?")[0];
    return trimmedUrl;
}