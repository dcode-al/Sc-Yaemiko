const axios = require("axios");
const cheerio = require("cheerio");
const formData = require("form-data");

async function instagram(url) {
  return new Promise(async (resolve, reject) => {
    const payload = new URLSearchParams(
      Object.entries({
        url: url,
        host: "instagram",
      })
    );

    await axios
      .request({
        method: "POST",
        baseURL: "https://saveinsta.io/core/ajax.php",
        data: payload,
        headers: {
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          cookie: "PHPSESSID=rmer1p00mtkqv64ai0pa429d4o",
          "user-agent":
            "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36",
        },
      })
      .then((response) => {
        const $ = cheerio.load(response.data);
        const mediaURL = $(
          "div.row > div.col-md-12 > div.row.story-container.mt-4.pb-4.border-bottom"
        )
          .map((_, el) => {
            return (
              "https://saveinsta.io/" +
              $(el).find("div.col-md-8.mx-auto > a").attr("href")
            );
          })
          .get();
        const res = {
          status: 200,
          media: mediaURL,
        };
        resolve(res);
      })
      .catch((e) => {
        console.log(e);
        reject({
          status: 400,
          message: "error",
        });
      });
  });
}

async function facebook(url) {
  return new Promise((resolve, reject) => {
    let config = {
      url: url,
    };

    axios("https://www.getfvid.com/downloader", {
      method: "POST",
      data: new URLSearchParams(Object.entries(config)),
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        cookie:
          "_ga=GA1.2.1310699039.1624884412; _pbjs_userid_consent_data=3524755945110770; cto_bidid=rQH5Tl9NNm5IWFZsem00SVVuZGpEd21sWnp0WmhUeTZpRXdkWlRUOSUyQkYlMkJQQnJRSHVPZ3Fhb1R2UUFiTWJuVGlhVkN1TGM2anhDT1M1Qk0ydHlBb21LJTJGNkdCOWtZalRtZFlxJTJGa3FVTG1TaHlzdDRvJTNE; cto_bundle=g1Ka319NaThuSmh6UklyWm5vV2pkb3NYaUZMeWlHVUtDbVBmeldhNm5qVGVwWnJzSUElMkJXVDdORmU5VElvV2pXUTJhQ3owVWI5enE1WjJ4ZHR5NDZqd1hCZnVHVGZmOEd0eURzcSUyQkNDcHZsR0xJcTZaRFZEMDkzUk1xSmhYMlY0TTdUY0hpZm9NTk5GYXVxWjBJZTR0dE9rQmZ3JTNEJTNE; _gid=GA1.2.908874955.1625126838; __gads=ID=5be9d413ff899546-22e04a9e18ca0046:T=1625126836:RT=1625126836:S=ALNI_Ma0axY94aSdwMIg95hxZVZ-JGNT2w; cookieconsent_status=dismiss",
      },
    })
      .then(async ({ data }) => {
        const $ = cheerio.load(data);
        resolve({
          video_sd: $(
            "body > div.page-content > div > div > div.col-lg-10.col-md-10.col-centered > div > div:nth-child(3) > div > div.col-md-4.btns-download > p:nth-child(1) > a"
          ).attr("href"),
          video_hd: $(
            "body > div.page-content > div > div > div.col-lg-10.col-md-10.col-centered > div > div:nth-child(3) > div > div.col-md-4.btns-download > p:nth-child(1) > a"
          ).attr("href"),
          audio: $(
            "body > div.page-content > div > div > div.col-lg-10.col-md-10.col-centered > div > div:nth-child(3) > div > div.col-md-4.btns-download > p:nth-child(2) > a"
          ).attr("href"),
        });
      })
      .catch(reject);
  });
}

async function tiktok(url) {
  let result = {};
  const bodyForm = new formData();
  bodyForm.append("q", url);
  bodyForm.append("lang", "id");

  try {
    const { data } = await axios(`https://savetik.co/api/ajaxSearch`, {
      method: "post",
      data: bodyForm,
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "User-Agent": "PostmanRuntime/7.32.2",
      },
    });

    const $ = cheerio.load(data.data);
    result.status = true;
    result.caption = $(
      "div.video-data > div > .tik-left > div > .content > div > h3"
    ).text();
    result.server1 = {
      quality: "MEDIUM",
      url: $(
        "div.video-data > div > .tik-right > div > p:nth-child(1) > a"
      ).attr("href"),
    };
    result.serverHD = {
      quality: $(
        "div.video-data > div > .tik-right > div > p:nth-child(3) > a"
      )
        .text()
        .split("MP4 ")[1],
      url: $(
        "div.video-data > div > .tik-right > div > p:nth-child(3) > a"
      ).attr("href"),
    };
    result.audio = $(
      "div.video-data > div > .tik-right > div > p:nth-child(4) > a"
    ).attr("href");
    return result;
  } catch (err) {
    result.status = false;
    result.message = "Gatau kenapa";
    console.log(result);
    return result;
  }
}

module.exports = { instagram, facebook, tiktok };