const { Function: Func, Scraper } = new(require('@neoxr/wb'))
const axios = require('axios')
const cheerio = require('cheerio')
const fetch = require('node-fetch');
const got = require('got')
const { JSDOM } = require('jsdom')
const path = require('path');
const jimp = require('jimp');
const FormData = require("form-data");
const WebSocket = require("ws")
const { G4F } = require("g4f")
const g4f = new G4F()
const moment = require('moment-timezone')
const googlekey = "AIzaSyDlVL56PsGBi0Re5eZYTc0FWbYe2I5K6fY"
const qs = require("qs");
const domain = "https://ssscapcut.com/";
const BASE_URL = "https://api.genius.com";
const ACCESS_TOKEN = "5A3jmNtHiCmWSmKZYfoM_T5seFaHnZiTwzIxCsHJqF7JXauBIDLocGmo9wFFzLNX";
const { Prodia } = require("prodia.js");
const { generateImage, transform, generateImageSDXL, faceSwap } = Prodia("4fe25ce7-f286-43f3-a4f7-315bd7752e72");
const headers = {
  Authorization: "Bearer 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",
};
const queryModel = async (data, model) => {
  try {
    const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
      headers,
      method: "POST",
      body: JSON.stringify(data),
    });
    return await response.arrayBuffer();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const generated = async (caption, model) => {
  try {
    const imageBytes = await queryModel({ inputs: caption }, model);
    return Buffer.from(imageBytes);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

Scraper.animeBatch = async(q) => {
    try {
        const html = await axios.get(`https://www.animebatch.id/?s=${q}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0.1; SM-J500G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Mobile Safari/537.36',
            },
        });
        const $ = cheerio.load(html.data);
        const data = $('div.animepost').map((i, e) => ({
            title: $(e).find('div.title').text().trim(),
            score: $(e).find('div.score').text().trim(),
            type: $(e).find('div.type').text().trim() || '–',
            url: $(e).find('a').attr('href'),
        })).get();

        if (data.length === 0) {
            return {
                creator: global.creator,
                status: false,
            };
        }

        return {
            creator: global.creator,
            status: true,
            data,
        };
    } catch (e) {
        return {
            creator: global.creator,
            status: false,
            msg: e.message,
        };
    }
}

Scraper.animedDetail = async(url) => {
    try {
        const html = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0.1; SM-J500G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Mobile Safari/537.36',
            },
        });
        const $ = cheerio.load(html.data);
        const genre = $($('div.spe').find('span')[9])
            .find('a')
            .map((i, e) => $(e).text().trim())
            .get();

        const h1 = $('div.download-content').find('h1').map((i, e) => $(e).text()).get();
        const h4 = $('div.download-content').find('h4').map((i, e) => $(e).text()).get();

        let link = [];
        let ind = $('div.download-content ul').map((i, e) => {
            const quality = $(e).text().split(' ')[0].trim();
            const url = $(e).find('li a').map((b, c) => ({
                server: $(c).text().trim(),
                url: $(c).attr('href'),
            })).get();
            link.push({
                index: i,
                quality: quality,
                url,
            });
        }).get();

        let episode = [];

        $('div.download-content').find('h4').each((i, h4) => {
            const fileType = $(h4).text().trim(); 
            
            const links = link.filter(link => link.index === i).map(link => ({
                index: link.index,
                quality: link.quality,
                url: link.url,
            }));

            episode.push({
                episode: fileType,
                link: links,
            });
        });

        if (episode.length === 0) {
            $('div.dlx')
                .find('h4')
                .each((i, e) => {
                    h4.push($(e).text());

                    $('div.dlx')
                        .find('ul')
                        .each((j, ul) => {
                            if (j === i) {
                                const url = $(ul)
                                    .find('li a')
                                    .map((b, c) => ({
                                        server: $(c).text().trim(),
                                        url: $(c).attr('href'),
                                    })).get();

                                link.push({
                                    index: j,
                                    quality: $(ul).text().split(' ')[0].trim(),
                                    url,
                                });

                                episode.push({
                                    episode: h4[i],
                                    link: link.filter(v => v.index === i).filter(v => v.url.length !== 0),
                                });
                            }
                        });
                });
        }

        return {
            creator: global.creator,
            status: true,
            data: {
                thumbnail: $('img.attachment-post-thumbnail').attr('src'),
                title: $('h1.entry-title').text().trim(),
                status: $($('div.spe').find('span')[3]).text().replace('Status Anime', '').trim(),
                type: $($('div.spe').find('span')[2]).text().replace('Tipe Anime', '').trim(),
                release: $($('div.spe').find('span')[6]).text().replace('Tanggal Rilis', '').trim(),
                studio: $($('div.spe').find('span')[7]).text().replace('Studio', '').trim(),
                duration: $($('div.spe').find('span')[8]).text().replace('Durasi per Episode', '').trim(),
                genre: genre.join(', ').trim(),
                score: $($('div.spe').find('span')[10]).text().replace('Skor', '').trim(),
                views: $($('div.spe').find('span')[11]).text().replace(new RegExp('Dilihat', 'g'), '').trim(),
                description: $('div.downman').text().trim(),
                episode,
            },
        };
    } catch (e) {
        return {
            creator: global.creator,
            status: false,
            msg: e.message,
        };
    }
}

Scraper.apk = async(args) => {
  const res = await fetch(`http://ws75.aptoide.com/api/7/apps/search?query=${encodeURIComponent(args)}&limit=1000`);
  const data = await res.json();
  return data.datalist.list.map(v => ({
    name: v.name,
    id: v.package,
  }));
}
Scraper.apkdl = async(id) => {
  const res = await fetch(`http://ws75.aptoide.com/api/7/apps/search?query=${encodeURIComponent(id)}&limit=1`);
  const data = await res.json();
  const appData = data.datalist.list[0];
  return {
    img: appData?.icon,
    developer: appData?.store.name,
    appname: appData?.name,
    link: appData?.file.path,
  };
}

Scraper.pindl = async(e) => {
    try {
        const response = await axios.get("https://www.savepin.app/download.php?url=" + encodeURIComponent(e) + "&lang=en&type=redirect");
        const html = response.data;
        const videoUrl = cheerio.load(html)('td.video-quality:contains("1080p")').next().next().find("a").attr("href");
        const fullUrl = `https://www.savepin.app/${videoUrl}`;
        
        const type = fullUrl.match(/\.(mp4|jpg|gif)$/)?.[1];
        
        return {
            url: fullUrl,
            type: type === 'mp4' ? 'mp4' : type === 'jpg' ? 'jpg' : 'gif'
        };
    } catch (error) {
        throw error;
    }
}
Scraper.sdxl = async (caption) => await generated(caption, "stabilityai/stable-diffusion-xl-base-1.0");

Scraper.cosmix = async (caption) => await generated(caption, "ZachX/comics_SDXL_lora");

Scraper.trained = async (caption, hfkey, hfurl) => {
  try {
    const response = await axios.post(hfurl, { inputs: caption }, {
      headers: { Authorization: `Bearer ${hfkey}` },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

Scraper.animagen = async (caption) => await generated(caption, "cagliostrolab/animagine-xl-3.1");

Scraper.mixtral = async (input) => {
  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1',
      { inputs: input },
      { headers: { 'Content-Type': 'application/json', Authorization: headers.Authorization } }
    );
    return response.data[0].generated_text;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
const someincludes = (data, id) => {
    let res = data.find(el => id.includes(el))
    return res ? true : false;
}

Scraper.igstalk = async (profileLink, cnt) => {
    const url = `https://dumpoir.com/v/${profileLink}`;
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const profileImage = $('div.avatar img').attr('src');
    const username = $('h1').text().trim();
    const name = $('h2').text().trim();
    const bio = $('div.text-sm.font-serif').text().trim();
    const postsCount = parseInt($('.stat-value.text-primary').text().trim(), 10) || 0
    const followers = parseInt($('div.stat-value.text-secondary').eq(0).text().trim(), 10);
    const following = parseInt($('div.stat-value').eq(2).text().trim())

    return {
        creator: 'Furina - Indra Code',
        status: true,
        data: {
            profile_image: profileImage,
            username: username,
            name: name,
            bio: bio,
            followers: followers,
            following: following,
            posts_count: postsCount
        }
    };
}


Scraper.whisper = async (data) => {
  const response = await fetch("https://api-inference.huggingface.co/models/openai/whisper-large-v3", {
    headers,
    method: "POST",
    body: data,
  });
  const result = await response.json();
  return result;
}
Scraper.emiXL = async (input) => {
   return new Promise(async resolve => {
   
axios.post('https://nexra.aryahcr.cc/api/image/complements', {
    prompt: input,
    model: "emi"
}, {
    headers: {
        'Content-Type': 'application/json'
    }
}).then(response => {
    let err = null;
    let result = null;

    if((typeof response.data).toString().toLowerCase() === "Object".toLowerCase()){
        if(response.data.code != undefined && response.data.code != null && response.data.code === 200 && response.data.status != undefined && response.data.status != null && response.data.status === true){
            result = response.data;
            err = null;
        } else {
            result = null;
            err = response.data;
        }
    } else {
        let js = null;
        let count = -1;
        for(let i = 0; i < response.data.length; i++){
            if(count <= -1){
                if(response.data[i] === "{"){
                    count = i;
                }
            } else {
                break;
            }
        }

        if(count <= -1){
            err = {
                "code": 500,
                "status": false,
                "error": "INTERNAL_SERVER_ERROR",
                "message": "general (unknown) error"
            };
            result = null;
        } else {
            try {
                js = response.data.slice(count);
                js = JSON.parse(js);
                if(js != undefined && js != null && js.code != undefined && js.code != null && js.code === 200 && js.status != undefined && js.status != null && js.status === true){
                    result = js;
                    err = null;
                } else {
                    err = js;
                    result = null;
                }
            } catch(e){
                err = {
                    "code": 500,
                    "status": false,
                    "error": "INTERNAL_SERVER_ERROR",
                    "message": "general (unknown) error"
                };
                result = null;
            }
        }
    }

    if(result === null && err != null){
        console.log(err);
        resolve(err)
    } else {
        const image = result.images[0] 
        const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
        const imageBuffer = Buffer.from(base64Data, 'base64');
 
        resolve(imageBuffer)
        console.log(imageBuffer)
    }
}).catch(error => {
    console.error('Error:', error);
});

})
}
Scraper.carbon = async(input) => {
  let Blobs = await fetch("https://carbonara.solopov.dev/api/cook", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "code": input
    })
  }).then(response => response.blob())
  let arrayBuffer = await Blobs.arrayBuffer();
  let buffer = Buffer.from(arrayBuffer);
  return buffer
}

Scraper.chord = async(query) => {
  return new Promise(async(resolve, reject) => {
   const head = {"User-Agent":"Mozilla/5.0 (Linux; Android 9; CPH1923) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.62 Mobile Safari/537.36",
	  "Cookie":"__gads=ID=4513c7600f23e1b2-22b06ccbebcc00d1:T=1635371139:RT=1635371139:S=ALNI_MYShBeii6AFkeysWDKiD3RyJ1106Q; _ga=GA1.2.409783375.1635371138; _gid=GA1.2.1157186793.1635371140; _fbp=fb.1.1635371147163.1785445876"};
  let { data } = await axios.get("http://app.chordindonesia.com/?json=get_search_results&exclude=date,modified,attachments,comment_count,comment_status,thumbnail,thumbnail_images,author,excerpt,content,categories,tags,comments,custom_fields&search="+query, {headers: head});
	axios.get("http://app.chordindonesia.com/?json=get_post&id="+data.posts[0].id, {
	  headers: head
	}).then(anu => {
	  let $ = cheerio.load(anu.data.post.content);
	  resolve({
	    title: $("img").attr("alt"),
	    chord: $("pre").text().trim()
	  });
	}).catch(reject);
});
}

Scraper.bard = async(query) => {
  const COOKIE_KEY = "fgg7UYYwis5OvPgxNYcRGUdHBcFcgN8CSm6_EoykSi5Yd3j30apBYKRdQ9ftCbpm5ClI6g.";
  const psidCookie = '__Secure-1PSID=' + COOKIE_KEY;
  const headers = {
    "Host": "bard.google.com",
    "X-Same-Domain": "1",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36",
    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    "Origin": "https://bard.google.com",
    "Referer": "https://bard.google.com",
    'Cookie': psidCookie
  };

  const bardRes = await fetch("https://bard.google.com/", { method: 'get', headers });
  const bardText = await bardRes.text();

  const [snlM0e, blValue] = [bardText.match(/"SNlM0e":"(.*?)"/)?.[1], bardText.match(/"cfb2h":"(.*?)"/)?.[1]];

  const bodyData = `f.req=[null,"[[\\"${encodeURIComponent(query)}\\"],null,[\\"\\",\\"\\",\\"\\"]]\"]&at=${snlM0e}`;
  const response = await fetch(`https://bard.google.com/_/BardChatUi/data/assistant.lamda.BardFrontendService/StreamGenerate?bl=${blValue}&_reqid=229189&rt=c`, { method: 'post', headers, body: bodyData });
  const answer = JSON.parse(JSON.parse((await response.text()).split("\n").reduce((a, b) => (a.length > b.length ? a : b), ""))[0][2])[4][0][1];

  return answer;
};

Scraper.githubstalk = async(user) => {
    return new Promise((resolve, reject) => {
        axios.get('https://api.github.com/users/'+user)
        .then(({ data }) => {
            let hasil = {
                username: data.login,
                nickname: data.name,
                bio: data.bio,
                id: data.id,
                nodeId: data.node_id,
                profile_pic: data.avatar_url,
                url: data.html_url,
                type: data.type,
                admin: data.site_admin,
                company: data.company,
                blog: data.blog,
                location: data.location,
                email: data.email,
                public_repo: data.public_repos,
                public_gists: data.public_gists,
                followers: data.followers,
                following: data.following,
                ceated_at: data.created_at,
                updated_at: data.updated_at
            }
            resolve(hasil)
        })
    })
}
Scraper.gdrive = async(url) => {
    let id, res = {
        "error": true
    }
    if (!(url && url.match(/drive\.google/i))) return res
    try {
        id = (url.match(/\/?id=(.+)/i) || url.match(/\/d\/(.*?)\//))[1]
        if (!id) throw 'ID Not Found'
        res = await fetch(`https://drive.google.com/uc?id=${id}&authuser=0&export=download`, {
            method: 'post',
            headers: {
                'accept-encoding': 'gzip, deflate, br',
                'content-length': 0,
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                'origin': 'https://drive.google.com',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
                'x-client-data': 'CKG1yQEIkbbJAQiitskBCMS2yQEIqZ3KAQioo8oBGLeYygE=',
                'x-drive-first-party': 'DriveWebUi',
                'x-json-requested': 'true'
            }
        })
        let {
            fileName,
            sizeBytes,
            downloadUrl
        } = JSON.parse((await res.text()).slice(4))
        if (!downloadUrl) throw 'Link Download Limit!'
        let data = await fetch(downloadUrl)
        if (data.status !== 200) return data.statusText
        return {
            downloadUrl,
            fileName,
            fileSize: Func.formatSize(sizeBytes),
            mimetype: data.headers.get('content-type')
        }
    } catch (e) {
        console.log(e)
        return res
    }
}

class Spotify {
   spotifyCreds = () => {
      return new Promise(async resolve => {
         try {
            const json = await (await axios.post('https://accounts.spotify.com/api/token', 'grant_type=client_credentials', {
               headers: {
                  Authorization: 'Basic ' + Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')
               }
            })).data
            if (!json.access_token) return resolve({
               creator: global.creator,
               status: false,
               msg: 'Can\'t generate token!'
            })
            resolve({
               creator: global.creator,
               status: true,
               data: json
            })
         } catch (e) {
            resolve({
               creator: global.creator,
               status: false,
               msg: e.message
            })
         }
      })
   }

   convert = ms => {
      var minutes = Math.floor(ms / 60000)
      var seconds = ((ms % 60000) / 1000).toFixed(0)
      return minutes + ':' + (seconds < 10 ? '0' : '') + seconds
   }

   getTask = async (str) => {
      return new Promise(async resolve => {
         try {
            const parse = await (await axios.get('https://ytmp3api.net/iframe/?color=green&vid=48MUdbh6B0w'))
            const $ = cheerio.load(parse.data)
            const p = {
               hash: $('input[name="hash"]').attr('value'),
               color: 'green'
            }
            let form = new FormData
            form.append('hash', p.hash)
            form.append('color', p.color)
            const html = await (await axios.post('https://ytmp3api.net/iframe/convert.php', form, {
               headers: {
                  "Accept": "*/*",
                  "User-Agent": "Mozilla/5.0 (Linux; Android 6.0.1; SM-J500G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Mobile Safari/537.36",
                  "Referrer-Policy": "strict-origin-when-cross-origin",
                  "sec-ch-ua": '"Chromium";v="107", "Not=A?Brand";v="24"',
                  "sec-ch-ua-platform": "Android",
                  "sec-fetch-dest": "empty",
                  "sec-fetch-mode": "cors",
                  "sec-fetch-site": "same-origin",
                  "x-requested-with": "XMLHttpRequest"
               }
            })).data
            const taskId = (html.split`taskId` [1].split`}` [0].replace(/[":]/g, '')).trim()
            if (!taskId) return resolve({
               creator: global.creator,
               status: false,
               msg: 'TaskId not found!'
            })
            resolve({
               creator: global.creator,
               status: true,
               data: {
                  taskId
               }
            })
         } catch (e) {
            console.log(e)
            resolve({
               creator: global.creator,
               status: false,
               msg: e.message
            })
         }
      })
   }

   getInfo = url => {
      return new Promise(async resolve => {
         try {
            const creds = await this.spotifyCreds()
            if (!creds.status) return resolve(creds)
            const json = await (await axios.get('https://api.spotify.com/v1/tracks/' + url.split('track/')[1], {
               headers: {
                  Authorization: 'Bearer ' + creds.data.access_token
               }
            })).data
            resolve({
               creator: global.creator,
               status: true,
               data: {
                  thumbnail: json.album.images[0].url,
                  title: json.artists[0].name + ' - ' + json.name,
                  artist: json.artists[0],
                  duration: this.convert(json.duration_ms),
                  preview: json.preview_url
               }
            })
         } catch (e) {
            resolve({
               creator: global.creator,
               status: false,
               msg: e.message
            })
         }
      })
   }

   search = (query, type = 'track', limit = 20) => {
      return new Promise(async resolve => {
         try {
            const creds = await this.spotifyCreds()
            if (!creds.status) return resolve(creds)
            const json = await (await axios.get('https://api.spotify.com/v1/search?query=' + query + '&type=' + type + '&offset=0&limit=' + limit, {
               headers: {
                  Authorization: 'Bearer ' + creds.data.access_token
               }
            })).data
            if (!json.tracks.items || json.tracks.items.length < 1) return resolve({
               creator: global.creator,
               status: false,
               msg: 'Music not found!'
            })
            let data = []
            json.tracks.items.map(v => data.push({
               title: v.album.artists[0].name + ' - ' + v.name,
               duration: this.convert(v.duration_ms),
               popularity: v.popularity + '%',
               preview: v.preview_url,
               url: v.external_urls.spotify
            }))
            resolve({
               creator: global.creator,
               status: true,
               data
            })
         } catch (e) {
            resolve({
               creator: global.creator,
               status: false,
               msg: e.message
            })
         }
      })
   }

   fetch = (url) => {
      return new Promise(async resolve => {
         try {
            var id = (/track/.test(url) ? url.split('track/')[1] : url.split('playlist/')[1]).trim()
            if (/playlist/.test(url)) {
               const parse = await (await axios.get('https://api.spotifydown.com/metadata/playlist/' + id, {
                  headers: {
                     'Accept': '*/*',
                     'Content-Type': 'application/x-www-form-urlencoded',
                     'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0.1; SM-J500G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Mobile Safari/537.36',
                     'Origin': 'https://spotifydown.com',
                     'Referer': 'https://spotifydown.com/',
                     'Referrer-Policy': 'strict-origin-when-cross-origin'
                  }
               })).data
               if (!parse.success) return resolve({
                  creator: global.creator,
                  status: false,
                  msg: 'Can\'t get playlist metadata!'
               })
               const json = await (await axios.get('https://api.spotifydown.com/trackList/playlist/' + id, {
                  headers: {
                     'Accept': '*/*',
                     'Content-Type': 'application/x-www-form-urlencoded',
                     'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0.1; SM-J500G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Mobile Safari/537.36',
                     'Origin': 'https://spotifydown.com',
                     'Referer': 'https://spotifydown.com/',
                     'Referrer-Policy': 'strict-origin-when-cross-origin'
                  }
               })).data
               if (!json.success || json.trackList.length < 1) return resolve({
                  creator: global.creator,
                  status: false,
                  msg: 'Failed to get playlist'
               })
               let tracks = []
               json.trackList.map(v => tracks.push({
                  cover: v.cover,
                  title: v.title,
                  artists: v.artists,
                  album: v.album,
                  url: 'https://open.spotify.com/track/' + v.id
               }))
               resolve({
                  creator: global.creator,
                  status: true,
                  data: {
                     cover: parse.cover,
                     title: parse.title
                  },
                  tracks
               })
            } else {
               const info = await this.getInfo(url)
               if (!info.status) return resolve(info)
               const json = await (await axios.get('https://api.spotifydown.com/download/' + id, {
                  headers: {
                     'Accept': '*/*',
                     'Content-Type': 'application/x-www-form-urlencoded',
                     'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0.1; SM-J500G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Mobile Safari/537.36',
                     'Origin': 'https://spotifydown.com',
                     'Referer': 'https://spotifydown.com/',
                     'Referrer-Policy': 'strict-origin-when-cross-origin'
                  }
               })).data
               if (!json.success || !json.link) return resolve({
                  creator: global.creator,
                  status: false,
                  msg: 'Failed to get file link'
               })
               resolve({
                  creator: global.creator,
                  status: true,
                  data: {
                     ...info.data,
                     url: json.link //await (await scrap.shorten(json.link)).data.url
                  }
               })
            }
         } catch (e) {
            console.log(e)
            resolve({
               creator: global.creator,
               status: false,
               msg: e.message
            })
         }
      })
   }
}
Scraper.getSpotify = async(url) => {
   const spotify = new Spotify()
   return await spotify.fetch(url)
  }
Scraper.spotify = async(q) => {
   const spotify = new Spotify()
   return await spotify.search(q)
  }
class LK21 {
   baseUrl = 'https://tv.lk21official.wiki'
   header = {
      headers: {
         'Accept': '*/*',
         'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
         'Referer': this.baseUrl,
         'Referrer-Policy': 'strict-origin-when-cross-origin',
         'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0.1; SM-J500G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Mobile Safari/537.36'
      }
   }


   search = query => {
      return new Promise(async (resolve) => {
         try {
            let html = await (await axios.get(this.baseUrl + '/search.php?s=' + query.replace(new RegExp('\s', 'g'), '+') + '#gsc.tab=0&gsc.q=marvel&gsc.page=1', this.header)).data
            let $ = cheerio.load(html)
            let data = []
            $('div.search-item').each((i, e) => {
               let p = []
               $(e).find('p').each((x, y) => p.push($(y).text()))
               data.push({
                  thumbnail: `https://123.lk21official.mom${$(e).find('img').attr('src')}`,
                  title: $(e).find('h3').text().trim(),
                  tags: p[0],
                  directors: p.some(v => /Sutradara/i.test(v)) ? p.find(v => /Sutradara/i.test(v)).split('Sutradara:')[1].trim() : 'Unknown',
                  actors: p.some(v => /Bintang/i.test(v)) ? p.find(v => /Bintang/i.test(v)).split('Bintang:')[1].trim() : 'Unknown',
                  url: 'https://tv.lk21official.wiki' + $(e).find('h3 > a').attr('href'),
                  // p
               })
            })
            if (data.length == 0) return resolve({
               creator: global.creator,
               status: false
            })
            resolve({
               creator: global.creator,
               status: true,
               data
            })
         } catch (e) {
            console.log(e)
            resolve({
               creator: global.creator,
               status: false
            })
         }
      })
   }

   setCookie = (cname, cvalue, exdays = 1) => {
      const d = new Date();
      d.setTime(d.getTime() + (exdays * 60 * 1000));
      let expires = "expires=" + d.toISOString();
      return cname + "=" + cvalue + ";" + expires + ";path=/";
   }

   extract = url => {
      return new Promise(async (resolve) => {
         try {
            const target = url.replace(new RegExp('.xyz', 'i'), '.xyz/get')
            const slug = url.split('/')[3]
            let html = await (await axios.get(target)).data
            const cookie = this.setCookie('validate', (html.match(/validate['][,](.*?)[)]/)[1]).trim().replace(new RegExp('\'', 'g'), ''))
            let result = await (await axios.post('https://dl.lk21static.xyz/verifying.php?slug=' + slug, {
            	slug
            }, { headers: { cookie }})).data
            let data = []
            let $ = cheerio.load(result)
            $('tr').each((i,e) => {
            	data.push({ 
					provider: $($(e).find('td')[0]).text(),
					url: $(e).find('a').attr('href')
				})
            })
            data.shift()
            return resolve(data)     
         } catch (e) {
            console.log(e)
            resolve({
               creator: global.creator,
               status: false
            })
         }
      })
   }

   replacer = str => {
      return str
         .replace(new RegExp('Kualitas', 'g'), 'quality')
         .replace(new RegExp('Negara', 'g'), 'country')
         .replace(new RegExp('Bintang film', 'g'), 'actors')
         .replace(new RegExp('Sutradara', 'g'), 'director')
         .replace(new RegExp('Genre', 'g'), 'genre')
         .replace(new RegExp('IMDb', 'g'), 'imdb')
         .replace(new RegExp('Diterbitkan', 'g'), 'release')
         .replace(new RegExp('Penerjemah', 'g'), 'transaltor')
         .replace(new RegExp('Oleh', 'g'), 'author')
         .replace(new RegExp('Diunggah', 'g'), 'uploaded')
         .replace(new RegExp('Durasi', 'g'), 'duration')
         .replace(new RegExp('jam', 'g'), 'hours')
         .replace(new RegExp('menit', 'g'), 'minutes')
         .replace(new RegExp('detik', 'g'), 'seconds')
   }

   fetch = url => {
      return new Promise(async (resolve) => {
         try {
            let html = await (await axios.get(url, this.header)).data
            console.log(html)
            let $ = cheerio.load(html)
            let div = [],
               stream = [],
               data = [],
               object = {}
            $('div[class="col-xs-9 content"]').find('div').each((i, e) => div.push($(e).html()))
            let thumbnail = 'https:' + $('div.col-xs-3.content-poster img').attr('src');
            div.map(v => {
               let $ = cheerio.load(v)
               if (/IMDb/i.test(v)) {
                  let h3 = []
                  $('h3').each((i, e) => h3.push($(e).text()))
                  object[this.replacer($('h2').text())] = h3[0]
               } else if (/Bintang/i.test(v)) {
                  let a = []
                  $('h3').each((i, e) => a.push($(e).find('a').text()))
                  object[this.replacer($('h2').text())] = a.join(', ')
               } else {
                  // data.push({ [$('h2').text()]: $('h3').text() })
                  object[this.replacer($('h2').text())] = this.replacer($('h3').text())
               }
            })
            $('ul#loadProviders').find('li').each((i, e) => stream.push({
               server: $(e).find('a').text(),
               quality: $(e).find('a').attr('rel') + 'p',
               url: $(e).find('a').attr('href')
            }))
            var onclickValue = $('div#download-movie a').attr('onclick');
            var urlExtract = onclickValue.match(/'(.*?)'/)[1];
            resolve({
               creator: global.creator,
               status: true,
               data: {
                  thumbnail,
                  ...object
               },
               stream,
               download: await this.extract(urlExtract)
            })
         } catch (e) {
            console.log(e)
            resolve({
               creator: global.creator,
               status: false
            })
         }
      })
   }
}

Scraper.getFilm = async(url) => {
   const lk21 = new LK21()
   return await lk21.fetch(url)
  }
Scraper.film = async(url) => {
   const lk21 = new LK21()
   return await lk21.search(url)
  }

Scraper.controlNet = async (model, module, url, prompt, scale) => {
    try {
const json = await prodia.controlNet({
        controlnet_model: model,
        controlnet_module: module,
        imageUrl: url,
        prompt: prompt,
        cfg_scale: scale
    });
    
    const result = await wait(json.job)
    return result
    } catch (e) {
        console.log(e)
      }
    }

Scraper.text2image = async (models, prompt, negative_prompt, style, steps, cfg_scale, seed, upscale, sampler, width, height) => {
return new Promise(async resolve => {
let link;
if (/3Guofeng3_v34/.test(models)) link = '3Guofeng3_v34.safetensors [50f420de]';
if (/absolutereality_V16/.test(models)) link = 'absolutereality_V16.safetensors [37db0fc3]';
if (/absolutereality_v181/.test(models)) link = 'absolutereality_v181.safetensors [3d9d4d2b]';
if (/amIReal_V41/.test(models)) link = 'amIReal_V41.safetensors [0a8a2e61]';
if (/analog-diffusion-1.0/.test(models)) link = 'analog-diffusion-1.0.ckpt [9ca13f02]';
if (/anythingv3_0-pruned/.test(models)) link = 'anythingv3_0-pruned.ckpt [2700c435]';
if (/anything-v4.5-pruned/.test(models)) link = 'anything-v4.5-pruned.ckpt [65745d25]';
if (/anythingV5_PrtRE/.test(models)) link = 'anythingV5_PrtRE.safetensors [893e49b9]';
if (/AOM3A3_orangemixs/.test(models)) link = 'AOM3A3_orangemixs.safetensors [9600da17]';
if (/blazing_drive_v10g/.test(models)) link = 'blazing_drive_v10g.safetensors [ca1c1eab]';
if (/breakdomain_I2428/.test(models)) link = 'breakdomain_I2428.safetensors [43cc7d2f]';
if (/breakdomain_M2150/.test(models)) link = 'breakdomain_M2150.safetensors [15f7afca]';
if (/cetusMix_Version35/.test(models)) link = 'cetusMix_Version35.safetensors [de2f2560]';
if (/childrensStories_v13D/.test(models)) link = 'childrensStories_v13D.safetensors [9dfaabcb]';
if (/childrensStories_v1SemiReal/.test(models)) link = 'childrensStories_v1SemiReal.safetensors [a1c56dbb]';
if (/childrensStories_v1ToonAnime/.test(models)) link = 'childrensStories_v1ToonAnime.safetensors [2ec7b88b]';
if (/Counterfeit_v30/.test(models)) link = 'Counterfeit_v30.safetensors [9e2a8f19]';
if (/cuteyukimixAdorable_midchapter3/.test(models)) link = 'cuteyukimixAdorable_midchapter3.safetensors [04bdffe6]';
if (/cyberrealistic_v33/.test(models)) link = 'cyberrealistic_v33.safetensors [82b0d085]';
if (/dalcefo_v4/.test(models)) link = 'dalcefo_v4.safetensors [425952fe]';
if (/deliberate_v2/.test(models)) link = 'deliberate_v2.safetensors [10ec4b29]';
if (/deliberate_v3/.test(models)) link = 'deliberate_v3.safetensors [afd9d2d4]';
if (/dreamlike-anime-1.0/.test(models)) link = 'dreamlike-anime-1.0.safetensors [4520e090]';
if (/dreamlike-diffusion-1.0/.test(models)) link = 'dreamlike-diffusion-1.0.safetensors [5c9fd6e0]';
if (/dreamlike-photoreal-2.0/.test(models)) link = 'dreamlike-photoreal-2.0.safetensors [fdcf65e7]';
if (/dreamshaper_6BakedVae/.test(models)) link = 'dreamshaper_6BakedVae.safetensors [114c8abb]';
if (/dreamshaper_7/.test(models)) link = 'dreamshaper_7.safetensors [5cf5ae06]';
if (/dreamshaper_8/.test(models)) link = 'dreamshaper_8.safetensors [9d40847d]';
if (/edgeOfRealism_eorV20/.test(models)) link = 'edgeOfRealism_eorV20.safetensors [3ed5de15]';
if (/EimisAnimeDiffusion_V1/.test(models)) link = 'EimisAnimeDiffusion_V1.ckpt [4f828a15]';
if (/elldreths-vivid-mix/.test(models)) link = 'elldreths-vivid-mix.safetensors [342d9d26]';
if (/epicphotogasm_xPlusPlus/.test(models)) link = 'epicphotogasm_xPlusPlus.safetensors [1a8f6d35]';
if (/epicrealism_naturalSinRC1VAE/.test(models)) link = 'epicrealism_naturalSinRC1VAE.safetensors [90a4c676]';
if (/epicrealism_pureEvolutionV3/.test(models)) link = 'epicrealism_pureEvolutionV3.safetensors [42c8440c]';
if (/ICantBelieveItsNotPhotography_seco/.test(models)) link = 'ICantBelieveItsNotPhotography_seco.safetensors [4e7a3dfd]';
if (/indigoFurryMix_v75Hybrid/.test(models)) link = 'indigoFurryMix_v75Hybrid.safetensors [91208cbb]';
if (/juggernaut_aftermath/.test(models)) link = 'juggernaut_aftermath.safetensors [5e20c455]';
if (/lofi_v4/.test(models)) link = 'lofi_v4.safetensors [ccc204d6]';
if (/lyriel_v16/.test(models)) link = 'lyriel_v16.safetensors [68fceea2]';
if (/majicmixRealistic_v4/.test(models)) link = 'majicmixRealistic_v4.safetensors [29d0de58]';
if (/mechamix_v10/.test(models)) link = 'mechamix_v10.safetensors [ee685731]';
if (/meinamix_meinaV9/.test(models)) link = 'meinamix_meinaV9.safetensors [2ec66ab0]';
if (/meinamix_meinaV11/.test(models)) link = 'meinamix_meinaV11.safetensors [b56ce717]';
if (/neverendingDream_v122/.test(models)) link = 'neverendingDream_v122.safetensors [f964ceeb]';
if (/openjourney_V4/.test(models)) link = 'openjourney_V4.ckpt [ca2f377f]';
if (/pastelMixStylizedAnime_pruned_fp16/.test(models)) link = 'pastelMixStylizedAnime_pruned_fp16.safetensors [793a26e8]';
if (/portraitplus_V1.0/.test(models)) link = 'portraitplus_V1.0.safetensors [1400e684]';
if (/protogenx34/.test(models)) link = 'protogenx34.safetensors [5896f8d5]';
if (/Realistic_Vision_V1.4-pruned-fp16/.test(models)) link = 'Realistic_Vision_V1.4-pruned-fp16.safetensors [8d21810b]';
if (/Realistic_Vision_V2.0/.test(models)) link = 'Realistic_Vision_V2.0.safetensors [79587710]';
if (/Realistic_Vision_V4.0/.test(models)) link = 'Realistic_Vision_V4.0.safetensors [29a7afaa]';
if (/Realistic_Vision_V5.0/.test(models)) link = 'Realistic_Vision_V5.0.safetensors [614d1063]';
if (/redshift_diffusion-V10/.test(models)) link = 'redshift_diffusion-V10.safetensors [1400e684]';
if (/revAnimated_v122/.test(models)) link = 'revAnimated_v122.safetensors [3f4fefd9]';
if (/rundiffusionFX25D_v10/.test(models)) link = 'rundiffusionFX25D_v10.safetensors [cd12b0ee]';
if (/rundiffusionFX_v10/.test(models)) link = 'rundiffusionFX_v10.safetensors [cd4e694d]';
if (/sdv1_4/.test(models)) link = 'sdv1_4.ckpt [7460a6fa]';
if (/v1-5-pruned-emaonly/.test(models)) link = 'v1-5-pruned-emaonly.safetensors [d7049739]';
if (/v1-5-inpainting/.test(models)) link = 'v1-5-inpainting.safetensors [21c7ab71]';
if (/shoninsBeautiful_v10/.test(models)) link = 'shoninsBeautiful_v10.safetensors [25d8c546]';
if (/theallys-mix-ii-churned/.test(models)) link = 'theallys-mix-ii-churned.safetensors [5d9225a4]';
if (/timeless-1.0/.test(models)) link = 'timeless-1.0.ckpt [7c4971d4]';
if (/toonyou_beta6/.test(models)) link = 'toonyou_beta6.safetensors [980f6b15]';
    
    try {
        const response = await generateImage({
        model: link,
        prompt: prompt,
        negative_prompt:  negative_prompt,
        style_preset: style,
        steps: steps,
        cfg_scale: cfg_scale,
        seed: seed,
        upscale: upscale,
        sampler: sampler,
        width: width,
        height: height
    })
         const result = response;
         console.log(result);
        // setTimeout(async () => {
         const genimg = await wait(result.job)
         resolve(genimg)
      //   }, 12000);
    } catch (error) {
        console.error('Error:', error);
    }
})
}

const sty = {
styles: [
    "3d-model",
    "analog-film",
    "anime",
    "cinematic",
    "comic-book",
    "digital-art",
    "enhance",
    "fantasy-art",
    "isometric",
    "line-art",
    "low-poly",
    "neon-punk",
    "origami",
    "photographic",
    "pixel-art",
    "texture",
    "craft-clay"
]}
const modelsss = {
models: [
    "3Guofeng3_v34",
    "absolutereality_V16",
    "absolutereality_v181",
    "amIReal_V41",
    "analog-diffusion-1.0",
    "anythingv3_0-pruned",
    "anything-v4.5-pruned",
    "anythingV5_PrtRE",
    "AOM3A3_orangemixs",
    "blazing_drive_v10g",
    "breakdomain_I2428",
    "breakdomain_M2150",
    "cetusMix_Version35",
    "childrensStories_v13D",
    "childrensStories_v1SemiReal",
    "childrensStories_v1ToonAnime",
    "Counterfeit_v30",
    "cuteyukimixAdorable_midchapter3",
    "cyberrealistic_v33",
    "dalcefo_v4",
    "deliberate_v2",
    "deliberate_v3",
    "dreamlike-anime-1.0",
    "dreamlike-diffusion-1.0",
    "dreamlike-photoreal-2.0",
    "dreamshaper_6BakedVae",
    "dreamshaper_7",
    "dreamshaper_8",
    "edgeOfRealism_eorV20",
    "EimisAnimeDiffusion_V1",
    "elldreths-vivid-mix",
    "epicphotogasm_xPlusPlus",
    "epicrealism_naturalSinRC1VAE",
    "epicrealism_pureEvolutionV3",
    "ICantBelieveItsNotPhotography_seco",
    "indigoFurryMix_v75Hybrid",
    "juggernaut_aftermath",
    "lofi_v4",
    "lyriel_v16",
    "majicmixRealistic_v4",
    "mechamix_v10",
    "meinamix_meinaV9",
    "meinamix_meinaV11",
    "neverendingDream_v122",
    "openjourney_V4",
    "pastelMixStylizedAnime_pruned_fp16",
    "portraitplus_V1.0",
    "protogenx34",
    "Realistic_Vision_V1.4-pruned-fp16",
    "Realistic_Vision_V2.0",
    "Realistic_Vision_V4.0",
    "Realistic_Vision_V5.0",
    "redshift_diffusion-V10",
    "revAnimated_v122",
    "rundiffusionFX25D_v10",
    "rundiffusionFX_v10",
    "sdv1_4",
    "v1-5-pruned-emaonly",
    "v1-5-inpainting",
    "shoninsBeautiful_v10",
    "theallys-mix-ii-churned",
    "timeless-1.0",
    "toonyou_beta6"
]}


async function wait(id_data) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const da = `https://images.prodia.xyz/${id_data}.png`;
            resolve(da); // resolve with the URL
        }, 12000);
    })
}

Scraper.sampler = async () => {
 return new Promise(async resolve => {
axios({
  method: 'get',
  url: 'https://api.prodia.com/v1/sd/samplers',
  headers: {
    'X-Prodia-Key': '7f6d4a3d-f3e3-4abf-ab8d-a21bb64a5ee7',
    'Accept': 'application/json',
  },
})
.then(response => {
  console.log(response.data);
  resolve(response.data)
})
.catch(error => {
  console.error(error);
})
} )
}

Scraper.model = async () => {
const mod = JSON.stringify(modelsss)
return mod
}

Scraper.style_preset = async () => {
const st = JSON.stringify(sty)
return st
}

function generateRandomLetters(length) {
  let result = ''
  const alphabetLength = 26

  for (let i = 0; i < length; i++) {
    const randomValue = Math.floor(Math.random() * alphabetLength)
    const randomLetter = String.fromCharCode('a'.charCodeAt(0) + randomValue)
    result += randomLetter
  }

  return result
}
 
  Scraper.Instrument = async (audio) => {
  return new Promise(async (resolve, reject) => {
    let result = {}
    let name = Math.floor(Math.random() * 100000000000000000) + await generateRandomLetters() + '.mp3'
    let send_has_payload = { "fn_index": 0, "session_hash": "6inywdd0rtw" }
    let send_data_payload = {
      "data": [
        {
          "data": "data:audio/mpeg;base64," + audio.toString('base64'),
          "name": name
      }
    ],
      "event_data": null,
      "fn_index": 0,
      "session_hash": "6inywdd0rtw"
    }

    const ws = new WebSocket("wss://yanzbotz-instrument.hf.space/queue/join");
    ws.onopen = function() {
      console.log("Connected to websocket")
    };

    ws.onmessage = async function(event) {
      let message = JSON.parse(event.data);

      switch (message.msg) {
        case 'send_hash':
          ws.send(JSON.stringify(send_has_payload));
          break;

        case 'estimation':
          console.log('Menunggu antrean: ️' + message.rank)
          break;

        case 'send_data':
          console.log('Processing your audio....');
          ws.send(JSON.stringify(send_data_payload));
          break;
        case 'process_completed':
          result.vocal = 'https://yanzbotz-instrument.hf.space/file=' + message.output.data[0].name
          result.instrument = 'https://yanzbotz-instrument.hf.space/file=' + message.output.data[1].name
          break;
      }
    };

    ws.onclose = function(event) {
      if (event.code === 1000) {
        console.log('Process completed️');
      } else {
        console.log('Err : WebSocket Connection Error:\n');
      }
      resolve(result)
      console.log(result)
    };
  })
}
  
Scraper.rmbg = async (url) => {
const formData = new FormData();
formData.append('size', 'auto');
formData.append('image_url', url);

const response = await axios({
  method: 'post',
  url: 'https://api.remove.bg/v1.0/removebg',
  data: formData,
  responseType: 'arraybuffer',
  headers: {
    ...formData.getHeaders(),
    'X-Api-Key': 'v95VGSCZtRmLR4pHZ4pT9AUq',
  },
  encoding: null
})
 return response.data
     }
 
Scraper.stablediff = async(prompt) => {
return new Promise(async(resolve, reject) => {
let wss = 'wss://runwayml-stable-diffusion-v1-5.hf.space/queue/join';
let result = {}
let send_has_payload = {
  "session_hash": "pmr4m7bm2x",
  "fn_index": 2
}
let send_data_payload = {
  "fn_index": 2,
  "data": [
    prompt 
  ],
  "session_hash": "pmr4m7bm2x"
}

const ws = new WebSocket(wss);
    ws.onopen = function() {
     console.log("Connected to websocket")
    };

    ws.onmessage = async function(event) {
      let message = JSON.parse(event.data);

      switch (message.msg) {
        case 'send_hash':
          ws.send(JSON.stringify(send_has_payload));
          break;

        case 'send_data':
          console.log('Processing your image....');        
          ws.send(JSON.stringify(send_data_payload));
          break;
        case 'process_completed':      
        let yanz = message.output.data[0][0].replace('data:image/jpeg;base64,', '')
         let buffer = new Buffer.from(yanz, 'base64')
          result.base64 = buffer 
          break;
      }
    };

    ws.onclose = function(event) {
      if (event.code === 1000) {
        console.log('Process completed️');
      } else {
        msg.reply('Err : WebSocket Connection Error:\n');
      }
      resolve(result)
    };
  })
}

Scraper.remini = async (urlPath) => {
	return new Promise(async (resolve, reject) => {
		let buffer,
			Form = new FormData(),
			scheme = "https" + "://" + "inferenceengine" + ".vyro" + ".ai/" + "enhance";
		Form.append("model_version", 1, {
			"Content-Transfer-Encoding": "binary",
			contentType: "multipart/form-data; charset=uttf-8",
		});
		Form.append("image", Buffer.from(urlPath), {
			filename: "enhance_image_body.jpg",
			contentType: "image/jpeg",
		});
		Form.submit(
			{
				url: scheme,
				host: "inferenceengine" + ".vyro" + ".ai",
				path: "/" + "enhance",
				protocol: "https:",
				headers: {
					"User-Agent": "okhttp/4.9.3",
					Connection: "Keep-Alive",
					"Accept-Encoding": "gzip",
				},
			},
			function (err, res) {
				if (err) reject();
				let data = [];
				res
					.on("data", function (chunk, resp) {
						data.push(chunk);
					})
					.on("end", () => {
						resolve(Buffer.concat(data));
					});
				res.on("error", (e) => {
					reject();
				});
			}
		);
	});
}

Scraper.lyric = async(query) => {
  try {
    const response = await fetch(`${BASE_URL}/search?access_token=${ACCESS_TOKEN}&q=${query}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    let result = await response.json();
    if (result.response.hits.length > 0) {
      return result.response.hits.map(hit => ({
        title: hit.result.title,
        url: hit.result.url,
        artist: hit.result.artist_names
      }));
    } else {
      throw new Error('No results found');
    }
  } catch (error) {
    console.error('Error during search:', error);
    return [];
  }
}

Scraper.getLyrics = async(url) => {
  const response = await fetch("https://files.xianqiao.wang/" + url)
  const html = await response.text()
  const $ = cheerio.load(html);
  let lyrics = '';
  $('div[class^="Lyrics__Container"]').each((i, elem) => {
    if ($(elem).text().length !== 0) {
      const snippet = $(elem).html().replace(/<br>/g, '\n').replace(/<(?!\s*br\s*\/?)[^>]+>/gi, '');
      lyrics += $('<textarea/>').html(snippet).text().trim() + '\n\n';
    }
  });
  return lyrics;
}


Scraper.krakenfiles = (url) => {
    return new Promise(async (resolve, reject) => {
      const {
        data
      } = await axios.get(url);
      const $ = cheerio.load(data);
      const fileHash = $("div.col-xl-4.col-lg-5.general-information").attr("data-file-hash", );
      const tokens = $("input[name='token']").val();
      const result = {};
      const payload = new URLSearchParams(Object.entries({
        token: tokens,
      }), );
      const {
        data: res
      } = await axios.post("https://s5.krakenfiles.com/download/" + fileHash, payload, );
      result.title = $("div.coin-info > .coin-name > h5").text().trim();
      $("div.nk-iv-wg4-sub > .nk-iv-wg4-overview.g-2 > li").each(function() {
        const param = $(this).find("div.sub-text").text().replace(/ /g, "").toLowerCase();
        const value = $(this).find("div.lead-text").text().trim();
        result[param] = value;
      });
      result.views = $("div.views-count").text().trim();
      result.downloads = $("div.lead-text.downloads-count > strong").text().trim();
      result.fileHash = fileHash;
      result.url = res.url;
      resolve(result);
    });
  };
  
Scraper.freepik = async (q) => {
    try {
        const url = `https://jp.freepik.com/photos/${q}`;
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);
        const scriptJSON = $('script[type="application/ld+json"]').html();
        const json_data = JSON.parse(scriptJSON);

        if (!json_data) {
            console.log("Gagal menemukan data JSON di halaman");
            return null;
        }

      
        const image_info = json_data['@graph'][0]['mainEntity']['itemListElement']
            .filter(item => item['@type'] === 'ImageObject')
            .map(item => ({
                name: item.name,
                imageUrl: item.contentUrl,
                datePublished: new Date(item.datePublished).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
                encodingFormat: item.encodingFormat,
                license: item.license
            }));

        return image_info;
    } catch (error) {
        console.log(`Gagal mengakses halaman: ${error}`);
        return null;
    }
}

Scraper.searchgore = async(query) => {
  return new Promise(async (resolve, reject) => {
    axios.get('https://seegore.com/?s=' + query).then(dataa => {
      const $$$ = cheerio.load(dataa)
      let pagina = $$$(
        '#main > div.container.main-container > div > div.bb-col.col-content > div > div > div > div > nav > ul > li:nth-child(4) > a'
        ).text();
      let slink = 'https://seegore.com/?s=' + query
      axios.get(slink).then(({
        data
      }) => {
        const $ = cheerio.load(data)
        const link = [];
        const judul = [];
        const uploader = [];
        const format = [];
        const thumb = [];
        $('#post-items > li > article > div.content > header > h2 > a').each(function(a, b) {
          link.push($(b).attr('href'))
        })
        $('#post-items > li > article > div.content > header > h2 > a').each(function(c, d) {
          let jud = $(d).text();
          judul.push(jud)
        })
        $('#post-items > li > article > div.content > header > div > div.bb-cat-links > a').each(
          function(e, f) {
            let upl = $(f).text();
            uploader.push(upl)
          })
        $('#post-items > li > article > div.post-thumbnail > a > div > img').each(function(g, h) {
          thumb.push($(h).attr('src'))
        })
        for (let i = 0; i < link.length; i++) {
          format.push({
            judul: judul[i],
            uploader: uploader[i],
            thumb: thumb[i],
            link: link[i]
          })
        }
        resolve(format)
      }).catch(reject)
    })
  })
}
/* New Line */
Scraper.randomgore = async() => {
  return new Promise(async (resolve, reject) => {
    let randvid = Math.floor(Math.random() * 218) + 1
    let slink = 'https://seegore.com/gore/'
    axios.get(slink).then(({
      data
    }) => {
      const $ = cheerio.load(data)
      const link = [];
      const result = [];
      const username = [];
      const linkp = $(`#post-items > li:nth-child(${randvid}) > article > div.post-thumbnail > a`).attr(
        'href')
      const thumbb = $(
        `#post-items > li:nth-child(${randvid}) > article > div.post-thumbnail > a > div > img`).attr(
        'src')
      axios.get(linkp).then(({
        data
      }) => {
        const $$ = cheerio.load(data)
        const format = {
          judul: $$(
            'div.single-main-container > div > div.bb-col.col-content > div > div > div > div > header > h1'
            ).text(),
          views: $$(
            'div.single-main-container > div > div.bb-col.col-content > div > div > div > div > div.s-post-meta-block.bb-mb-el > div > div > div.col-r.d-table-cell.col-md-6.col-sm-6.text-right-sm > div > span > span.count'
            ).text(),
          comment: $$(
            'div.single-main-container > div > div.bb-col.col-content > div > div > div > div > div.s-post-meta-block.bb-mb-el > div > div > div.col-r.d-table-cell.col-md-6.col-sm-6.text-right-sm > div > a > span.count'
            ).text() === '' ? 'Tidak ada komentar' : $$(
            'div.single-main-container > div > div.bb-col.col-content > div > div > div > div > div.s-post-meta-block.bb-mb-el > div > div > div.col-r.d-table-cell.col-md-6.col-sm-6.text-right-sm > div > a > span.count'
            ).text(),
          thumb: thumbb,
          link: $$('video > source').attr('src')
        }
        resolve(format)
      }).catch(reject)
    })
  })
}

Scraper.goredl = async(link) => {
  return new Promise(async (resolve, reject) => {
    axios.get(link).then(({
      data
    }) => {
      const $$ = cheerio.load(data)
      const format = {
        judul: $$(
          'div.single-main-container > div > div.bb-col.col-content > div > div > div > div > header > h1'
          ).text(),
        views: $$(
          'div.single-main-container > div > div.bb-col.col-content > div > div > div > div > div.s-post-meta-block.bb-mb-el > div > div > div.col-r.d-table-cell.col-md-6.col-sm-6.text-right-sm > div > span > span.count'
          ).text(),
        comment: $$(
          'div.single-main-container > div > div.bb-col.col-content > div > div > div > div > div.s-post-meta-block.bb-mb-el > div > div > div.col-r.d-table-cell.col-md-6.col-sm-6.text-right-sm > div > a > span.count'
          ).text(),
        link: $$('video > source').attr('src')
      }
      resolve(format)
    }).catch(reject)
  })
}

Scraper.drakor = async(query)  => {
    try {
        const response = await fetch('https://drakorasia.us?s=' + query + '&post_type=post');
        const html = await response.text();
        const $ = cheerio.load(html);
        const extractedData = $('#post.archive').map((index, element) => ({
            title: $(element).find('h2 a').text().trim(),
            link: $(element).find('h2 a').attr('href'),
            image: $(element).find('img').attr('src'),
            categories: $(element).find('.genrenya span[rel="tag"]').map((index, el) => $(el).text()).get(),
            year: $(element).find('.category a[rel="tag"]').text(),
            episodes: $(element).find('.category').contents().filter((index, el) => el.nodeType === 3).text().trim(),
        })).get();
        return extractedData;
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

Scraper.drakorGet = async(url) => {
    try {
        const response = await fetch(url);
        const html = await response.text();
        const $ = cheerio.load(html);
        const genres = $('.genrenya span[rel="tag"]').map((_, el) => $(el).text().trim()).get();
        const resolutions = $('thead th').filter((_, el) => $(el).text().includes('Download')).map((_, el) => $(el).text().trim().replace('Download ', '').toLowerCase()).get();
        return {
            title: $('h2 span.border-b-4').text().trim(),
            synopsis: $('#synopsis p.caps strong').text().trim(),
            rating: $('.wpd-rating-value .wpdrv').text(),
            genres,
            downloadInfo: $('#content-post table.mdl-data-table tbody tr').map((_, el) => {
                const episode = $(el).find('td:first-child').text().trim();
                const episodeInfo = Object.fromEntries(
                    resolutions.map((resolution) => {
                        const columnIndex = $('thead th:contains("Download ' + resolution + '")').index();
                        const resolutionColumn = $(el).find('td:eq(' + columnIndex + ')');
                        const downloadLinks = resolutionColumn.find('a').map((_, a) => {
                            const link = $(a).attr('href');
                            const platform = $(a).text().trim();
                            return { platform, link };
                        }).get();
                        return [resolution, downloadLinks];
                    })
                );
                return { episode, episodeInfo };
            }).get(),
        };
    } catch (error) {
        console.error('Error:', error);
        return {};
    }
}


function getFileType(url) {
    if (url.includes('.mp4')) {
        return 'mp4';
    } else if (url.includes('.jpg') || url.includes('.jpeg') || url.includes('.png')) {
        return 'jpg';
    } else if (url.includes('.gif')) {
        return 'gif';
    } else if (url.includes('.mp3') || url.includes('.wav') || url.includes('.aac') || url.includes('.flac')) {
        return 'audio';
    } else {
        return 'unknown';
    }
}

Scraper.twitter = async(link) => {
    return new Promise((resolve, reject) => {
        let config = {
            'URL': link
        };
        axios.post('https://twdown.net/download.php', qs.stringify(config), {
            headers: {
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "sec-ch-ua": '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                "cookie": "_ga=GA1.2.1388798541.1625064838; _gid=GA1.2.1351476739.1625064838; __gads=ID=7a60905ab10b2596-229566750eca0064:T=1625064837:RT=1625064837:S=ALNI_Mbg3GGC2b3oBVCUJt9UImup-j20Iw; _gat=1"
            }
        })
        .then(({ data }) => {
            const $ = cheerio.load(data);
            const hasil = [];
            
            const thumbUrl = $('div:nth-child(1) > img').attr('src');
            const hdUrl = $('tbody > tr:nth-child(1) > td:nth-child(4) > a').attr('href');
            const sdUrl = $('tr:nth-child(2) > td:nth-child(4) > a').attr('href');
            const audioUrl = 'https://twdown.net/' + $('tr:nth-child(4) > td:nth-child(4) > a').attr('href');
            
            hasil.push({
                desc: $('div:nth-child(1) > div:nth-child(2) > p').text().trim(),
                thumbUrl,
                HD: {
                    url: hdUrl,
                    type: getFileType(hdUrl)
                },
                SD: {
                    url: sdUrl,
                    type: getFileType(sdUrl)
                },
                audioUrl
            });
            resolve(hasil);
        })
        .catch(reject);
    });
}

// capcut new
function getCookies() {
  return new Promise((resolve, reject) => {
    axios
      .get("https://ssscapcut.com/")
      .then((response) => {
        const cookiesArray = response.headers["set-cookie"];
        const cookies = cookiesArray.map((cookie) => cookie.split(";")[0]); // Ambil hanya bagian yang diperlukan
        resolve(cookies);
      })
      .catch((error) => {
        console.error(error);
        reject(error);
      });
  });
}

Scraper.capcut = async(Url) => {
  return new Promise(async (resolve, reject) => {
    try {
      const isUrl = (str) => /^https?:\/\//.test(str);
      if (!isUrl(Url) || !/capcut\.com/i.test(Url))
        throw new Error("Invalid URL: " + Url);

      const cookies = await getCookies();
      const token = Url.match(/\d+/)[0];

      await axios
        .get(`https://ssscap.net/api/download/${token}`, {
          headers: {
            authority: "ssscap.net",
            accept: "application/json, text/plain, */*",
            "accept-language": "ms-MY,ms;q=0.9,en-US;q=0.8,en;q=0.7,id;q=0.6",
            cookie: cookies.join("; "),
            referer: "https://ssscap.net/",
            "sec-ch-ua": '"Not)A;Brand";v="24", "Chromium";v="116"',
            "sec-ch-ua-mobile": "?1",
            "sec-ch-ua-platform": '"Android"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "user-agent":
              "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36",
          },
        })
        .then(({ data }) => {
          resolve({
            ...updateUrls(data),
          });
        })
        .catch((error) => {
          resolve({
            status: 404,
            msg: error?.message || error,
          });
        });
    } catch (error) {
      resolve({
        status: 404,
        msg: error?.message || error,
      });
    }
  });
}

function updateUrls(obj) {
  const regex =
    /("originalVideoUrl": "| "authorUrl": "|"coverUrl": ")(\/[^"]+)/g;
  const updatedData = JSON.stringify(obj, null, 2).replace(
    regex,
    (match, p1, p2) => p1 + domain + p2,
  );
  return JSON.parse(updatedData);
}


Scraper.xnxxdl = async (URL) => {
	return new Promise((resolve, reject) => {
		fetch(`${URL}`, {method: 'get'})
		.then(res => res.text())
		.then(res => {
			let $ = cheerio.load(res, {
				xmlMode: false
			});
			const title = $('meta[property="og:title"]').attr('content');
			const duration = $('meta[property="og:duration"]').attr('content');
			const image = $('meta[property="og:image"]').attr('content');
			const videoType = $('meta[property="og:video:type"]').attr('content');
			const videoWidth = $('meta[property="og:video:width"]').attr('content');
			const videoHeight = $('meta[property="og:video:height"]').attr('content');
			const info = $('span.metadata').text();
			const videoScript = $('#video-player-bg > script:nth-child(6)').html();
			const files = {
				low: (videoScript.match('html5player.setVideoUrlLow\\(\'(.*?)\'\\);') || [])[1],
				high: videoScript.match('html5player.setVideoUrlHigh\\(\'(.*?)\'\\);' || [])[1],
				HLS: videoScript.match('html5player.setVideoHLS\\(\'(.*?)\'\\);' || [])[1],
				thumb: videoScript.match('html5player.setThumbUrl\\(\'(.*?)\'\\);' || [])[1],
				thumb69: videoScript.match('html5player.setThumbUrl169\\(\'(.*?)\'\\);' || [])[1],
				thumbSlide: videoScript.match('html5player.setThumbSlide\\(\'(.*?)\'\\);' || [])[1],
				thumbSlideBig: videoScript.match('html5player.setThumbSlideBig\\(\'(.*?)\'\\);' || [])[1],
			};
			resolve({
				result: {
					title,
					URL,
					duration,
					image,
					videoType,
					videoWidth,
					videoHeight,
					info,
					files
				}
			})
		})
		.catch(err => reject({code: 503, status: false, result: err }))
	})
}

Scraper.xnxxsearch = async (query) => {
	return new Promise((resolve, reject) => {
		const baseurl = 'https://www.xnxx.com'
		fetch(`${baseurl}/search/${query}/${Math.floor(Math.random() * 3) + 1}`, {method: 'get'})
		.then(res => res.text())
		.then(res => {
			let $ = cheerio.load(res, {
				xmlMode: false
			});
			let title = [];
			let url = [];
			let desc = [];
			let results = [];

			$('div.mozaique').each(function(a, b) {
				$(b).find('div.thumb').each(function(c, d) {
					url.push(baseurl+$(d).find('a').attr('href').replace("/THUMBNUM/", "/"))
				})
			})
			$('div.mozaique').each(function(a, b) {
				$(b).find('div.thumb-under').each(function(c, d) {
					desc.push($(d).find('p.metadata').text())
					$(d).find('a').each(function(e,f) {
					    title.push($(f).attr('title'))
					})
				})
			})
			for (let i = 0; i < title.length; i++) {
				results.push({
					title: title[i],
					info: desc[i],
					link: url[i]
				})
			}
			resolve({
				result: results
			})
		})
		.catch(err => reject({code: 503, status: false, result: err }))
	})
   }
   
   
   Scraper.pins = async (querry) => {
	return new Promise((resolve,reject) => {
		 axios.get('https://id.pinterest.com/search/pins/?autologin=true&q=' + querry, {
			headers: {
			"cookie" : "_auth=1; _b=\"AVna7S1p7l1C5I9u0+nR3YzijpvXOPc6d09SyCzO+DcwpersQH36SmGiYfymBKhZcGg=\"; _pinterest_sess=TWc9PSZHamJOZ0JobUFiSEpSN3Z4a2NsMk9wZ3gxL1NSc2k2NkFLaUw5bVY5cXR5alZHR0gxY2h2MVZDZlNQalNpUUJFRVR5L3NlYy9JZkthekp3bHo5bXFuaFZzVHJFMnkrR3lTbm56U3YvQXBBTW96VUgzVUhuK1Z4VURGKzczUi9hNHdDeTJ5Y2pBTmxhc2owZ2hkSGlDemtUSnYvVXh5dDNkaDN3TjZCTk8ycTdHRHVsOFg2b2NQWCtpOWxqeDNjNkk3cS85MkhhSklSb0hwTnZvZVFyZmJEUllwbG9UVnpCYVNTRzZxOXNJcmduOVc4aURtM3NtRFo3STlmWjJvSjlWTU5ITzg0VUg1NGhOTEZzME9SNFNhVWJRWjRJK3pGMFA4Q3UvcHBnWHdaYXZpa2FUNkx6Z3RNQjEzTFJEOHZoaHRvazc1c1UrYlRuUmdKcDg3ZEY4cjNtZlBLRTRBZjNYK0lPTXZJTzQ5dU8ybDdVS015bWJKT0tjTWYyRlBzclpiamdsNmtpeUZnRjlwVGJXUmdOMXdTUkFHRWloVjBMR0JlTE5YcmhxVHdoNzFHbDZ0YmFHZ1VLQXU1QnpkM1FqUTNMTnhYb3VKeDVGbnhNSkdkNXFSMXQybjRGL3pyZXRLR0ZTc0xHZ0JvbTJCNnAzQzE0cW1WTndIK0trY05HV1gxS09NRktadnFCSDR2YzBoWmRiUGZiWXFQNjcwWmZhaDZQRm1UbzNxc21pV1p5WDlabm1UWGQzanc1SGlrZXB1bDVDWXQvUis3elN2SVFDbm1DSVE5Z0d4YW1sa2hsSkZJb1h0MTFpck5BdDR0d0lZOW1Pa2RDVzNySWpXWmUwOUFhQmFSVUpaOFQ3WlhOQldNMkExeDIvMjZHeXdnNjdMYWdiQUhUSEFBUlhUVTdBMThRRmh1ekJMYWZ2YTJkNlg0cmFCdnU2WEpwcXlPOVZYcGNhNkZDd051S3lGZmo0eHV0ZE42NW8xRm5aRWpoQnNKNnNlSGFad1MzOHNkdWtER0xQTFN5Z3lmRERsZnZWWE5CZEJneVRlMDd2VmNPMjloK0g5eCswZUVJTS9CRkFweHc5RUh6K1JocGN6clc1JmZtL3JhRE1sc0NMTFlpMVErRGtPcllvTGdldz0=; _ir=0"
		}
			}).then(({ data }) => {
		const $ = cheerio.load(data)
		const result = [];
		const hasil = [];
   		 $('div > a').get().map(b => {
        const link = $(b).find('img').attr('src')
            result.push(link)
		});
   		result.forEach(v => {
		 if(v == undefined) return
		 hasil.push(v.replace(/236/g,'736'))
			})
			hasil.shift();
		resolve(hasil)
		})
	})
}

Scraper.swallpaper = async (title, page = '1')  => {
	return new Promise((resolve, reject) => {	
		axios.get(`https://www.besthdwallpaper.com/search?CurrentPage=${page}&q=${title}`).then(({
			data	
		}) => {	
			let $ = cheerio.load(data)	
			let hasil = []	
			$('div.grid-item').each(function(a, b) {	
				hasil.push({	
					title: $(b).find('div.info > a > h3').text(),	
					type: $(b).find('div.info > a:nth-child(2)').text(),	
					source: 'https://www.besthdwallpaper.com/' + $(b).find('div > a:nth-child(3)').attr('href'),	
					image: [$(b).find('picture > img').attr('data-src') || $(b).find('picture > img').attr('src'), $(b).find('picture > source:nth-child(1)').attr('srcset'), $(b).find('picture > source:nth-child(2)').attr('srcset')]	
				})	
			})	
			resolve(hasil)	
			
		})	
	})	
}

Scraper.snapsave = async (url) => {
  return new Promise(async (resolve) => {
    try {
      function decodeSnapApp(args) {
        let [h, u, n, t, e, r] = args;
        function decode(d, e, f) {
          const g = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/'.split('');
          let h = g.slice(0, e);
          let i = g.slice(0, f);
          let j = d.split('').reverse().reduce(function (a, b, c) {
            if (h.indexOf(b) !== -1)
              return a += h.indexOf(b) * (Math.pow(e, c));
          }, 0);
          let k = '';
          while (j > 0) {
            k = i[j % f] + k;
            j = (j - (j % f)) / f;
          }
          return k || '0';
        }
        r = '';
        for (let i = 0, len = h.length; i < len; i++) {
          let s = "";
          while (h[i] !== n[e]) {
            s += h[i]; i++;
          }
          for (let j = 0; j < n.length; j++)
            s = s.replace(new RegExp(n[j], "g"), j.toString());
          r += String.fromCharCode(decode(s, e, 10) - t);
        }
        return decodeURIComponent(encodeURIComponent(r));
      }

      function getEncodedSnapApp(data) {
        return data.split('decodeURIComponent(escape(r))}(')[1]
          .split('))')[0]
          .split(',')
          .map(v => v.replace(/"/g, '').trim());
      }

      function getDecodedSnapSave(data) {
        return data.split('getElementById("download-section").innerHTML = "')[1]
          .split('"; document.getElementById("inputData").remove(); ')[0]
          .replace(/\\(\\)?/g, '');
      }

      function decryptSnapSave(data) {
        return getDecodedSnapSave(decodeSnapApp(getEncodedSnapApp(data)));
      }

      const html = await got.post('https://snapsave.app/action.php?lang=id', {
        headers: {
          'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
          'content-type': 'application/x-www-form-urlencoded',
          'origin': 'https://snapsave.app',
          'referer': 'https://snapsave.app/id',
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36'
        },
        form: { url }
      }).text();

      const decode = decryptSnapSave(html);
      const $ = cheerio.load(decode);
      const results = [];

      if ($('table.table').length || $('article.media > figure').length) {
        const thumbnail = $('article.media > figure').find('img').attr('src');
        $('tbody > tr').each((_, el) => {
          const $el = $(el);
          const $td = $el.find('td');
          const resolution = $td.eq(0).text();
          let _url = $td.eq(2).find('a').attr('href') || $td.eq(2).find('button').attr('onclick');
          const shouldRender = /get_progressApi/ig.test(_url || '');
          if (shouldRender) {
            _url = /get_progressApi\('(.*?)'\)/.exec(_url || '')?.[1] || _url;
          }
          results.push({
            resolution,
            thumbnail,
            url: _url,
            shouldRender
          });
        });
      } else {
        $('div.download-items__thumb').each((_, tod) => {
          const thumbnail = $(tod).find('img').attr('src');
          const btns = $(tod).next('div.download-items__btn'); // Asumsi tombol berada tepat setelah thumbnail
          btns.each((_, ol) => {
            let _url = $(ol).find('a').attr('href');
            if (!/https?:\/\//.test(_url || '')) _url = `https://snapsave.app${_url}`;
            results.push({
              thumbnail,
              url: _url
            });
          });
        });
      }

      if (!results.length) return resolve({ msg: `Blank data` });
      return resolve({ data: results });
    } catch (e) {
      return resolve({ msg: e.message });
    }
  });
}


Scraper.ttstalk = async (username) => {
	let retryCount = 0;
	while (retryCount < 3) {
		try {
			const response = await axios.get(`https://tiktok.com/@${username}`);
			const $ = cheerio.load(response.data);
			const userData = JSON.parse($('#__UNIVERSAL_DATA_FOR_REHYDRATION__').text()).__DEFAULT_SCOPE__['webapp.user-detail'].userInfo;
			
			const userInfo = {
				data: {
					...userData.user,
					...userData.stats
				}
			};
			
			return userInfo;
		} catch (err) {
			retryCount++;
		}
	}
	return { error: true };
}

Scraper.mediafire = async (url) => {
const res = await axios.get(url) 
const $ = cheerio.load(res.data)
const hasil = []
const link = $('a#downloadButton').attr('href')
const size = $('a#downloadButton').text().replace('Download', '').replace('(', '').replace(')', '').replace('\n', '').replace('\n', '').replace('                         ', '')
const seplit = link.split('/')
const nama = seplit[5]
mime = nama.split('.')
mime = mime[1]
hasil.push({ nama, mime, size, link })
return hasil
}

Scraper.tiktok = async(url) => {
  try {
    const response = await axios.get('https://api.tiklydown.eu.org/api/download', {
      params: { url: url },
      headers: { 'accept': 'application/json' }
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

Scraper.completions = async (messages) => {

    const options = {
        provider: g4f.providers.GPT,
        model: "gpt-4-32k-0314",
        debug: true,
    };

    const json = await g4f.chatCompletion(messages, options);
    return json;
}


Scraper.gpt4 = async (text) => {
  const currentTime = moment().tz('Asia/Jakarta').format('LLLL');
    
    const messages = [
        {
            role: "system",
            content: `Saya adalah asisten virtual yang dikembangkan oleh OpenAI dengan basis gpt-4 32k. Saya dirancang untuk membantu Anda dengan pertanyaan dan informasi yang Anda perlukan. Saat ini adalah ${currentTime}. Ada yang bisa saya bantu?`
        },
        {
            role: "user",
            content: text
        }
    ];

    const options = {
        provider: g4f.providers.GPT,
        model: "gpt-4-32k-0314",
        debug: true,
    };

    const json = await g4f.chatCompletion(messages, options);
    return json;
}

Scraper.pixiv = async (text) => {
    return axios.get("https://api.lolicon.app/setu/v2?size=regular&r18=0&num=20&keyword=" + text)
        .then(data => data.data.data);
}

Scraper.pixivr18 = async (text) => {
    return axios.get("https://api.lolicon.app/setu/v2?size=regular&r18=1&num=20&keyword=" + text)
        .then(data => data.data.data);
}

Scraper.gemini = async (inputText) => {
    // For text-only input, use the gemini-pro model
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + googlekey; 
    const data = {
        contents: [{
            parts: [{
                text: inputText
            }]
        }]
    };
    const response = await axios.post(url, data, {
        headers: {
        'Content-Type': 'application/json'
    }
    })
    console.log(response.data);
    return response.data.candidates[0].content.parts[0].text;
}

Scraper.geminiVision = async (inputTextt, inputImage) => {
	const bufer = await bufferlah(inputImage)
	const bup = await Resize(bufer)
	const requestBody = {
		"contents": [

			{
				"parts": [

					{
						"text": inputTextt
					},

					{
						"inline_data": {
							"mime_type": "image/jpeg",
							"data": bup.toString('base64')
						}
					}

				]
			}

		]
	};
	const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${googlekey}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(requestBody)
	});
	const data = await response.json();
	console.log(data);
	return data.candidates[0].content.parts[0].text;
}

Scraper.blackbox = async (content, web) => {
    const url = "https://www.blackbox.ai/api/chat"
    const headers = {
        "Accept": "*/*",
        "Accept-Language": "id-ID,en;q=0.5",
        "Referer": "https://www.blackbox.ai/",
        "Content-Type": "application/json",
        "Origin": "https://www.blackbox.ai",
        "Alt-Used": "www.blackbox.ai"
    }
    const data = {
        messages: [{
            role: "user",
            content
        }],
        id: "chat-free",
        previewToken: null,
        userId: "",
        codeModelMode: true,
        agentMode: {},
        trendingAgentMode: {},
        isMicMode: false,
        userSystemPrompt: "You are BlacBox Ai, a useful AI Model for millions of developers using Blackbox Code Chat that will answer coding questions and help them when writing code.",
        maxTokens: 1024,
        webSearchMode: web,
        promptUrls: "",
        isChromeExt: false,
        githubToken: null
    }
    try {
        const blackboxResponse = await fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(data)
        })
        const blackboxData = await blackboxResponse.text()
        return blackboxData
    } catch (error) {
        console.error("Error fetching data:", error)
        return null
    }
}

Scraper.toVideo = async (str) => {
      return new Promise(async resolve => {
         try {
            const image = Buffer.isBuffer(str) ? str : str.startsWith('http') ? await (await axios.get(str, {
               responseType: 'arraybuffer'
            })).data : str
            let form = new FormData
            form.append('new-image', Buffer.from(image), 'image.webp')
            form.append('new-image-url', '')
            const html = await (await axios.post('https://ezgif.com/webp-to-mp4', form, {
               headers: {
                  "Accept": "*/*",
                  "User-Agent": "Mozilla/5.0 (Linux; Android 6.0.1; SM-J500G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Mobile Safari/537.36",
                  "Origin": "https://ezgif.com",
                  "Referer": "https://ezgif.com/webp-to-mp4",
                  "Referrer-Policy": "strict-origin-when-cross-origin",
                  "sec-ch-ua": '"Chromium";v="107", "Not=A?Brand";v="24"',
                  "sec-ch-ua-platform": "Android",
                  "sec-fetch-dest": "empty",
                  "sec-fetch-mode": "cors",
                  "sec-fetch-site": "same-origin",
                  "x-requested-with": "XMLHttpRequest",
                  ...form.getHeaders()
               }
            })).data
            const $ = cheerio.load(html)
            let File = $('#main > form').find('input[type=hidden]:nth-child(1)').attr('value')
            let token = $('#main > form').find('input[type=hidden]:nth-child(2)').attr('value')
            let Submit = $('#tool-submit-button').find('input').attr('value')
            const Format = {
               file: File,
               token: token,
               convert: Submit
            }
            const proc = await (await axios({
               url: "https://ezgif.com/webp-to-mp4/" + File,
               method: "POST",
               data: new URLSearchParams(Object.entries(Format)),
               headers: {
                  "User-Agent": "Mozilla/5.0 (Linux; Android 6.0.1; SM-J500G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Mobile Safari/537.36",
                  "Origin": "https://ezgif.com",
                  "Referer": "https://ezgif.com/webp-to-mp4",
                  "Referrer-Policy": "strict-origin-when-cross-origin",
                  "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                  "accept-language": "en-US,en;q=0.9,id;q=0.8",
                  "content-type": "application/x-www-form-urlencoded",
                  "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\", \"Google Chrome\";v=\"90\""
               }
            })).data
            const link = cheerio.load(proc)('#output > p.outfile').find('video > source').attr('src')
            if (!link) return resolve({
               creator: creator,
               status: false,
               msg: 'Failed to convert!'
            })
            resolve({
               creator: creator,
               status: true,
               data: {
                  url: 'https:' + link
               }
            })
         } catch (e) {
            console.log(e)
            resolve({
               creator: creator,
               status: false,
               msg: e.message
            })
         }
      })
}

Scraper.npm = async(text) => {
  const response = await axios.get(`https://registry.npmjs.com/-/v1/search?text=${text}`);
  return response.data;
}

Scraper.asupan = async(query) => {
  try {
    const response = await axios({
      url: "https://tikwm.com/api/feed/search",
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "cookie": "current_language=en",
        "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36"
      },
      data: {
        "keywords": query,
        "count": 12,
        "cursor": 0,
        "hd": 1
      }
    });

    const videos = response.data.data.videos;
    if (videos.length === 0) {
      throw new Error("No videos found");
    }

    // Get a random video from the videos array
    const randomIndex = Math.floor(Math.random() * videos.length);
    const randomVideo = videos[randomIndex];

    // Format the random video data
    const data = {
      caption: randomVideo.title,
      author: { ...randomVideo.author, username: randomVideo.author.unique_id },
      stats: {
        play_count: randomVideo.play_count,
        digg_count: randomVideo.digg_count,
        share_count: randomVideo.share_count,
        comment_count: randomVideo.comment_count,
      },
      music: randomVideo.music_info,
      duration: randomVideo.duration,
      video: randomVideo.play,
    };

    return data;
  } catch (error) {
    throw error;
  }
}

Scraper.rotate = async(url, type) => {
  try {
    let form = new URLSearchParams();
    form.append('new-image-url', url);
    form.append('submit', 'Upload!');

    let initialResponse = await axios.post('https://ezgif.com/rotate', form);
    let $ = cheerio.load(initialResponse.data);
    let data = [];

    $('img').each((i, e) => {
      let tmp = $(e).attr('src');
      if (tmp.match(/(\/tmp\/)/g)) data.push(tmp);
    });

    if (data.length === 0) {
      return {
        creator: global.creator,
        status: false
      };
    }

    let input = {
      target: $('form[class="form ajax-form"]').attr('action'),
      filename: data[0].split('/')[4],
      token: $('input[name="token"]').attr('value')
    };

    let rotateForm = new URLSearchParams();
    rotateForm.append('file', input.filename);
    rotateForm.append('token', input.token);
    rotateForm.append(type, 'on');
    rotateForm.append('free_deg', 45);
    rotateForm.append('submit', 'Upload!');

    let rotateResponse = await axios.post(input.target, rotateForm);
    $ = cheerio.load(rotateResponse.data);

    let rotatedImageUrl = $('p.outfile > img').attr('src');

    return {
      creator: global.creator,
      status: true,
      data: {
        url: 'https:' + rotatedImageUrl
      }
    };
  } catch (e) {
    console.log(e);
    return {
      creator: global.creator,
      status: false
    };
  }
}

Scraper.nikParse = async(nik) => {
  try {
    const { data } = await axios.post(
      'https://indonesia-ktp-parser-validator.p.rapidapi.com/ktp_validator',
      { nik },
      {
        headers: {
          'x-rapidapi-key': '9e0c59de57msh3b88e80e31c66c4p1b85e5jsn48b379c99680',
          'x-rapidapi-host': 'indonesia-ktp-parser-validator.p.rapidapi.com',
          'Content-Type': 'application/json'
        }
      }
    );

    if (data?.result?.data) {
      const result = data.result.data;

      const today = new Date();
      const birthDate = new Date(result.lahir.split('/').reverse().join('-'));
      let age = today.getFullYear() - birthDate.getFullYear();
      if (today < new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate())) {
        age--;
      }
      result.umur = `${age} tahun`;

      const posData = await axios.get(`https://kodepos.vercel.app/search/?q=${encodeURIComponent(result.kecamatan)}`);
      const lokasi = posData?.data?.data?.[0] || {};
      result.kode_pos = lokasi.code || 'Tidak ditemukan';
      result.latitude = lokasi.latitude || null;
      result.longitude = lokasi.longitude || null;

      return data;
    }
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

Scraper.tts = async(text) => {
    const models = {
        miku: { voice_id: "67aee909-5d4b-11ee-a861-00163e2ac61b", voice_name: "Hatsune Miku" },
        nahida: { voice_id: "67ae0979-5d4b-11ee-a861-00163e2ac61b", voice_name: "Nahida (Exclusive)" },
        nami: { voice_id: "67ad95a0-5d4b-11ee-a861-00163e2ac61b", voice_name: "Nami" },
        ana: { voice_id: "f2ec72cc-110c-11ef-811c-00163e0255ec", voice_name: "Ana(Female)" },
        optimus_prime: { voice_id: "67ae0f40-5d4b-11ee-a861-00163e2ac61b", voice_name: "Optimus Prime" },
        goku: { voice_id: "67aed50c-5d4b-11ee-a861-00163e2ac61b", voice_name: "Goku" },
        taylor_swift: { voice_id: "67ae4751-5d4b-11ee-a861-00163e2ac61b", voice_name: "Taylor Swift" },
        elon_musk: { voice_id: "67ada61f-5d4b-11ee-a861-00163e2ac61b", voice_name: "Elon Musk" },
        mickey_mouse: { voice_id: "67ae7d37-5d4b-11ee-a861-00163e2ac61b", voice_name: "Mickey Mouse" },
        kendrick_lamar: { voice_id: "67add638-5d4b-11ee-a861-00163e2ac61b", voice_name: "Kendrick Lamar" },
        angela_adkinsh: { voice_id: "d23f2adb-5d1b-11ee-a861-00163e2ac61b", voice_name: "Angela Adkinsh" },
        eminem: { voice_id: "c82964b9-d093-11ee-bfb7-e86f38d7ec1a", voice_name: "Eminem" }
    };

    const getInspepek = () => `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;

    const InsAgents = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/602.3.12 (KHTML, like Gecko) Version/10.1.2 Safari/602.3.12",
        "Mozilla/5.0 (Linux; Android 8.0.0; Pixel 2 XL Build/OPD3.170816.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Mobile Safari/537.36"
    ];
    const randomInsAgent = InsAgents[Math.floor(Math.random() * InsAgents.length)];

    const requests = Object.entries(models).map(async ([modelName, { voice_id, voice_name }]) => {
        const ngeloot = {
            raw_text: text,
            url: "https://filme.imyfone.com/text-to-speech/anime-text-to-speech/",
            product_id: "200054",
            convert_data: [
                {
                    voice_id,
                    speed: "1", // maksimal 100 wak normal 1
                    volume: "50", // maksimal 100 normal 50
                    text,
                    pos: 0
                }
            ]
        };

        const rekuesanu = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                'X-Forwarded-For': getInspepek(),
                'User-Agent': randomInsAgent
            }
        };

        try {
            const useanu = await axios.post('https://voxbox-tts-api.imyfone.com/pc/v1/voice/tts', JSON.stringify(ngeloot), rekuesanu);
            const { channel_id, oss_url } = useanu.data.data.convert_result[0];
            return { modelName, channel_id, oss_url, voice_id, voice_name };
        } catch (error) {
            console.error(`Yah, ada yang salah nih pas nyobain untuk model ${modelName}:`, error);
            return { modelName, error: `Waduh, kayaknya ada yang gak beres nih untuk model ${modelName}` };
        }
    });

    const ceker_babat_punya_ins = await Promise.all(requests);

    const formattedceker_babat_punya_ins = ceker_babat_punya_ins.map(({ modelName, channel_id, oss_url, voice_id, voice_name, error }) => {
        if (error) {
            return { modelName, error };
        }
        return {
            channel_id,
            voice_name,
            [modelName]: oss_url,
            voice_id
        };
    });

    return { creator: creator, data: formattedceker_babat_punya_ins };
}
