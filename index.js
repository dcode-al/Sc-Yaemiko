let fs = require('fs')
let package = require('./package.json')
const moment = require("moment-timezone")
const time = moment.tz('Asia/Jakarta').format("HH:mm:ss")
const CFonts = require('cfonts')
const Readline = require('readline')
const yargs = require('yargs/yargs')
let cluster = require('cluster')
const cfonts = require('cfonts')
let path = require('path')
const { color } = require('./lib/color')
const { say } = CFonts
const rl = Readline.createInterface(process.stdin, process.stdout)

const displayPasswordPrompt = () => {
    cfonts.say('password', {
        font: 'tiny',
        align: 'center',
        colors: ['system'],
        background: 'black',
        letterSpacing: 1,
        lineHeight: 1,
        space: false,
        maxLength: '0',
    });

    const rl = Readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Masukkan password untuk melanjutkan: ', (inputPassword) => {
        if (validatePassword(inputPassword)) {
            rl.close();
            displayBotInfo(); // Tampilkan informasi bot setelah password benar
        } else {
            console.error('Password salah. Akses ditolak.');
            rl.close();
            process.exit(1); // Keluar dari proses jika password salah
        }
    });
};

// Validasi Password
const validatePassword = (password) => {
    const correctPassword = 'indradev';
    return password === correctPassword;
};

// Menampilkan informasi bot
const displayBotInfo = () => {
    cfonts.say('FURINA\nMD', {
        font: 'block',
        align: 'center',
        colors: ['blue']
    });
    cfonts.say('Simple Whatsapp Bot By @Indra', {
        font: 'console',
        align: 'center',
        colors: ['green']
    });

    // Mulai main.js
    start('main.js');
};

var isRunning = false;

// Fungsi untuk memulai file JS
function start(file) {
    if (isRunning) return;
    isRunning = true;
    let args = [path.join(__dirname, file), ...process.argv.slice(2)];
    cfonts.say([process.argv[0], ...args].join(' '), {
        font: 'console',
        align: 'center',
        colors: ['magenta']
    });
    cfonts.say('📂 MEMUAT SOURCE...', {
        font: 'console',
        align: 'center',
        colors: ['green']
    });
    cfonts.say('🔗 MEMUAT PLUGINS...', {
        font: 'console',
        align: 'center',
        colors: ['green']
    });
    cfonts.say('✔️ DONE !', {
        font: 'console',
        align: 'center',
        colors: ['green']
    });

    cluster.setupMaster({
        exec: args[0],
        args: args.slice(1),
    });

    let p = cluster.fork();
    p.on('message', data => {
        console.log('[RECEIVED]', data);
        switch (data) {
            case 'reset':
                p.process.kill();
                isRunning = false;
                start.apply(this, arguments);
                break;
            case 'uptime':
                p.send(process.uptime());
                break;
        }
    });
    p.on('exit', (_, code) => {
        isRunning = false;
        console.error('[✘] Exited with code:', code);
        if (code === 0) return;
        fs.watchFile(args[0], () => {
            fs.unwatchFile(args[0]);
            start(file);
        });
    });
    let opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse());
    if (!opts['test']) {
        if (!rl.listenerCount()) rl.on('line', line => {
            p.emit('message', line.trim());
        });
    }
}

// Mulai dengan tampilan password
displayPasswordPrompt();
