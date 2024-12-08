const PDFDocument = require('pdfkit');
const { Writable } = require('stream');
const fs = require('fs');
const path = require('path');
const { PDFDocument: PDFLibDocument } = require('pdf-lib');
const poppler = require('pdf-poppler');
const mammoth = require('mammoth');

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let query = `*Contoh*: .${command} Namaku Indra`;
    let text;

    if (args.length >= 1) {
        text = args.slice(0).join(" ");
    } else if (m.quoted && m.quoted.text) {
        text = m.quoted.text;
    } else {
        throw query;
    }

    await m.reply('Please wait...');

    try {
        if (command === 'pdftotext') {
            let pdf = await textToPDFBuffer(text);
            const pdfPath = path.join(__dirname, 'output.pdf');
            fs.writeFileSync(pdfPath, pdf);
            const extractedText = await extractTextFromPDF(pdfPath);
            await m.reply(`Extracted text from PDF: \n${extractedText}`);
        } else if (command === 'pdftoimage') {
            let pdf = await textToPDFBuffer(text);
            const pdfPath = path.join(__dirname, 'output.pdf');
            fs.writeFileSync(pdfPath, pdf);
            const imagePath = path.join(__dirname, 'output.png');
            await convertPDFToImage(pdfPath, imagePath);
            await conn.sendMessage(m.chat, {
                image: { url: imagePath },
                caption: 'Here is the converted image.'
            }, {
                quoted: m
            });
        } else if (command === 'pdftodoc') {
            let pdf = await textToPDFBuffer(text);
            const pdfPath = path.join(__dirname, 'output.pdf');
            fs.writeFileSync(pdfPath, pdf);
            const docPath = path.join(__dirname, 'output.docx');
            await convertPDFToDoc(pdfPath, docPath);
            await conn.sendMessage(m.chat, {
                document: fs.readFileSync(docPath),
                mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                fileName: `For ${m.name}.docx`
            }, {
                quoted: m
            });
        }
    } catch (e) {
        await m.reply('An error occurred.');
    }
};

handler.help = ['pdftotext', 'pdftoimage', 'pdftodoc'];
handler.tags = ['tools'];
handler.command = /^(pdftotext|pdftoimage|pdftodoc)$/i;

module.exports = handler;

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
        doc.text(text);
        doc.end();

        streamBuffer.on('finish', () => {
            const pdfBuffer = Buffer.concat(buffers);
            resolve(pdfBuffer);
        });

        streamBuffer.on('error', reject);
    });
}

async function convertPDFToImage(pdfPath, imagePath) {
    const options = {
        format: 'png',
        out_dir: path.dirname(imagePath),
        out_prefix: path.basename(imagePath, path.extname(imagePath)),
        page: null // Convert all pages
    };

    await poppler.convert(pdfPath, options);
}

async function extractTextFromPDF(pdfPath) {
    const pdfDoc = await PDFLibDocument.load(fs.readFileSync(pdfPath));
    const pages = pdfDoc.getPages();
    const textPromises = pages.map(page => page.getTextContent());
    const texts = await Promise.all(textPromises);
    return texts.flat().map(item => item.str).join(' ');
}

async function convertPDFToDoc(pdfPath, docPath) {
    // Convert PDF to text
    const text = await extractTextFromPDF(pdfPath);
    // Use mammoth to convert text to DOCX
    const docxBuffer = await mammoth.convertToDocx({ html: `<p>${text}</p>` });
    fs.writeFileSync(docPath, docxBuffer.value);
}