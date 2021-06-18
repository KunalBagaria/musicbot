import Discord from 'discord.js'
import getVideoInfo from './videoInfo.js'
import helpEmbed from './help.js'
import searchInfo from './search.js'
import trending from './trending.js'
import dotenv from 'dotenv'
import getInfo from './getUrl.js'

const client = new Discord.Client()

client.on('ready', async () => {
    console.log("I'm ready")
    client.user.setActivity(`Music 24x7 🎸`, {
        type: "PLAYING"
    })
})

client.on('message', async (message) => {
    let messageContent = message.content.toLowerCase()
    if (message.author.bot) return
    if (messageContent.startsWith('$play') && message.member.voice.channel) {
        const playMusic = async () => {
            try {
                message.channel.startTyping()
                setTimeout(() => message.channel.stopTyping(), 10000)
                const connection = await message.member.voice.channel.join();
                const args = message.content.split(' ').slice(1).join(" ")
                const regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
                if (regexp.test(args)) {
                    const audio = await getInfo(args)
                    const dispatcher = connection.play(audio, {
                        bitrate: 128000
                    })
                    dispatcher.on('start', () => getVideoInfo(args, message))
                    dispatcher.on('finish', () => {
                        setTimeout(() => {
                            message.member.voice.channel.leave()
                            playMusic()
                        }, Math.floor(Math.random() * 15))
                    })
                } else {
                    const url = await searchInfo(args, message)
                    const audio = await getInfo(url)
                    const dispatcher = connection.play(audio, {
                        bitrate: 128000
                    })
                    dispatcher.on('finish', () => {
                        message.member.voice.channel.leave()
                        setTimeout(() => {
                            playMusic()
                        }, Math.floor(Math.random() * 15))
                    })
                }
            } catch (e) {
                console.log(e)
                playMusic()
            }
        }
        playMusic()
    } else if ((messageContent.startsWith('$stop') || messageContent.startsWith('$leave')) && message.member.voice.channel) {
        try {
            message.member.voice.channel.leave()
            const leaveEmbed = new Discord.MessageEmbed()
                .setTitle('Now leaving your Voice Channel')
                .setColor('RANDOM')
            message.reply(leaveEmbed)
        } catch (e) {
            console.log(e)
            const leaveEmbed = new Discord.MessageEmbed()
                .setTitle("There was an error, I don't think I'm in your voice channel.")
                .setColor('RED')
            message.reply(leaveEmbed)
        }
    } else if (messageContent === '$help') {
        message.reply(helpEmbed())
    } else if (messageContent === '$trending' && message.member.voice.channel) {
        try {
            message.channel.startTyping()
            setTimeout(() => message.channel.stopTyping(), 10000)
            const connection = await message.member.voice.channel.join()
            const url = await trending(message)
            const audio = await getInfo(url)
            const dispatcher = connection.play(audio, {
                bitrate: 128000
            })
            dispatcher.on('finish', () => {
                message.member.voice.channel.leave()
            })
        } catch (e) {
            console.log(e)
        }
    }
})

const envFile = dotenv.config()

if (envFile.TOKEN) {
    client.login(envFile.TOKEN)
} else {
    client.login(process.env.TOKEN)
}

process.on('uncaughtException', (err) => {
    console.error('There was an uncaught error', err)
})