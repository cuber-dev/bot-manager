const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const {
    generateRandomText,
    randomImage,
    downloadYtVideo,
    getProfilePic,
    labels,
} = require('./utils/utils')
const app = express();
const port = process.env.PORT || 5000;

const { maxToken , verifyYtUrl } = require('./bots/max');

app.get('/', (req, res) => {
    const botResponse = "Thanks for waking me up :)";
    const response = { response: botResponse };
    res.json(response);
});


function extractReq(bot){
    const chatId = bot.chat.id;
    const message = bot.text || '';
    const userCommand = message.split(/\s+/i)[0].toLowerCase() || '';
    const userMessage = message.split(/\s+/i)[1] || '';
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
    let senderMention = '';
    const availableCommands = [
        '/start - Introduction about the bot',
        '/help - Show available commands',
        '/random_text - Generate random text',
        '/random_image - Generate random image',
        '/random_image <width> <height> - Generate random image with width and height',
        '/pic_labels - show available labels',
        '/pic <username> <label> - generates a profile pic with username and a label(enter /pic_help for availabel labels) ',
        '/download_yt_audio <url> - Download audio from youtube',
        '/download_yt_video <url> - Download video from youtube',
        'if you cant recieve my messages : please wake me up here -> https://bot-manager-r4kp.onrender.com/'
    ];
    console.log(msg.text)
    // If the message is from a group chat, construct the mention
    if (msg.chat.type === 'group' || msg.chat.type === 'supergroup') {
        const senderFirstName = msg.from.username || msg.name || "unknown_user";

        senderMention = `@${senderFirstName}`;
    }  
    // Check if userCommand starts with certain strings
    if (userCommand.startsWith('/start') || userCommand.startsWith('start')) {
        text = `${senderMention} Introducing Maxpark, the innovative bot designed by cuber-dev! Maxpark is your ultimate YouTube companion, adept at effortlessly downloading both videos and audio content. With its seamless integration, you can now enjoy your favorite media offline, thanks to Maxpark's exceptional capabilities. Say goodbye to buffering and hello to convenience, as Maxpark simplifies your entertainment experience. i can help you with downloading youtube videos and audios and i am also able to genearte random texts , images. i am still in development , if you have any questions or suggestions ,please feel free to contact my author at github , telegram : ID : cuber-dev. i hope you enjoy using me. thanks for using me. /help for help. if you cant recieve my messages : please wake me up here -> https://bot-manager-r4kp.onrender.com/`
        
        sendMsg(maxBot, chatId, text);
    } else if (userCommand.startsWith('/help') || userCommand.startsWith('help')) {
        const helpText = `${senderMention} Available commands:\n${availableCommands.join('\n')}`;
        sendMsg(maxBot, chatId, helpText);
    } else if (userCommand.startsWith('/random_text')) {
        text = senderMention + " " + generateRandomText();
        sendMsg(maxBot, chatId, text);
    } else if (userCommand.startsWith('/random_image')) {
        sendMsg(maxBot, chatId, `${senderMention} Please wait, generating image...`);
        setTimeout(() => {
            maxBot.sendPhoto(chatId, randomImage(msg.text));
        },100)
    } else if (userCommand.startsWith('/download_yt')) {
        await downloadYtVideo(maxBot,userCommand, userMessage, chatId, senderMention);
    }else if (userCommand.startsWith('/pic_labels')) {
        const labelsText = `${senderMention} Available labels:\n${labels.join('\n')} , now enter the command /pic <yourname> <label>`;
        sendMsg(maxBot, chatId, labelsText)
    } else if (userCommand.startsWith('/pic')) {
        await handlePic(msg,chatId,senderMention)
    }

    if (msg.new_chat_members) {
        const chatId = msg.chat.id;
        const newMembers = msg.new_chat_members;
        
        // Send a greeting message to each new member
        for (const newMember of newMembers) {
            const userName = newMember.username || newMember.first_name || 'New Member';
            if(userName){
                const greeting = `Welcome to the group, @${userName}! Feel free to introduce yourself and use me for downloading things like videos and audios and images.\n /help for help`;
                sendMsg(maxBot, chatId, greeting);
            }
        }
    }
});

async function handlePic(msg,chatId,senderMention){
    if(!msg.text.split(/\s+/g)[1]){
        return sendMsg(maxBot, chatId, `${senderMention} please enter the name and label `)
    }
    if(!msg.text.split(/\s+/g)[2]){
        return sendMsg(maxBot, chatId, `${senderMention} please enter the label `)
    }
    
    const userName = msg.text.split(/\s+/g)[1];
    const pathType = msg.text.split(/\s+/g)[2];
    
    const url = await getProfilePic(userName,pathType);
        let response = ''
        console.log(url)
        if(url === 'label_mismatch'){
            return sendMsg(maxBot, chatId, `${senderMention} please enter the available labels only... `)
        }
        if(url && url !== 'label_mismatch'){
            sendMsg(maxBot, chatId, `${senderMention} Please wait, generating profile pic with label ${msg.text.split(/\s+/g)[2]} ...`);
            setTimeout(async () => {
                response = await maxBot.sendPhoto(chatId, url);
                if (response) {
                    sendMsg(maxBot, chatId,`${senderMention} you profile pic is ready , please check it :)`);
                } else {
                    sendMsg(maxBot, chatId, `${senderMention} There was an issue generating the profile pic :(`);
                }
            },100)
        }
}

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})