var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};

const axios = require("axios");
const FormData = require("form-data");
const { randomInt } = require("crypto");
const { readFileSync } = require("fs");
const path = require("path");

class Morphic {
    constructor() {
        this.account = {
            cookie: "",
            email: "",
            pass: "",
        };
    }
    randomChatId(number = false) {
        let abc = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        number ? (abc += "1234567890") : abc;
        let id = "";
        while (id.length < 6) {
            id += abc[randomInt(abc.length)];
        }
        return id;
    }
    uploadFile(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                try {
                    let d;
                    const id = this.randomChatId(true);
                    const f = new FormData();
                    yield f.append("1_file", readFileSync(data), {
                        filename: path.basename(data),
                        contentType: "image/" + path.extname(data).replace(".", ""),
                    });
                    yield f.append("0", '["$K1"]');
                    const _f = new FormData();
                    _f.append("0", "[]");
                    yield axios
                        .post("https://www.morphic.sh/search/" + id, _f, {
                        headers: Object.assign({ "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36", origin: "https://www.morphic.sh", referer: "https://www.morphic.sh/search/" + id, "Next-Router-State-Tree": "%5B%22%22%2C%7B%22children%22%3A%5B%22__PAGE__%22%2C%7B%7D%2C%22%2F%22%2C%22refresh%22%5D%7D%2Cnull%2Cnull%2Ctrue%5D", cookie: this.account.cookie
                                ? this.account.cookie +
                                    ";ph_phc_HK6KqP8mdSmxDjoZtHYi3MW8Kx5mHmlYpmgmZnGuaV5_posthog=%7B%22distinct_id%22%3A%22019130c4-ff3b-7526-941a-5696baeb6742%22%2C%22%24sesid%22%3A%5B1726570998841%2C%220191ffa6-78d1-7855-a443-eb1c5cdc88c7%22%2C1726570985681%5D%7D"
                                : "ph_phc_HK6KqP8mdSmxDjoZtHYi3MW8Kx5mHmlYpmgmZnGuaV5_posthog=%7B%22distinct_id%22%3A%22019130c4-ff3b-7526-941a-5696baeb6742%22%2C%22%24sesid%22%3A%5B1726570998841%2C%220191ffa6-78d1-7855-a443-eb1c5cdc88c7%22%2C1726570985681%5D%7D", "Next-Action": "ceb481ef6525068d0dbc1b4e2467ce82ea8f4f34", priority: "u=1; i", Accept: "text/x-component" }, _f.getHeaders()),
                    })
                        .catch((e) => { });
                    const r = yield axios
                        .post("https://www.morphic.sh/search" + id, f, {
                        headers: Object.assign({ "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36", origin: "https://www.morphic.sh", referer: "https://www.morphic.sh/search/" + id, "Next-Router-State-Tree": "%5B%22%22%2C%7B%22children%22%3A%5B%22__PAGE__%22%2C%7B%7D%2C%22%2F%22%2C%22refresh%22%5D%7D%2Cnull%2Cnull%2Ctrue%5D", cookie: this.account.cookie
                                ? this.account.cookie +
                                    ";ph_phc_HK6KqP8mdSmxDjoZtHYi3MW8Kx5mHmlYpmgmZnGuaV5_posthog=%7B%22distinct_id%22%3A%22019130c4-ff3b-7526-941a-5696baeb6742%22%2C%22%24sesid%22%3A%5B1726570998841%2C%220191ffa6-78d1-7855-a443-eb1c5cdc88c7%22%2C1726570985681%5D%7D"
                                : "ph_phc_HK6KqP8mdSmxDjoZtHYi3MW8Kx5mHmlYpmgmZnGuaV5_posthog=%7B%22distinct_id%22%3A%22019130c4-ff3b-7526-941a-5696baeb6742%22%2C%22%24sesid%22%3A%5B1726570998841%2C%220191ffa6-78d1-7855-a443-eb1c5cdc88c7%22%2C1726570985681%5D%7D", "Next-Action": "d284705174c9126d97f5e04b721cc2d4484ba7c8", priority: "u=1; i", Accept: "text/x-component" }, f.getHeaders()),
                    })
                        .then((v) => v.data)
                        .catch((v) => v.response.data);
                    const x = /1:"(.*?)"/.exec(r);
                    if (/1:[\d]+/g.exec(r))
                        return () => __awaiter(this, void 0, void 0, function* () {
                            // ? External cdn
                            const $f = new FormData();
                            const s = createReadStream(data);
                            $f.append("file", s);
                            let size = 0;
                            s.on("data", (chunk) => (size += chunk.length));
                            yield axios
                                .post("https://api.shannzmoderz.xyz/server/upload", $f, {
                                headers: Object.assign({}, $f.getHeaders()),
                            })
                                .then((v) => v.data)
                                .then((v) => {
                                console.log(v);
                                return resolve({
                                    name: path.basename(data),
                                    size,
                                    uploadedPath: v,
                                });
                            })
                                .catch((v) => console.log(v));
                        });
                    if (!x)
                        return reject(new Error("Failed to upload files!"));
                    d = {
                        name: (_a = x === null || x === void 0 ? void 0 : x[1].split("/")) === null || _a === void 0 ? void 0 : _a[1].split("-").slice(1).join("-"),
                        size: 0,
                        uploadedPath: x === null || x === void 0 ? void 0 : x[1],
                    };
                    if (!d)
                        return reject(new Error("Empty uploaded files array!"));
                    return resolve(d);
                }
                catch (e) {
                    return reject(e);
                }
            }));
        });
    }
    addInput() {
        return __awaiter(this, arguments, void 0, function* (data = {
            prompt: "hi",
        }, chatHistory) {
            if (!chatHistory)
                throw new Error("Please enter IMorphicChats object in the second param!");
            const files = [];
            let prompt = typeof data === "string" ? data : data.prompt;
            (data === null || data === void 0 ? void 0 : data.files) && (prompt += "\n\nImages : ");
            yield (typeof data !== "string" &&
                (() => __awaiter(this, void 0, void 0, function* () {
                    var _a, e_1, _b, _c;
                    try {
                        for (var _d = true, _e = __asyncValues((data === null || data === void 0 ? void 0 : data.files) || []), _g; _g = yield _e.next(), _a = _g.done, !_a; _d = true) {
                            _c = _g.value;
                            _d = false;
                            let v = _c;
                            try {
                                /https?/g.test(v)
                                    ? (prompt += "\n" + v)
                                    : files.push(yield this.uploadFile(v));
                            }
                            catch (e) { }
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                }))());
            yield chatHistory.messages.push({
                id: this.randomChatId(true),
                content: JSON.stringify({
                    input: prompt,
                }),
                role: "user",
                type: "input",
                files,
            });
            return chatHistory;
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const f = new FormData();
                    f.append("1_email", email);
                    f.append("1_password", password);
                    f.append("1_returnPath", "");
                    f.append("0", '["$K1","$undefined"]');
                    const r = yield axios
                        .post("https://www.morphic.sh/login", f, {
                        headers: Object.assign({ "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36", origin: "https://www.morphic.sh", referer: "https://www.morphic.sh/login", "Next-Router-State-Tree": "%5B%22%22%2C%7B%22children%22%3A%5B%22login%22%2C%7B%22children%22%3A%5B%22__PAGE__%22%2C%7B%7D%2C%22%2Flogin%22%2C%22refresh%22%5D%7D%5D%7D%2Cnull%2Cnull%2Ctrue%5D", cookie: "ph_phc_HK6KqP8mdSmxDjoZtHYi3MW8Kx5mHmlYpmgmZnGuaV5_posthog=%7B%22distinct_id%22%3A%22019130c4-ff3b-7526-941a-5696baeb6742%22%2C%22%24sesid%22%3A%5B1726395617656%2C%220191f527-8403-7247-9bdb-987281639d11%22%2C1726394893315%5D%7D", "Next-Action": "3f5ce7be9a896ea561c2700eb25dc2ebbf25932d", priority: "u=1; i", Accept: "text/x-component" }, f.getHeaders()),
                    })
                        .then((v) => { var _a; return (_a = v.headers["set-cookie"]) === null || _a === void 0 ? void 0 : _a[0]; });
                    if (!r)
                        return reject(new Error("Fail To Login, make sure you entered correct email and password"));
                    this.account = {
                        email,
                        pass: password,
                        cookie: r,
                    };
                    return resolve({
                        success: true,
                    });
                }
                catch (e) {
                    return reject(e);
                }
            }));
        });
    }
    chat() {
        return __awaiter(this, arguments, void 0, function* (data = "hi!!") {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c, _d, _e;
                try {
                    let prompt;
                    if (typeof data === "string")
                        prompt = data;
                    else if (typeof data === "object")
                        prompt =
                            ((_a = data.messages) === null || _a === void 0 ? void 0 : _a[data.messages.length - 1]) || "";
                    else
                        return reject(new Error("Enter Valid IMorphicChats Object!"));
                    typeof prompt !== "string" && prompt.role !== "user"
                        ? (() => {
                            return reject(new Error("Enter Valid User Chat!"));
                        })()
                        : typeof prompt === "string"
                            ? (prompt = prompt)
                            : (prompt =
                                ((_b = JSON.parse(prompt.content)) === null || _b === void 0 ? void 0 : _b.input) || "");
                    if (!prompt)
                        return reject(new Error("Enter Valid User Chat Or String"));
                    const id = typeof prompt === "string"
                        ? this.randomChatId(true)
                        : data.chatId;
                    let d = typeof data === "string"
                        ? {
                            chatId: id,
                            messages: [],
                        }
                        : data;
                    const form = new FormData();
                    form.append("1", JSON.stringify({
                        id: "6399a7e212fa477d1a783edade27c8354a64e1ab",
                        bound: null,
                    }));
                    form.append("2", JSON.stringify({
                        id: "9eed8f3e1c51044505fd5c0d73e8d2a92572691c",
                        bound: null,
                    }));
                    form.append("3_input", prompt);
                    form.append("3_files", "[]");
                    form.append("3_include_images", "true");
                    yield form.append("0", JSON.stringify([
                        {
                            action: "$F1",
                            options: {
                                onSetAIState: "$F2",
                            },
                        },
                        d,
                        "$K3",
                        false,
                        "$undefined",
                        "$undefined",
                    ]));
                    const r = yield axios
                        .post(this.account.cookie
                        ? "https://www.morphic.sh/" + id
                        : "https://www.morphic.sh/", form, {
                        headers: Object.assign(Object.assign({ "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36", Origin: "https://www.morphic.sh", priority: "u=1, i", "Accept-Encoding": "gzip, deflate, br, zstd", "Next-Action": "c54d85c7f9588581807befbe1a35958acc57885b", "Next-Router-State-Tree": "%5B%22%22%2C%7B%22children%22%3A%5B%22__PAGE__%22%2C%7B%7D%2C%22%2F%22%2C%22refresh%22%5D%7D%2Cnull%2Cnull%2Ctrue%5D", Cookie: ((_c = this.account) === null || _c === void 0 ? void 0 : _c.cookie)
                                ? this.account.cookie
                                : "ph_phc_HK6KqP8mdSmxDjoZtHYi3MW8Kx5mHmlYpmgmZnGuaV5_posthog=%7B%22distinct_id%22%3A%22019130c4-ff3b-7526-941a-5696baeb6742%22%2C%22%24sesid%22%3A%5B1724677695324%2C%2201918e8e-c152-7b78-9ad8-350052c83148%22%2C1724673605969%5D%7D", "sec-ch-ua": '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"' }, form.getHeaders()), { Accept: "text/x-component" }),
                    })
                        .then((v) => __awaiter(this, void 0, void 0, function* () { return v.data(); }))
                        .catch((v) => v.response.data);
                    const X = /"diff":\[0,"(.*?)"\]/g;
                    const Q = /{"curr":{"items":(\[(?:{"query":".*?"},?)+\])}/g;
                    const S = /{"title":"(.*?)","url":"(.*?)","content":"(.*?)","score":(.*?),"raw_content":(null|.*?)}/g;
                    const I = /{"query":"(.*?)","follow_up_questions":null,"answer":null,"images":\[(({"url":"(.*?)","description":(?:"(.*?)"|null)},?)+)\]/g;
                    const M = /2:({(?:.*?)"]})/g;
                    const f = (_d = /{"result":{"curr":"\$undefined","next":"\$@([^"]+)","type":"\$4"},"model":"([^"]+)"/g.exec(r)) === null || _d === void 0 ? void 0 : _d[1];
                    let R;
                    let _ = "";
                    let q;
                    let $q;
                    let i;
                    let s;
                    let iN = "";
                    const _s = [];
                    const _q = [];
                    const _i = [];
                    f && (_ += (_e = new RegExp(f + ':{"curr":"([^"]+)"', "g").exec(r)) === null || _e === void 0 ? void 0 : _e[1]);
                    (i = I.exec(r)) !== null &&
                        (() => {
                            iN = i === null || i === void 0 ? void 0 : i[1];
                            JSON.parse("[" + (i === null || i === void 0 ? void 0 : i[2]) + "]").forEach((v) => _i.push(v));
                        })();
                    while ((s = S.exec(r)) !== null) {
                        _s.push({
                            title: s === null || s === void 0 ? void 0 : s[1],
                            url: s === null || s === void 0 ? void 0 : s[2],
                            content: s === null || s === void 0 ? void 0 : s[3],
                            score: s === null || s === void 0 ? void 0 : s[4],
                            raw_content: s === null || s === void 0 ? void 0 : s[5],
                        });
                    }
                    while ((q = Q.exec(r)) !== null) {
                        $q = q;
                    }
                    ($q === null || $q === void 0 ? void 0 : $q[1]) &&
                        JSON.parse($q === null || $q === void 0 ? void 0 : $q[1]).forEach((v) => {
                            _q.push(v.query);
                        });
                    while ((R = X.exec(r)) !== null) {
                        _ += R[1];
                    }
                    if (!_)
                        return reject(new Error("Fail to get response"));
                    const aId = this.randomChatId(true);
                    typeof data &&
                        d.messages.push({
                            id: id,
                            content: JSON.stringify({
                                input: prompt,
                            }),
                            files: [],
                            role: "user",
                            type: "input",
                        });
                    (_i.length || _s.length) &&
                        d.messages.push({
                            id: aId,
                            content: JSON.stringify({
                                query: iN,
                                follow_up_questions: null,
                                answer: null,
                                images: _i,
                                results: _s,
                            }),
                            role: "assistant",
                            name: "search",
                            type: "tool",
                        });
                    d.messages.push({
                        id: aId,
                        content: _,
                        role: "assistant",
                        type: "answer",
                    });
                    _q &&
                        d.messages.push({
                            id: aId,
                            content: JSON.stringify({
                                items: _q.map((v) => {
                                    return { query: v };
                                }),
                            }),
                            role: "assistant",
                            type: "related",
                        });
                    d.messages.push({
                        id: aId,
                        content: "followup",
                        role: "assistant",
                        type: "followup",
                    });
                    !("createdAt" in d) &&
                        (() => {
                            d.createdAt = [new Date().toISOString()];
                        })();
                    !("model" in d) &&
                        (() => {
                            d.model = "gpt-4o-mini";
                        })();
                    return resolve({
                        prompt: prompt,
                        answer: _,
                        query: _q,
                        images: _i,
                        search: _s,
                        chat: d,
                    });
                }
                catch (e) {
                    return reject(e);
                }
            }));
        });
    }
}

module.exports = { Morphic }