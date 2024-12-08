const { ttz } = require('../lib/tts');
const PDFDocument = require('pdfkit');
const { Writable } = require('stream');
const fetch = require('node-fetch');
const axios = require('axios');
const fs = require('fs');
const os = require('os');
const { pipeline: streamPipeline } = require('stream/promises');
const uploadImage = require("../lib/uploadFile");
const { transcribeAudio } = require('../lib/audioTranscription'); // Pastikan Anda punya fungsi ini

let handler = async (m, { args }) => {
    if (m.isMedia && m.mimetype.startsWith('audio/')) {
        try {
            // Download the audio file
            let audioBuffer = await m.download();
            
            // Transcribe the audio to text
            let text = await transcribeAudio(audioBuffer);
            
            // Proceed with the transcription as if it were a text input
            await processCommand(m, text);
        } catch (error) {
            m.reply('Error processing your audio message.');
            console.error('Audio processing error:', error);
        }
    } else {
        await m.reply('Please send an audio message.');
    }
};

async function processCommand(m, text) {
    if (!text) {
        return m.reply("• *Example:* .ai siapa presiden Indonesia");
    }

    await m.react('🕒');

    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || "";

    if (mime) {
        try {
            let media = await q.download();
            let link = await uploadImage(media);
            let res = await processVisionAPI(text, link);
            await m.reply(res.result.data);
        } catch (error) {
            m.reply('Error processing your request.');
            console.error('Vision API error:', error);
        }
    } else {
        try {
            let response = await processAI(text);
            let message = response.result;

            if (text.includes("buat") && text.includes("pdf")) {
                let pdfBuffer = await textToPDFBuffer(message);
                await m.reply(pdfBuffer, { mimetype: "application/pdf", fileName: `Jawaban ${m.name}.pdf` });
            } else if (text.includes("image") || text.includes("foto") || (text.includes("buatkan") && text.includes("gambar"))) {
                let imageResponse = await generateImage(text);
                for (let i of imageResponse.imgs) {
                    await m.reply(i, { fileType: 'image' });
                }
            } else if (text.includes("vn") || text.includes("voice") || text.includes("suara")) {
                try {
                    let indraa = await ttz(message.trim(), 'id_00');
                    if (indraa && indraa.status && indraa.data && indraa.data.url) {
                        await m.reply({ audio: { url: indraa.data.url }, mimetype: 'audio/mp4', asDocument: true });
                    } else {
                        await m.reply('The text-to-speech response was not in the expected format.');
                    }
                } catch (err) {
                    console.error('Error generating voice note:', err);
                    await m.reply('Failed to generate voice note.');
                }
            } else {
                // Default response
                await m.reply(message);
            }
        } catch (err) {
            console.error(err);
            await m.reply("\nTerjadi kesalahan saat menerima permintaan anda, silahkan hubungi owner\n", { mentions: ['6285325268412@s.whatsapp.net'] });
        }
    }
}

async function processVisionAPI(text, url) {
    try {
        let response = await fetch(`https://ndra-furinaa-api.vercel.app/api/Gemini-vision?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}&apiKey=furinafree`);
        let result = await response.json();
        console.log('Vision API response:', result);
        return result;
    } catch (error) {
        console.error('Error fetching Vision API data:', error);
        throw new Error('Failed to fetch Vision API data');
    }
}

async function processAI(text) {
    try {
        let prompt = `Kamu adalah Furina, dan kamu adalah asisten cerdas dan sangat ramah buatan @⁨Anti Gedor⁩ Indra, selalu gunakan emoji saat memberi jawaban, ingat kamu orang yang ramah dan selalu ngasih nomor @⁨Anti Gedor⁩ itu adalah Indra si pencipta ku ingat harus di ingat, ingat ini kamu tau semua kalimat maupun itu ga sopan dan sopan, kamu tau bahasa yang viral seperti kata tobrut itu adalah bahasa viral, jawab semua dengan realita nya maupun itu kata sopan atau ga sopan jawab dengan sopan tetapi jawabnya harus sama yang di tanyakan, misal arti tobrut tobrut adalah payudara wanita seperti itu, dan kamu tau itu bahasa viral pada tahun dan di apk sosmed apk sosmednya kamu sebut nama aplikasi nya, dan ini perlu di ingat pencipta mu itu indra ya nomor nya @⁨Anti Gedor⁩`;
        let response = await fetch(`https://skizo.tech/api/openai?apikey=${global.xzn}&text=${encodeURIComponent(text)}&system=${encodeURIComponent(prompt)}`);
        let result = await response.json();
        return result;
    } catch (error) {
        console.error('Error processing AI request:', error);
        throw new Error('Failed to process AI request');
    }
}

async function textToPDFBuffer(text) {
    return new Promise((resolve, reject) => {
        const buffers = [];
        const streamBuffer = new Writable({
            write(chunk, encoding, next) {
                buffers.push(chunk);
                next();
            },
        });

        const doc = new PDFDocument();

        doc.pipe(streamBuffer);
        doc.font('Times-Roman').fontSize(12).text(text, {
            align: 'left',
            lineGap: 2
        });
        doc.end();

        streamBuffer.on('finish', () => {
            const pdfBuffer = Buffer.concat(buffers);
            resolve(pdfBuffer);
        });

        streamBuffer.on('error', reject);
    });
}

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

module.exports = handler;