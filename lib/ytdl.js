/**
kode Nemu
ytdl
**/

const yts = require("yt-search");
const axios = require("axios");

const getVideoId = (url) => {
  const videoIdPattern = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/[^\/\n\s]+\/|(?:v|e(?:mbed)?)\/|[^v\r\n\s]+?\/|user\/[^\/\n\s]+|embed\/|videoseries\?list=)|(?:youtu\.)?be(?:\.com)?\/(?:watch\?v=|v\/|u\/\w\/|embed\/|watch\?v%3Dd%2026|watch\?v-|-+|watch\/|-+|v=)?)((\w|-){11}).*/;
  const match = url.match(videoIdPattern);
  if (match) {
    return match[1]; 
  }
  throw new Error("Invalid YouTube URL");
};

const formatNumber = (number) => {
  return new Intl.NumberFormat().format(number); // Memformat angka menggunakan format lokal
};

const Ytdl = {
  search: async (query) => {
    try {
      const results = (await yts(query)).videos;
      return {
        status: true,
        data: results.map((video) => ({
          title: video.title,
          url: "https://youtu.be/" + video.videoId,
          img: video.image,
          author: {
            name: video.author.name,
            url: video.author.url,
          },
        })),
      };
    } catch (error) {
      return {
        status: false,
        msg: "Data tidak dapat ditemukan!", // Pesan kesalahan
        err: error.message,
      };
    }
  },

  mp3: async (url) => {
    try {
      const videoUrl = (await yts(getVideoId(url))).videos[0].url; // Mendapatkan URL video berdasarkan ID
      const { data: mediaData } = await axios.post("https://api.cobalt.tools/api/json", {
        url: videoUrl,
        filenamePattern: "basic",
        asFormat: "opus",
        isAudioOnly: true,
      }, {
        headers: {
          Accept: "application/json",
          origin: "https://cobalt.tools",
          referer: "https://cobalt.tools/",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, seperti Gecko) Chrome/128.0.0.0 Safari/537.36",
        }
      });

      const videoData = (await yts("https://youtu.be/" + getVideoId(url))).videos[0];
      const authorData = (await yts(videoData.author.name)).channels[0];

      return {
        status: true,
        msg: "Success Download Content!",
        title: videoData.title || new Date().toISOString(),
        metadata: {
          id: videoData.videoId,
          duration: videoData.timestamp,
          thumbnail: videoData.image,
          views: formatNumber(videoData.views),
          description: videoData.description,
        },
        author: {
          name: authorData.name,
          url: authorData.url,
          bio: authorData.about,
          avatar: authorData.image,
          subscriber: formatNumber(authorData.subCount),
        },
        url: "https://youtu.be/" + getVideoId(url),
        media: mediaData.url,
      };
    } catch (error) {
      return {
        status: false,
        msg: "Gagal saat mengambil data!", // Pesan kesalahan
        err: error.message,
      };
    }
  },

  mp4: async (url) => {
    try {
      const videoUrl = (await yts(getVideoId(url))).videos[0].url;
      const { data: mediaData } = await axios.post("https://api.cobalt.tools/api/json", {
        url: videoUrl,
        filenamePattern: "basic",
      }, {
        headers: {
          Accept: "application/json",
          origin: "https://cobalt.tools",
          referer: "https://cobalt.tools/",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, seperti Gecko) Chrome/128.0.0.0 Safari/537.36",
        }
      });

      const videoData = (await yts("https://youtu.be/" + getVideoId(url))).videos[0];
      const authorData = (await yts(videoData.author.name)).channels[0];

      return {
        status: true,
        msg: "Success Download Content!",
        title: videoData.title,
        metadata: {
          id: videoData.videoId,
          duration: videoData.timestamp,
          thumbnail: videoData.image,
          views: formatNumber(videoData.views),
          description: videoData.description,
        },
        author: {
          name: authorData.name,
          url: authorData.url,
          bio: authorData.about,
          avatar: authorData.image,
          subscriber: formatNumber(authorData.subCount),
        },
        url: "https://youtu.be/" + getVideoId(url),
        media: mediaData.url,
      };
    } catch (error) {
      return {
        status: false,
        msg: "Gagal saat mengambil data!",
        err: error.message,
      };
    }
  }
};

module.exports = Ytdl;