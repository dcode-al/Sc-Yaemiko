const fetch = require('node-fetch'); 

const Func = {
   fetchJson: async (url, options) => {
      try {
         const res = await fetch(url, options);
         if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);
         return await res.json();
      } catch (err) {
         console.error('Error in fetchJson:', err);
         throw err;
      }
   },
   jsonFormat: (json) => JSON.stringify(json, null, 2),
   example: (command, example) => `Example: ${command} ${example}`,
};

const handler = async (m, { conn, args, command, isOwner }) => {
   try {
      const domain = 'https://indranewbie.xyz/users';

      switch (command) {
         case 'registerapi': {
            const id = conn.decodeJid(m.sender).replace(/@.+/, '');
            const json = await Func.fetchJson(`${domain}/register?id=${id}`);
            conn.reply(m.isGroup ? m.sender : m.chat, Func.jsonFormat(json), m);
            break;
         }

         case 'addlimit-api': {
            if (!isOwner) return m.reply(global.status.owner);
            if (!args[0] || !args[1]) return m.reply(Func.example(command, '628xxxx 100'));
            const json = await Func.fetchJson(`${domain}/add-limit?id=${args[0]}&limit=${args[1]}`);
            m.reply(json.msg);
            break;
         }

         case 'my': {
            const id = conn.decodeJid(m.sender).replace(/@.+/, '');
            const json = await Func.fetchJson(`${domain}/steal?id=${id}`);
            json.data._id = m.pushName;
            m.reply(Func.jsonFormat(json));
            break;
         }

         case 'checkkey': {
            if (!args[0]) return m.reply(Func.example(command, 'Indra'));
            const json = await Func.fetchJson(`${domain}/check?apikey=${args[0]}`);
            m.reply(Func.jsonFormat(json));
            break;
         }

         case 'addprem-key': {
            if (!isOwner) return m.reply(global.status.owner);
            if (!args[0] || !args[1]) return m.reply(Func.example(command, '628xxxx packname'));
            const json = await Func.fetchJson(`${domain}/add-premium?id=${args[0]}&packname=${args[1]}`);
            m.reply(Func.jsonFormat(json));
            break;
         }

         case 'listpkg': {
            let p = '❃ PREMIUM REST APIs\n\n';
            prices.forEach((v, i) => {
               p += `${i + 1}. ${v.plan}\n`;
               p += `◦  *Limit* : ${v.limit}\n`;
               p += `◦  *Harga* : Rp. ${Func.formatter ? Func.formatter(v.price) : v.price},-\n`;
               p += `◦  *Durasi* : ${v.duration_f}\n\n`;
            });
            p += global.footer;
            m.reply(p);
            break;
         }

         case 'resets': {
            if (!isOwner) return m.reply(global.status.owner);
            if (!args[0]) return m.reply(Func.example(command, '628xxxx'));
            const json = args[0] === 'all' ?
               await Func.fetchJson(`${domain}/reset-all-users`) :
               await Func.fetchJson(`${domain}/reset?id=${args[0]}`);
            m.reply(Func.jsonFormat(json));
            break;
         }

         case 'custom-key': {
            if (!args[0]) return m.reply(Func.example(command, 'Indra'));
            const id = conn.decodeJid(m.sender).replace(/@.+/, '');
            const json = await Func.fetchJson(`${domain}/change-key?id=${id}&newkey=${args[0]}`);
            m.reply(Func.jsonFormat(json));
            break;
         }
      }
   } catch (e) {
      console.log(e);
      return conn.reply(m.chat, Func.jsonFormat(e), m);
   }
};

handler.command = ['registerapi', 'addlimit-api', 'my', 'checkkey', 'addprem-key', 'listpkg', 'resets', 'custom-key'];
handler.tags = ['api'];
handler.help = ['registerapi', 'addlimit-api', 'my', 'checkkey', 'addprem-key', 'listpkg', 'resets', 'custom-key'];
module.exports = handler;

const prices = [
   {
      plan: 'Minimize',
      packname: 'minimize',
      limit: 5000,
      price: 5500,
      duration: 86400000 * 30 * 1,
      duration_f: '30 Days',
   },
   {
      plan: 'Minimize V2',
      packname: 'minimize-v2',
      limit: 5000,
      price: 10000,
      duration: 86400000 * 30 * 2,
      duration_f: '60 Days',
   },
   {
      plan: 'Minimize V3',
      packname: 'minimize-v3',
      limit: 5000,
      price: 15000,
      duration: 86400000 * 30 * 3,
      duration_f: '90 Days',
   },
   {
      plan: 'Marvest',
      packname: 'marvest',
      limit: 10000,
      price: 10000,
      duration: 86400000 * 30 * 1,
      duration_f: '30 Days',
   },
];