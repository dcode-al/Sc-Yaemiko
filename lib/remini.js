/*
  * Decrypted by Ditz
  * Share aja tapi jangan apus credit ku
  */

const FormData = require("form-data");
const https = require('https');

async function remini(imageBuffer, enhancementType) {
  return new Promise((resolve, reject) => {
    const enhancementTypes = ['enhance', 'recolor', 'dehaze'];

    // Validate enhancementType and set default if invalid
    if (!enhancementTypes.includes(enhancementType)) {
      enhancementType = enhancementTypes[0];
    }

    const formData = new FormData();
    const apiUrl = `https://inferenceengine.vyro.ai/${enhancementType}`;

    // Append necessary fields to formData
    formData.append("model_version", 1, {
      'Content-Transfer-Encoding': "binary",
      'contentType': "multipart/form-data; charset=utf-8"
    });
    formData.append('image', imageBuffer, {
      'filename': "enhance_image_body.jpg",
      'contentType': "image/jpeg"
    });

    // Submit the form data
    const options = {
      method: 'POST',
      headers: {
        ...formData.getHeaders(),
        'User-Agent': 'okhttp/4.9.3',
        'Connection': 'Keep-Alive',
        'Accept-Encoding': 'gzip'
      }
    };

    const req = https.request(apiUrl, options, (res) => {
      const chunks = [];

      res.on('data', (chunk) => {
        chunks.push(chunk);
      });

      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        resolve(buffer);
      });

      res.on('error', (error) => {
        reject(new Error(`Error in remini: ${error.message}`));
      });
    });

    formData.pipe(req);

    req.on('error', (error) => {
      reject(new Error(`Error in remini: ${error.message}`));
    });
  });
}

module.exports.remini = remini;