const { BufferJSON, 
WA_DEFAULT_EPHEMERAL, 
generateWAMessageFromContent, 
proto, 
generateWAMessageContent, 
generateWAMessage, 
prepareWAMessageMedia, 
areJidsSameUser, 
getContentType 
} = require('@whiskeysockets/baileys')
process.env.TZ = 'Asia/Jakarta'
let fs = require('fs')
let path = require('path')
let fetch = require('node-fetch')
let { createCanvas, loadImage, registerFont } = require('canvas');
let moment = require('moment-timezone')
let levelling = require('../lib/levelling')
let tags = {
  'main': 'ᴍᴇɴᴜ ᴜᴛᴀᴍᴀ',
  'downloader': 'ᴍᴇɴᴜ ᴅᴏᴡɴʟᴏᴀᴅᴇʀ',
  'sticker': 'ᴍᴇɴᴜ ᴄᴏɴᴠᴇʀᴛ',
  'advanced': 'ᴀᴅᴠᴀɴᴄᴇᴅ',
  'xp': 'ᴍᴇɴᴜ ᴇxᴘ',
  'fun': 'ᴍᴇɴᴜ ғᴜɴ',
  'game': 'ᴍᴇɴᴜ ɢᴀᴍᴇ',
  'jkt48': 'ᴍᴇɴᴜ ᴊᴋᴛ48',
  'group': 'ᴍᴇɴᴜ ɢʀᴏᴜᴘ',
  'image': 'ᴍᴇɴᴜ ɪᴍᴀɢᴇ',
  'nsfw': 'ᴍᴇɴᴜ ɴsғᴡ',
  'info': 'ᴍᴇɴᴜ ɪɴғᴏ',
  'internet': 'ᴍᴇɴᴜ ɪɴᴛᴇʀɴᴇᴛ',
  'islamic' : 'ᴍᴇɴᴜ ɪsʟᴀᴍɪ',
  'kerang': 'ᴍᴇɴᴜ ᴋᴇʀᴀɴɢ',
  'maker': 'ᴍᴇɴᴜ ᴍᴀᴋᴇʀ',
  'owner': 'ᴍᴇɴᴜ ᴏᴡɴᴇʀ ғᴏʀx',
  'Pengubah Suara': 'ᴘᴇɴɢᴜʙᴀʜ sᴜᴀʀᴀ',
  'quotes' : 'ᴍᴇɴᴜ ǫᴜᴏᴛᴇs',
  'cerpen': 'ᴍᴇɴᴜ ᴄᴇʀᴘᴇɴ',
  'stalk': 'ᴍᴇɴᴜ sᴛᴀʟᴋ',
  'shortlink': 'sʜᴏʀᴛ ʟɪɴᴋ',
  'news' : 'ɴᴇᴡs',
  'tools': 'ᴍᴇɴᴜ ᴛᴏᴏʟs',
  'anonymous': 'ᴀɴᴏɴʏᴍᴏᴜs ᴄʜᴀᴛ',
  '': 'ɴᴏ ᴄᴀᴛᴇɢᴏʀʏ',
}
const defaultMenu = {
  before: `



> ᴀʟᴡᴀʏs ʏᴏᴜʀ ɴᴜᴍʙᴇʀ ᴏɴᴇ, ᴛɪʟʟ ɪɴғɪɴɪᴛʏ ᴀɴᴅ ʙᴇʏᴏɴᴅ. ʜᴇʟʟᴏ ᴇᴠᴇʀʏᴏɴᴇ, ɪᴛ's ᴍɪᴄʜɪᴇ ʜᴀʟᴏ sᴇᴍᴜᴀɴʏᴀ ᴀᴋᴜ ʙᴏᴛ ᴍɪᴄʜɪᴇ ᴀɴᴅ ғᴏʀx ꜱᴀʏᴀ ᴀᴅᴀʟᴀʜ ʙᴏᴛ ᴡʜᴀᴛꜱᴀᴘᴘ ᴍɪᴄʜɪᴇ ʏᴀɴɢ ᴅᴀᴘᴀᴛ ᴍᴇᴍᴇɴᴜʜɪ ᴋᴇʙᴜᴛᴜʜᴀɴ ᴅɪɢɪᴛᴀʟ ᴀɴᴅᴀ.

_ᴅᴏɴ'ᴛ ꜰᴏʀɢᴇᴛ ᴛᴏ ʀᴇɢɪꜱᴛᴇʀ ʏᴏᴜʀꜱᴇʟꜰ ɪɴ ᴛʜᴇ ᴍɪᴄʜɪᴇ *ᴅᴀᴛᴀʙᴀꜱᴇ* ꜱᴏ ᴛʜᴀᴛ ᴍɪᴄʜɪᴇ ᴄᴀɴ ʀᴇᴍᴇᴍʙᴇʀ ʏᴏᴜ ᴀꜱ ʟᴏɴɢ ᴀꜱ ᴍɪᴄʜɪᴇ ʀᴇᴍᴀɪɴꜱ ᴀᴄᴛɪᴠᴇ._

> *⌬〡ɴᴀᴍᴇ ʙᴏᴛ:* _${global.namebot}_
> *⌬〡ᴄʀᴇᴀᴛᴏʀ:* _${global.wm}_
> *⌬〡ʟɪʙʀᴀʀʏ:* _@ᴡʜɪsᴋᴇʏsᴏᴄᴋᴇᴛs_
> *⌬〡ғᴜɴᴄᴛɪᴏɴ:* _ᴀssɪsᴛᴀɴᴛ_
> *⌬〡ʟᴀɢᴜᴀɢᴇ:* _ɴᴏᴅᴇ.ᴊs_
> *⌬〡ᴛɪᴋᴛᴏᴋ:* _https://tiktok.com/@lveforce48_
 
ᴋᴇᴛɪᴋ *.sᴏsᴍᴇᴅ*
ᴜɴᴛᴜᴋ ᴍᴇʟɪʜᴀᴛ ɪɴғᴏ ᴏᴡɴᴇʀ
ᴋᴇᴛɪᴋ *.ᴀʙᴏᴜᴛ*
ᴜɴᴛᴜᴋ ᴍᴇʟɪʜᴀᴛ ɪɴғᴏ ʙᴏᴛ

┌  _¤ ᴜᴘᴛɪᴍᴇ : %uptime_
│  _¤ ʜᴀʀɪ : %week %weton_
│  _¤ ᴡᴀᴋᴛᴜ : %time_
│  _¤ ᴛᴀɴɢɢᴀʟ : %date_
│  _¤ ᴅᴀᴛᴀʙᴀsᴇ : Lᴏᴄᴀʟ (${detectSize(fs.statSync('database.json').size)})_
│  _¤ ᴠᴇʀsɪᴏɴ : %version_
└  _¤ ᴘʀᴇғɪx ᴜsᴇᴅ : *[ %p ]*_

‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎`.trimStart(),
  header: '─₍🍁₎❝┊ *%category* ',
  body: `┊꒱ ⛅   %cmd %islimit %isPremium `,
  footer: '╰─── –',
  after: `ᴍɪᴄʜɪᴇ ᴀɪ ᴍᴀᴅᴇ ʙʏ ғᴏʀx ғʏʏʀᴇ`,
}
let handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    let package = JSON.parse(await fs.promises.readFile(path.join(__dirname, '../package.json')).catch(_ => '{}'))
    let { exp, limit, level, role, registered } = global.db.data.users[m.sender]
    let { min, xp, max } = levelling.xpRange(level, global.multiplier)
    let name = registered ? global.db.data.users[m.sender].name : conn.getName(m.sender)
    let d = new Date(new Date + 3600000)
    let locale = 'id'
    const wib = moment.tz('Asia/Jakarta').format("HH:mm:ss")
    const wita = moment.tz('Asia/Makassar').format("HH:mm:ss")
    const wit = moment.tz('Asia/Jayapura').format("HH:mm:ss")
    let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5]
    let week = d.toLocaleDateString(locale, { weekday: 'long' })
    let date = d.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
    let dateIslamic = Intl.DateTimeFormat(locale + '-TN-u-ca-islamic', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(d)
    let time = d.toLocaleTimeString(locale, {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    })
    let _uptime = process.uptime() * 1000
    let _muptime
    if (process.send) {
      process.send('uptime')
      _muptime = await new Promise(resolve => {
        process.once('message', resolve)
        setTimeout(resolve, 1000)
      }) * 1000
    }
    
    let muptime = clockString(_muptime)
    let uptime = clockString(_uptime)
    let totalreg = Object.keys(global.db.data.users).length
    let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length
    let help = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => {
      return {
        help: Array.isArray(plugin.tags) ? plugin.help : [plugin.help],
        tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
        prefix: 'customPrefix' in plugin,
        limit: plugin.limit,
        premium: plugin.premium,
        enabled: !plugin.disabled,
      }
    })
  for (let plugin of help)
    if (plugin && 'tags' in plugin)
        for (let tag of plugin.tags)
            if (!(tag in tags) && tag) tags[tag] = tag
conn.menu = conn.menu ? conn.menu : {}
let before = conn.menu.before || defaultMenu.before
let header = conn.menu.header || defaultMenu.header
let body = conn.menu.body || defaultMenu.body
let user = global.db.data.users[m.sender];
let ppUrl = await conn.profilePictureUrl(m.sender, 'image').catch((_) => "https://telegra.ph/file/1dff1788814dd281170f8.jpg")
    let tum = await getBuffer(ppUrl)
    let thum = await canvas(name, Func.formatter(user.point), ppUrl)
let footer = conn.menu.footer || defaultMenu.footer
let after = conn.menu.after || (conn.user.jid == global.conn.user.jid ? '' : `Powered by https://wa.me/${global.conn.user.jid.split`@`[0]}`) + defaultMenu.after
let _text = [
    before,
    ...Object.keys(tags).map(tag => {
        return header.replace(/%category/g, tags[tag]) + '\n' + [
            ...help.filter(menu => menu.tags && menu.tags.includes(tag) && menu.help).map(menu => {
                return menu.help.map(help => {
                    return body.replace(/%cmd/g, menu.prefix ? help : '%p' + help)
                        .replace(/%islimit/g, menu.limit ? '(Ⓛ)' : '')
                        .replace(/%isPremium/g, menu.premium ? '(Ⓟ)' : '')
                        .trim()
                }).join('\n')
            }),
            footer
        ].join('\n')
    }),
    after
].join('\n')
text = typeof conn.menu == 'string' ? conn.menu : typeof conn.menu == 'object' ? _text : ''
    let replace = {
      '%': '%',
      p: _p, uptime, muptime,
      me: conn.getName(conn.user.jid),
      npmname: package.name,
      npmdesc: package.description,
      version: package.version,
      exp: exp - min,
      maxexp: xp,
      totalexp: exp,
      xp4levelup: max - exp,
      github: package.homepage ? package.homepage.url || package.homepage : '[unknown github url]',
      level, limit, name, weton, week, date, dateIslamic, wib, wit, wita, time, totalreg, rtotalreg, role
    }
    text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name])
    let media = await prepareWAMessageMedia({ image: { url: 'https://telegra.ph/file/3a34bfa58714bdef500d9.jpg' } }, { upload: conn.waUploadToServer });
    let msg = generateWAMessageFromContent(m.chat, {
  viewOnceMessage: {
    message: {
      "messageContextInfo": {
        "deviceListMetadata": {},
        "deviceListMetadataVersion": 2
      },
      interactiveMessage: proto.Message.InteractiveMessage.create({
      	contextInfo: {
        	mentionedJid: [m.sender], 
        	isForwarded: true, 
	        forwardedNewsletterMessageInfo: {
			newsletterJid: '120363304910862561@newsletter',
			newsletterName: 'Pᴏᴡᴇʀᴇᴅ Bʏ : Fᴏʀx', 
			serverMessageId: -1
		},
	businessMessageForwardInfo: { businessOwnerJid: conn.decodeJid(conn.user.id) },
            externalAdReply: {  
                title: 'Dᴄᴏᴅᴇ Fᴏʀx', 
                thumbnailUrl: 'https://telegra.ph/file/a5d139bc80b084449006e.jpg', 
                sourceUrl: 'https://linkbio.co/ForxShop',
                mediaType: 1,
                renderLargerThumbnail: true
            }
          }, 
        body: proto.Message.InteractiveMessage.Body.create({
          text: text
        }),
        footer: proto.Message.InteractiveMessage.Footer.create({
          text: "Mɪᴄʜɪᴇ Bᴏᴛ Wᴀ Mᴀᴅᴇ Iɴ Fᴏʀx"
        }),
        header: proto.Message.InteractiveMessage.Header.create({
            title: `*${ucapan()} _@${m.sender.replace(/@.+/g, '')}_*`,
            subtitle: "Michie",
            hasMediaAttachment: true,...(await prepareWAMessageMedia({ image: thum } : { image: { url: 'https://telegra.ph/file/224be1ac38708bd5189c0.jpg' }, { upload: conn.waUploadToServer }))

          }),
        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
          buttons: [
                          {
              "name": "cta_url",
                    "buttonParamsJson": "{\"display_text\":\"🌸 TɪᴋTᴏᴋ\",\"url\":\"https://tiktok.com/lveforce48\",\"merchant_url\":\"https://tiktok.com/lveforce48/\"}"
            },
            {
            	"name": "quick_reply",
              "buttonParamsJson": "{\"display_text\":\"Sᴇɴsᴇɪ Bᴏᴛ Mɪᴄʜɪᴇ 👤\",\"id\":\".sensei\"}"
              },
          ],
        })
      })
    }
  }
}, { quoted : fverif })
await conn.sendFile(m.chat, "https://files.catbox.moe/gvj1o2.opus", "", null, m, true, {
 type: 'audioMessage',  
 ptt: true, contextInfo: { forwardingScore: 999, isForwarded: false, externalAdReply: {title: 'ᴍɪᴄʜɪᴇ ᴍᴜʟᴛɪᴅᴇᴠɪᴄᴇ', body: wm, sourceUrl: 'https://linkbio.co/ForxShop', thumbnail: await (await fetch(thumbnail)).buffer(),}}  
  })
return await conn.relayMessage(msg.key.remoteJid, msg.message, {
  messageId: msg.key.id
});
  } catch (e) {
    conn.reply(m.chat, 'Maaf, menu sedang error', m)
    throw e
  }
}
handler.help = ['all2']
handler.tags = ['main', 'info']
handler.command = /^(all2)$/i

handler.register = true
handler.exp = 3

module.exports = handler

function detectSize(bytes) {
    if (typeof bytes !== 'number' || bytes < 0) {
        throw new TypeError("Input must be a non-negative number");
    }

    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
}

async function getBuffer(url, options) {
	try {
		options ? options : {}
		const res = await axios({
			method: "get",
			url,
			headers: {
				'DNT': 1,
				'Upgrade-Insecure-Request': 1
			},
			...options,
			responseType: 'arraybuffer'
		})
		return res.data
	} catch (err) {
		return err
	}
}
function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}
async function canvas(nama, point, image) {
            // Load background and profile picture
            const bg = await loadImage('https://i.ibb.co/VCW1m56/image.jpg');
            const profilePic = await loadImage(image);

            // Register font
            registerFont(path.join('./lib/maxim.ttf'), { family: 'Maxim' });

            // Create canvas
            const canvas = createCanvas(bg.width, bg.height);
            const ctx = canvas.getContext('2d');

            // Draw background
            ctx.drawImage(bg, 0, 0, bg.width, bg.height);

            // Draw profile picture (centered and circular)
            const centerX = canvas.width / 1.35;
            const centerY = canvas.height / 1.92;
            const radius = canvas.width / 5.4;

            ctx.save();
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
            ctx.clip();
            ctx.drawImage(profilePic, centerX - radius, centerY - radius, radius * 2, radius * 2);
            ctx.restore();

            // Draw text on the left of pic
            const leftText = '© Dᴄᴏᴅᴇ Fᴏʀx'
            ctx.font = '20px "Maxim"';
            ctx.fillStyle = '#FFFFFF';
            ctx.fillText(leftText, centerX - radius - 285, centerY + 76);

            // Draw text below m.pushName
            const belowText = nama
            ctx.font = '27px "Maxim"';
            ctx.fillStyle = '#FFFFFF';
            ctx.textAlign = 'left';
            ctx.fillText(belowText, centerX - radius - 220, centerY - 15);

            ctx.font = '27px "Maxim"';
            ctx.fillStyle = '#FFFFFF'; // Yellow text color
            ctx.textAlign = 'left';
            ctx.fillText(point, centerX - radius - 220, centerY + 12);

            // Convert canvas to buffer and send as file
            const buffer = await canvas.toBuffer('image/jpeg');
            return buffer
            }

function toRupiah(angka) {

var saldo = '';

var angkarev = angka.toString().split('').reverse().join('');

for (var i = 0; i < angkarev.length; i++)

if (i % 3 == 0) saldo += angkarev.substr(i, 3) + '.';

return '' + saldo.split('', saldo.length - 1).reverse().join('');

}



function clockString(ms) {

  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)

  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60

  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60

  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')

}



function ucapan() {

    const time = moment.tz('Asia/Jakarta').format('HH');

    let res = "ᴋᴏᴋ ʙᴇʟᴜᴍ ᴛɪᴅᴜʀ ᴋᴀᴋ? 🥱";

    if (time >= 4) {

        res = "ᴘᴀɢɪ ᴋᴀᴋ 🌄";

    }

    if (time > 10) {

        res = "sɪᴀɴɢ ᴋᴀᴋ ☀️";

    }

    if (time >= 15) {

        res = "sᴏʀᴇ ᴋᴀᴋ 🌇";

    }

    if (time >= 18) {

        res = "ᴍᴀʟᴀᴍ ᴋᴀᴋ 🌙";

    }

    return res;

}