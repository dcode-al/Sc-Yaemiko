const axios = require('axios')

const InsAgents = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/602.3.12 (KHTML, like Gecko) Version/10.1.2 Safari/602.3.12",
        "Mozilla/5.0 (Linux; Android 8.0.0; Pixel 2 XL Build/OPD3.170816.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Mobile Safari/537.36"
    ];
    const randomInsAgent = InsAgents[Math.floor(Math.random() * InsAgents.length)];

async function askGpt({ model, messages }) {
  try {
    // headers
    const head = {
        "Accept": "text/event-stream",
        "Origin": "https://duckduckgo.com",
        "Referer": "https://duckduckgo.com/",
        "Cookie": "dcm=3; s=l; bf=1",
        "User-Agent": randomInsAgent,
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        "Connection": "keep-alive"
    };
    
    // Get online status
    const status = await axios({
      method: "GET",
      url: "https://duckduckgo.com/duckchat/v1/status",
      headers: {
        ...head,
        "x-vqd-accept": "1"
      }
    });

    const vqd4 = status.headers['x-vqd-4'];

    const res = await axios({
      method: "POST",
      url: "https://duckduckgo.com/duckchat/v1/chat",
      data: {
        model,
        messages
      },
      headers: {
        ...head,
        "x-vqd-4": vqd4
      },
    });
  
    let gabunganMessage = "";
  
    const response = res?.data?.split("\n");
    for(let ap of response) {
      if(ap.includes("data: ")) {
        const rec = ap.replace("data: ", "");
        if(rec !== "[DONE]") {
          const obj = JSON.parse(rec);
          if(obj.message) {
            gabunganMessage += obj.message + "";
          }
        }
      }
    }
  
    return gabunganMessage;
  } catch(e) {
    return "Server AI Error Please Contact Owner Report This Problem: \n\n" + e.message;
        console.log(e.message);
  }
}

module.exports = { askGpt }