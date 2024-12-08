/*  scr by @Vanzy 
 *.  source https://whatsapp.com/channel/0029VaaZbDw3mFYCCtmjN81Y
 *.  please don't delete wm
 *.  please don't delete wm
 */

let fetch = require('node-fetch')
let {
    FormData,
    Blob
} = require('formdata-node')
let {
    fileTypeFromBuffer
} = require('file-type')
let crypto = require("crypto");
const userId = crypto.randomUUID();

/*  scr by @Vanzy 
 *.  source https://whatsapp.com/channel/0029VaaZbDw3mFYCCtmjN81Y
 *.  please don't delete wm
 *.  please don't delete wm
 */

class Blackbox {
    constructor(userId) {
        this.userId = userId;
    }
/*  scr by @Vanzy 
 *.  source https://whatsapp.com/channel/0029VaaZbDw3mFYCCtmjN81Y
 *.  please don't delete wm
 */

    async chat(messages, userSystemPrompt = "Realtime", webSearchMode = true) {
        try {
            const blackboxResponse = await fetch("https://www.blackbox.ai/api/chat", {
                method: "POST",
                headers: {
                    "Accept": "*/*",
                    "Accept-Language": "en-US,en;q=0.5",
                    "Referer": "https://www.blackbox.ai/",
                    "Content-Type": "application/json",
                    "Origin": "https://www.blackbox.ai",
                    "Alt-Used": "www.blackbox.ai"
                },
                body: JSON.stringify({
                    messages,
                    id: "chat-free",
                    previewToken: null,
                    userId: this.userId,
                    codeModelMode: true,
                    agentMode: {},
                    trendingAgentMode: {},
                    isMicMode: false,
                    userSystemPrompt,
                    maxTokens: 1024,
                    webSearchMode,
                    promptUrls: "",
                    isChromeExt: false,
                    githubToken: null
                })
            });

            return await blackboxResponse.text();
        } catch (error) {
            console.error("Error fetching data:", error);
            return null;
        }
    }
    
/*  scr by @Vanzy 
 *.  source https://whatsapp.com/channel/0029VaaZbDw3mFYCCtmjN81Y
 *.  please don't delete wm
 */

    async image(imageBuffer, input) {
        try {
            const {
                ext,
                mime
            } = await fileTypeFromBuffer(imageBuffer) || {};
            if (!ext || !mime) return null;
            const form = new FormData();
            const blob = new Blob([imageBuffer], {
                type: mime
            });
            form.append('image', blob, 'image.' + ext);
            form.append('fileName', 'image.' + ext);
            form.append('userId', this.userId);
            const response = await fetch("https://www.blackbox.ai/api/upload", {
                method: 'POST',
                body: form,
            });
            const data = await response.json();
            const messages = [{
                role: "user",
                content: data.response + "\n#\n" + input
            }];
            const response2 = await this.chat(messages, "Realtime", true);
            return response2;
        } catch (error) {
            console.error("Error:", error);
            throw error;
        }
    }
}
/*  scr by @Vanzy 
 *.  source https://whatsapp.com/channel/0029VaaZbDw3mFYCCtmjN81Y
 *.  please don't delete wm
 */

module.exports = {
    Blackbox
};

/*  scr by @Vanzy 
 *.  source https://whatsapp.com/channel/0029VaaZbDw3mFYCCtmjN81Y
 *.  please don't delete wm
 */
 
 // Penggunaan 
 // const irengBox = new Blackbox()
 // irengBox.chat("halo", "nama lu asep", true).then(res => console.log(res))
 // irengBox.image(await fetch("https://...").then(a => a.buffer()), "gambar apa ini?").then(res => console.log(res))
 
 /*  scr by @Vanzy 
 *.  source https://whatsapp.com/channel/0029VaaZbDw3mFYCCtmjN81Y
 *.  please don't delete wm
 */