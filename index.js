import Discord from 'discord.js'
import ytdl from 'ytdl-core'
import getVideoInfo from './videoInfo.js'
import dotenv from 'dotenv'

dotenv.config() // Comment this on production for services like Heroku, etc.

const client = new Discord.Client()

client.on('ready', async () => {
    console.log("I'm ready")
})

client.on('message', async (message) => {
    let messageContent = message.content.toLowerCase()
    if (message.author.bot || !message.member.voice.channel) return
    if (messageContent.startsWith('$play')) {
        const playMusic = async () => {
            try {
                const connection = await message.member.voice.channel.join();
                const args = message.content.split(' ').slice(1)
                const randomNum = () => Math.floor(Math.random() * (7000 - 4000) + 4000)
                const dispatcher = connection.play(ytdl(args.join(" ")), { highWaterMark: randomNum() })
                dispatcher.on('start', () => getVideoInfo(args.join(" "), message))
                dispatcher.on('finish', () => playMusic())
                playMusic()
            } catch (e) {
                console.log(e)
                playMusic()
            }
        }
    } else if (messageContent.startsWith('$stop') || messageContent.startsWith('$leave')) {
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
    }
})


client.login(process.env.TOKEN)