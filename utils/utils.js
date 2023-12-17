let labels  = [
    "Identicon",
    "Botts",
    "Pixel-art",
    "Pixel-art-neutral",
    "Adventure",
    "Thumb",
    'Icon',
    'Adventurer-neutral',
    'Avaatars',
    'Avaatars-neutral',
    'Big-ears',
    'Big-ears-neutral',
    'Big-smile',
    'Botts-neutral',
    'Croodles',
    'Croodles-neutral',
    'Fun-emoji',
    'Lorelei',
    'Lorelei-neutral',
    'Shapes'
    ];
let paths = [
    '5.x/identicon',
    '5.x/bottts',
    '4.x/pixel-art',
    '5.x/pixel-art-neutral',
    '5.x/adventurer',
    '5.x/thumbs',
    '5.x/icons',
    '5.x/adventurer-neutral',
    '5.x/avataaars',
    '5.x/avataaars-neutral',
    '5.x/big-ears',
    '5.x/big-ears-neutral',
    '5.x/big-smile',
    '5.x/bottts-neutral',
    '5.x/croodles',
    '5.x/croodles-neutral',
    '5.x/fun-emoji',
    '5.x/lorelei',
    '5.x/lorelei-neutral',
    '5.x/shapes'
  ];

let formatType = 'jpg';

async function getProfilePicUrl(userName,newPath){
    const url =  `https://api.dicebear.com/${paths[newPath]}/${formatType}?seed=${userName}`;
    return url     
}
async function getProfilePic(userName,labelType){
    let newPath = labels.length + 2 


    if(userName && labelType){
        labels.forEach((label,i) => { 
            if(label.toLowerCase() === labelType.toLowerCase().trim()){
                newPath = i; 
            }
        })
        if(labels.includes(labels[newPath])){
            const url = await getProfilePicUrl(userName,newPath);
            return url 
        }else {
            return 'label_mismatch'
        }
    } 
    return null
  } 



  function generateRandomText() {
    const texts = [
      'Hello, world!',
      'This is a random message.',
      'Coding is fun!',
      'Explore the possibilities.',
      'Randomness at its best.',
    ];
  
    const randomIndex = Math.floor(Math.random() * texts.length);
    return texts[randomIndex];
}
  
const { verifyYtUrl } = require('../bots/max');

async function downloadYtVideo(bot,userCommand,userMessage,chatId ,senderMention){
    const URI = `http://yt-vd-downloader.nandhuadepu.repl.co/download`
        
        if(!userMessage){
            bot.sendMessage(chatId, `${senderMention} Please enter a youtube video url ,
            ex : /download_yt_video https://www.youtube.com/watch?v=XXXX`)
            return 
        } 

        const ytUrl = userMessage
        const response = await verifyYtUrl(ytUrl)
        if(!response){
            bot.sendMessage(chatId, `${senderMention} Please enter a valid youtube url,
            ex : /download_yt_video https://www.youtube.com/watch?v=XXXX`)
            return
        }
            if (userCommand.startsWith('/download_yt_audio')) {
                try {
                    bot.sendMessage(chatId, `${senderMention} Audio is downloading, please wait...`)
                    const response = await bot.sendDocument(chatId, `${URI}/audio?url=${ytUrl}`);

                    if (response) {
                        bot.sendMessage(chatId, `${senderMention} Audio is downloaded successfully`);
                    } else {
                        bot.sendMessage(chatId, `${senderMention} There was an issue downloading the audio.`);
                    }
                }
                 catch (error) {
                   
 bot.sendMessage(chatId,`${senderMention} Error downloading audio (500)`);

console.log(error)
                }
            } else if (userCommand.startsWith('/download_yt_video')) {
                try {
                    bot.sendMessage(chatId, `${senderMention} video is downloading, please wait...`)
                    const response = await bot.sendDocument(chatId, `${URI}/video?url=${ytUrl}&pixels=720`);
                   
                    if (response) {
                        bot.sendMessage(chatId, `${senderMention} Video is downloaded successfully`);
                    } else {
                        bot.sendMessage(chatId, `${senderMention} There was an issue downloading the video.`);
                    }
                } catch (error) {
                   
 bot.sendMessage(chatId,`${senderMention} Error downloading video (500)`);

console.log(error)
                }
            }
}
function randomImage(text){
    text = text.replace('@Maxpark09_bot','')
    const w = text.split(/\s+/i)[1]
    const h = text.split(/\s+/i)[2]
    if(w && h){
        const image = `https://unsplash.it/${w}/${h}`
        return image;
    }
    const image = Math.floor(Math.random() * 5000);
    const randomImage = `https://picsum.photos/${image}`;
    return randomImage;
}




module.exports = {
    randomImage,
    downloadYtVideo,
    getProfilePic,
    generateRandomText,
    labels,
}