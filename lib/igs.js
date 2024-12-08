const fetch = require('node-fetch');

async function iGstalk(username) {
    try {
        const response = await fetch(`https://api.lolhuman.xyz/api/stalkig/${username}?apikey=Indraacode`);
        const data = await response.json();
        
        if (data && data.result) {
            const user = data.result;
            return {
                creator: 'Indraa Furina',
                status: true,
                stalkerInstagram: {
                    username: `${user.username}`,
                    fullname: user.fullname,
                    posts: user.posts,
                    followers: user.followers,
                    following: user.following,
                    bio: user.bio || '',
                }
            };
        } else {
            throw new Error('User not found or invalid data');
        }
    } catch (error) {
        return { error: true, message: error.message };
    }
}

module.exports = { iGstalk };