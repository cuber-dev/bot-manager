const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const app = express();
const port = process.env.PORT || 5000;

const { maxToken , verifyYtUrl } = require('./bots/max');


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


function extractReq(bot){
    const chatId = bot.chat.id;
    const message = bot.text;
    const userCommand = message.split(/\s+/i)[0].toLowerCase();
    const userMessage = message.split(/\s+/i)[1];
    return {
        chatId,
        message,
        userCommand,
        userMessage
    }
}

const sendMsg = (bot,id, text) => bot.sendMessage(id,text)
const random = () => Math.random()
const maxBot = new TelegramBot(maxToken, { polling: true });




maxBot.on('message', async (msg) => {
    const { chatId, userCommand, userMessage } = extractReq(msg);

    let text = '';
    console.log(msg.text)
    // Check if userCommand starts with certain strings
    if (userCommand.startsWith('/start') || userCommand.startsWith('start')) {
        text = `Introducing Maxpark, the innovative bot designed by cuber-dev! Maxpark is your ultimate YouTube companion, adept at effortlessly downloading both videos and audio content. With its seamless integration, you can now enjoy your favorite media offline, thanks to Maxpark's exceptional capabilities. Say goodbye to buffering and hello to convenience, as Maxpark simplifies your entertainment experience. i can help you with downloading youtube videos and audios and i am also able to genearte random texts , images. i am still in development , if you have any questions or suggestions ,please feel free to contact my author at github , telegram : ID : cuber-dev. i hope you enjoy using me. thanks for using me. /help for help`
        
        sendMsg(maxBot, chatId, text);
    } else if (userCommand.startsWith('/help') || userCommand.startsWith('help')) {
        const availableCommands = [
                        '/start - Introduction about the bot',
                        '/help - Show available commands',
                        '/random_text - Generate random text',
                        '/random_image - Generate random image',
                        '/random_image <width> <height> - Generate random image with width and height',
                        '/download_yt_audio <url> - Download audio from youtube',
                        '/download_yt_video <url> - Download video from youtube',
                    ];
        const helpText = `Available commands:\n${availableCommands.join('\n')}`;
        sendMsg(maxBot, chatId, helpText);
    } else if (userCommand.startsWith('/random_text')) {
        text = generateRandomText();
        sendMsg(maxBot, chatId, text);
    } else if (userCommand.startsWith('/random_image')) {
        sendMsg(maxBot, chatId, 'Please wait, generating image...');
        maxBot.sendPhoto(chatId, randomImage(msg.text));
    } else if (userCommand.startsWith('/download_yt')) {
        await downloadYtVideo(userCommand, userMessage, chatId);
    }

    if (msg.new_chat_members) {
        const chatId = msg.chat.id;
        const newMembers = msg.new_chat_members;

        // Send a greeting message to each new member
        for (const newMember of newMembers) {
            const userName = newMember.username || newMember.first_name || 'New Member';
            const greeting = `Welcome to the group, ${userName}! Feel free to introduce yourself and use me for downloading things like videos and audios and images.\n /help for help`;
            sendMsg(maxBot, chatId, greeting);
        }
    }
});


async function downloadYtVideo(userCommand,userMessage,chatId){
    const URI = `https://yt-vd-bot.onrender.com/download`
        
        if(!userMessage){
            maxBot.sendMessage(chatId, 'Please enter a youtube video url')
            return 
        } 

        const ytUrl = userMessage
        const response = await verifyYtUrl(ytUrl)
        if(!response){
            maxBot.sendMessage(chatId, 'Please enter a valid youtube url')
            return
        }
            if (userCommand.startsWith('/download_yt_audio')) {
                try {
                    maxBot.sendMessage(chatId, 'Audio is downloading, please wait...')
                    maxBot.sendDocument(chatId, `${URI}/audio?url=${ytUrl}`);
                } catch (error) {
                    maxBot.sendMessage(chatId,'Error downloading audio (500)');
                }
            } else if (userCommand.startsWith('/download_yt_video')) {
                try {
                    maxBot.sendMessage(chatId, 'video is downloading, please wait...')
                    maxBot.sendDocument(chatId, `${URI}/video?url=${ytUrl}&pixels=720`);

                } catch (error) {
                    maxBot.sendMessage(chatId,'Error downloading video (500)');
                }
            }
}
function randomImage(text){
    const w = text.split(/\s+/i)[1]
    const h = text.split(/\s+/i)[2]
    if(w && h){
        const image = `https://unsplash.it/${w}/${h}`
        return image;
    }
    const image = Math.floor(Math.random() * 3000);
    const randomImage = `https://picsum.photos/${image}`;
    return randomImage;
}

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})