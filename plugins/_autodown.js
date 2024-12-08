const axios = require("axios");
const cheerio = require("cheerio");
const qs = require("qs");
const fetch = require("node-fetch");

async function before(m) {
    const fbRegex = /^https?:\/\/(?:www\.)?facebook\.com\/?.*$/;
    const igRegex = /(https?:\/\/(?:www\.)?instagram\.[a-z\.]{2,6}\/[\w\-\.]+(\/[^\s]*)?)/g;
    const tiktokRegex = /(http(?:s)?:\/\/)?(?:www\.)?(?:tiktok\.com\/@[^\/]+\/video\/(\d+))|(http(?:s)?:\/\/)?vm\.tiktok\.com\/([^\s&]+)|(http(?:s)?:\/\/)?vt\.tiktok\.com\/([^\s&]+)/g;
    const twitRegex = /https:\/\/twitter\.com\/[^/]+\/status\/(\d+)/;
    let user = db.data.users[m.sender];
    let chat = db.data.chats[m.chat];

    const containsLink = (text) => {
        return fbRegex.test(text) || igRegex.test(text) || tiktokRegex.test(text) || twitRegex.test(text);
    };

    if (!chat.autodl) return false;
    if (containsLink(m.text) && (!user.limit || user.limit === 0)) {
        await m.reply("Limit kamu habis");
        return;
    }

    try {
        const sendFile = async (url, caption) => {
            if (m.isGroup) {
                await conn.sendFile(m.chat, url, '', caption, m);
            } else {
                await conn.sendFile(m.sender, url, '', caption, m);
            }
        };

        if (m.text.trim().match(fbRegex)) {
            user.limit -= 1;
            const fbUrl = m.text.trim().match(fbRegex)[0];
            const { description, urls } = await facebook(fbUrl);
            if (urls.length > 0) {
                await sendFile(urls[0].url, description);
            }
        } else if (m.text.trim().match(igRegex)) {
            user.limit -= 1;
            const igUrl = m.text.match(igRegex)[0];
            const { data } = await axios.get(`https://apisku-furina.vercel.app/api/download/ig?url=${encodeURIComponent(igUrl)}&apikey=indradev`);
            
            if (data.status === 200) {
                const media = data.data[0];
                if (media.url) {
                    await sendFile(media.url, "Done");
                } else {
                    await m.reply("No media found.");
                }
            } else {
                await m.reply("Failed to fetch Instagram data.");
            }
        } else if (m.text.trim().match(twitRegex)) {
            user.limit -= 1;
            const twitUrl = m.text.trim().match(twitRegex)[0];
            const { data: ress } = await twitter(twitUrl);
            if (ress.length > 0) {
                await sendFile(ress[0].url, "Done");
            }
        } else if (m.text.match(tiktokRegex)) {
            user.limit -= 1;
            const tiktokUrl = m.text.trim().match(tiktokRegex)[0];
            const { download, stats, uniqueId, username } = await slide(tiktokUrl);
            let hasil = Object.values(download).filter(v => v.type == "slide");
            if (hasil.length === 0) {
                await sendFile(download[0].link, `Done`);
            } else {
                for (let i of hasil) {
                    await sendFile(i.link, `Done`);
                }
            }
        }
    } catch (e) {
        console.error(e);
        throw e;
    }
}

module.exports = { before, disabled: false };

async function twitter(url) {
    return new Promise((resolve, reject) => {
        let params = new URLSearchParams();
        params.append('URL', url);
        fetch('https://twdown.net/download.php', { method: 'POST', body: params })
            .then(res => res.text())
            .then(res => {
                const $ = cheerio.load(res);
                let data = [];
                $('div.container').find('tbody > tr > td').each(function (index, element) {
                    let x = $(this).find('a').attr('href');
                    if (x !== '#') {
                        if (typeof x !== 'undefined') {
                            data.push({ url: x });
                        }
                    }
                });
                if (data.length == 0) return resolve({ status: false });
                resolve({ status: true, data });
            }).catch(reject);
    });
}

async function facebook(url) {
    try {
        let { data } = await axios.post("https://getmyfb.com/process", qs.stringify({
            "id": url,
            locale: "en"
        }), {
            headers: {
                "Accept": "*/*",
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "Cookie": `PHPSESSID=k3eqo1f3rsq8fld57fgs9ck0q9; _token=1AHD0rRsiBSwwh7ypRad; __cflb=04dToeZfC9vebXjRcJCMjjSQh5PprejvCpooJf5xhb; _ga=GA1.2.193364307.1690654540; _gid=GA1.2.326360651.1690654544; _gat_UA-3524196-5=1; _ga_96G5RB4BBD=GS1.1.1690654539.1.0.1690654555.0.0.0`,
                "Origin": "https://getmyfb.com",
                "Referer": "https://getmyfb.com/",
                "Hx-Current-Url": "https://getmyfb.com",
                "Hx-Request": true,
                "Hx-Target": "target",
                "Hx-Trigger": "form",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36 Edg/115.0.1901.188"
            }
        });

        let $ = cheerio.load(data);
        let urls = [];

        $("ul > li").map((a, b) => {
            urls.push({ quality: $(b).text().trim(), url: $(b).find("a").attr("href") });
        });

        let result = {
            description: $("div.results-item > div.results-item-text").text().trim(),
            urls
        };

        if (urls.length === 0) return $("h4").text();

        return result;
    } catch (e) {
        throw e;
    }
}

async function slide(url) {
    try {
        const response = await axios.post(
            'https://ttsave.app/download',
            {
                query: url, language_id: '2'
            },
            {
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            }
        );

        const html = response.data;
        const $ = cheerio.load(html);

        const uniqueId = $('#unique-id').val();
        const username = $('h2.font-extrabold.text-xl.text-center').text();
        const thumbnail = $('a[target="_blank"]').attr('href');
        const profile = $('img.h-24.w-34.rounded-full').attr('src');
        const description = $('p.text-gray-600.px-2.text-center.break-all.w-3/4.oneliner').text();

        const stats = {
            views: $('svg.h-5.w-5.text-gray-500 + span').text(),
            likes: $('svg.h-5.w-5.text-red-500 + span').text(),
            comments: $('svg.h-5.w-5.text-green-500 + span').text(),
            shares: $('svg.h-5.w-5.text-yellow-500 + span').text(),
            downloads: $('svg.h-5.w-5.text-blue-500 + span').text()
        };

        const download = [];
        $('a[onclick="bdl(this, event)"]').each((i, elem) => {
            const link = $(elem).attr('href');
            const type = $(elem).attr('type');
            const title = $(elem).text().trim();
            download.push({
                link, type, title
            });
        });

        return {
            uniqueId,
            username,
            thumbnail,
            profile,
            description,
            stats,
            download
        };
    } catch (error) {
        console.error(error);
        throw error;
    }
}