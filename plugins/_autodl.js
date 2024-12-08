const axios = require('axios');
const cheerio = require('cheerio');
const { tiktok } = require('api-dylux');

// Menyimpan status aktif atau non-aktif untuk setiap pengguna
global.db.data.download = global.db.data.download || {};

async function before(m) {
  conn.download = conn.download ? conn.download : {};

  // Cek apakah perintah on/off
  if (m.text.toLowerCase() === 'autodown on') {
    conn.download[m.sender] = { aktif: true };
    await m.reply('Sukses On.');
    return;
  }
  
  if (m.text.toLowerCase() === 'autodown off') {
    delete conn.download[m.sender];
    await m.reply('Sukses Off.');
    return;
  }

  // Cek apakah fitur diaktifkan untuk pengguna ini
  if (!conn.download[m.sender] || !conn.download[m.sender].aktif) return;

  const instagramRegex = /https:\/\/www\.instagram\.com\/(?:p|reel|tv)\/[a-zA-Z0-9_-]+\/?/g;
  const tiktokRegex = /https:\/\/(www\.)?(vm|vt|www)?\.tiktok\.com\/[\w.-]+/g;
  const facebookRegex = /https:\/\/www\.facebook\.com\/(?:[^\/\s]+\/)?videos\/\d+/g;
  const shareLinkRegex = /https:\/\/www\.facebook\.com\/share\/v\/[A-Za-z0-9_]+/g;

  const matches = m.text.trim().match(instagramRegex) || m.text.trim().match(tiktokRegex) || m.text.trim().match(facebookRegex) || m.text.trim().match(shareLinkRegex);

  if (!matches) return false;

  try {
    if (matches[0].match(instagramRegex)) {
      const media = await getInstagramMedia(matches[0]);
      if (!media) {
        return conn.reply(m.chat, 'Failed to fetch media. Please try again later.', m);
      }
      let caption = `*Downloader Instagram*`;
      await conn.sendFile(m.chat, media.downloadLink, "", caption, m);
    } else if (matches[0].match(tiktokRegex)) {
      const url = matches[0];
      let data = await tiktok(url);
      if (data.result && data.result.play) {
        const caption = `*Downloader TikTok*`;
        await conn.sendFile(m.chat, data.result.play, 'tiktok_video.mp4', data.result.title, m);
      } else {
        const imgUrls = await getSlideImages(url);
        if (imgUrls.length > 0) {
          m.reply('Tunggu sebentar...');
          for (let imgUrl of imgUrls) {
            await conn.sendFile(m.chat, imgUrl, '', '', m);
          }
        } else {
          conn.reply(m.chat, 'Failed to fetch images. Please try again later.', m);
        }
      }
    } else if (matches[0].match(facebookRegex) || matches[0].match(shareLinkRegex)) {
      const media = await FbDownload(matches[0]);
      if (!media || !media.links || !media.links["Download High Quality"]) {
        return conn.reply(m.chat, 'Failed to fetch video link. Please try again later.', m);
      }
      const caption = `*Downloader Facebook*\n\nVideo downloaded successfully.`;
      await conn.sendFile(m.chat, media.links["Download High Quality"], 'fb_video.mp4', caption, m);
    }
  } catch (e) {
    console.error('Error processing media:', e);
    return conn.reply(m.chat, 'An error occurred. Please try again later.', m);
  }
}

async function getInstagramMedia(url) {
  const apiUrl = 'https://v3.igdownloader.app/api/ajaxSearch';
  const data = new URLSearchParams({
    recaptchaToken: '',
    q: url,
    t: 'media',
    lang: 'en'
  }).toString();
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Accept': '*/*'
  };
  try {
    const response = await axios.post(apiUrl, data, { headers });
    const html = response.data.data;
    const $ = cheerio.load(html);
    const thumbnailUrl = $('.download-items__thumb img').attr('src');
    const downloadLink = $('.download-items__btn a').attr('href');
    return { thumbnailUrl, downloadLink };
  } catch (error) {
    console.error('Error fetching Instagram media:', error);
    return null;
  }
}

async function getSlideImages(url) {
  try {
    let response = await axios.get(`https://dlpanda.com/id?url=${url}&token=G7eRpMaa`);
    const html = response.data;
    const $ = cheerio.load(html);
    let imgSrc = [];
    $('div.col-md-12 > img').each((index, element) => {
      imgSrc.push($(element).attr('src'));
    });
    return imgSrc;
  } catch (error) {
    console.error('Error fetching slide images:', error);
    return [];
  }
}

async function FbDownload(vid_url) {
  try {
    const data = {
      url: vid_url
    };
    const searchParams = new URLSearchParams();
    searchParams.append('url', data.url);
    const response = await axios.post('https://facebook-video-downloader.fly.dev/app/main.php', searchParams.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const responseData = response.data;
    return responseData;
  } catch (error) {
    console.error('Error fetching Facebook video:', error);
    return null;
  }
}

module.exports = {
  before,
};