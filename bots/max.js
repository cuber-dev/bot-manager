
const ytdl = require('ytdl-core')


const maxToken = '6008896046:AAHiWIpsfQiec5Y-KCFVNjnFaoP9hKQwQ9o';

const verifyYtUrl = async (url) => {
    return ytdl.validateURL(url);
}

module.exports = {
    maxToken,
    verifyYtUrl
}