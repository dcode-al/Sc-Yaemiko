const axios = require('axios');

class Ytdl {
    constructor() {
        this.baseUrl = 'https://id-y2mate.com';
    }

    async search(url) {
        const requestData = new URLSearchParams({
            k_query: url,
            k_page: 'home',
            hl: '',
            q_auto: '0'
        });

        const requestHeaders = {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Accept': '*/*',
            'X-Requested-With': 'XMLHttpRequest'
        };

        try {
            const response = await axios.post(`${this.baseUrl}/mates/analyzeV2/ajax`, requestData, {
                headers: requestHeaders
            });

            return response.data;
        } catch (error) {
            if (error.response) {
                console.error(`HTTP error! status: ${error.response.status}`);
            } else {
                console.error('Axios error: ', error.message);
            }
            throw error;
        }
    }

    async convert(videoId, key) {
        const requestData = new URLSearchParams({
            vid: videoId,
            k: key
        });

        const requestHeaders = {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Accept': '*/*',
            'X-Requested-With': 'XMLHttpRequest',
            'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36',
            'Referer': `${this.baseUrl}/youtube/${videoId}`
        };

        try {
            const response = await axios.post(`${this.baseUrl}/mates/convertV2/index`, requestData, {
                headers: requestHeaders
            });

            return response.data;
        } catch (error) {
            if (error.response) {
                console.error(`HTTP error! status: ${error.response.status}`);
            } else {
                console.error('Axios error: ', error.message);
            }
            throw error;
        }
    }

    async play(url) {
        const { links, vid, title } = await this.search(url);
        const videoPromises = Object.values(links.mp4).map(input =>
            this.convert(vid, input.k).then(({ fquality, dlink }) => ({
                quality: fquality,
                data: {
                    creator: 'Indra Code Furina',
                    size: input.q,
                    url: dlink
                }
            }))
        );
        const audioPromises = Object.values(links.mp3).map(input =>
            this.convert(vid, input.k).then(({ fquality, dlink }) => ({
                quality: fquality,
                data: {
                    creator: 'Indra Code Furina',
                    size: input.q,
                    url: dlink
                }
            }))
        );

        const videoResults = await Promise.all(videoPromises);
        const audioResults = await Promise.all(audioPromises);

        const video = videoResults.reduce((acc, { quality, data }) => {
            acc[quality] = data;
            return acc;
        }, {});

        const audio = audioResults.reduce((acc, { quality, data }) => {
            acc[quality] = data;
            return acc;
        }, {});

        return { title, video, audio };
    }
}

async function y2mate(link) {
    const ytdl = new Ytdl();
    const result = await ytdl.play(link);
    return result;
}

module.exports = { y2mate };