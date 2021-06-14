import Discord from 'discord.js'
import ytdl from 'ytdl-core'
import getVideoInfo from './videoInfo.js'
import helpEmbed from './help.js'
import dotenv from 'dotenv'

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
                message.channel.startTyping(true)
                setTimeout(() => message.channel.startTyping(false))
                const connection = await message.member.voice.channel.join();
                const args = message.content.split(' ').slice(1)
                const randomNum = () => Math.floor(Math.random() * (7000 - 4000) + 4000)
                const dispatcher = connection.play(ytdl(args.join(" ")), { highWaterMark: randomNum() })
                dispatcher.on('start', () => getVideoInfo(args.join(" "), message))
                dispatcher.on('finish', () => playMusic())
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
    }
})

const envFile = dotenv.config()

if (envFile.TOKEN) {
    client.login(envFile.TOKEN)
} else {
    client.login(process.env.TOKEN)
}