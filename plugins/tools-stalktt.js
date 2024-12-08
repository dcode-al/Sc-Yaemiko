const express = require('express');
const fetch = require('node-fetch');

async function tiktokStalk(username) {
  try {
    const apiKey = 'furinafree';
    const response = await fetch(`https://ndra-furinaa-api.vercel.app/api/tiktok_stalk?username=${username}&apiKey=${apiKey}`);
    const data = await response.json();

    if (data.status !== 200) {
      throw new Error('Failed to fetch TikTok data');
    }

    const userInfo = data.result.data;
    const userDetailResult = {
      username: userInfo.uniqueId || 'N/A',
      nickname: userInfo.nickname || 'N/A',
      bio: userInfo.signature || 'N/A',
      followers: userInfo.followerCount || 0,
      following: userInfo.followingCount || 0,
      likes: userInfo.heartCount || 0,
      profilePicture: userInfo.avatarLarger || userInfo.avatarMedium || userInfo.avatarThumb || 'N/A',
      friends: userInfo.friendCount || 0,
      region: userInfo.region || 'N/A',
      videoCount: userInfo.videoCount || 0
    };

    return userDetailResult;
  } catch (err) {
    console.error(err);
    return { status: 'error', message: String(err) };
  }
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.reply(m.chat, `Usage: ${usedPrefix}${command} <username>`, m);
  }

  conn.sendMessage(m.chat, { react: '🕐', key: m.key });

  const result = await tiktokStalk(text);

  if (result.status === 'error') {
    return conn.reply(m.chat, result.message, m);
  }

  const response = `
*STALKER TIKTOK*
Nickname: ${result.nickname}
Bio: ${result.bio}
Followers: ${result.followers}
Following: ${result.following}
Likes: ${result.likes}
Friends: ${result.friends}
Region: ${result.region}
Videos: ${result.videoCount}
  `;

  if (result.profilePicture !== 'N/A') {
    await conn.sendFile(m.chat, result.profilePicture, 'profile.jpg', response, m);
  } else {
    conn.reply(m.chat, response, m);
  }
};

handler.help = ['tiktokstalk'];
handler.tags = ['tools'];
handler.command = /^tiktokstalk|stalktt|ttstalk$/i;

module.exports = handler;