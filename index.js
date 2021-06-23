import ytdl from 'ytdl-core'
import Discord from 'discord.js'
import helpEmbed from './help.js'
import searchInfo from './search.js'
import trending from './trending.js'
import dotenv from 'dotenv'
import getVideoInfo from './videoInfo.js'

const client = new Discord.Client()

client.on('ready', async () => {
    console.log("I'm ready")
    client.user.setActivity(`Music 24x7 🎸`, {
        type: "PLAYING"
    })
})

const randomTimeGen = () => {
    return Math.floor(Math.random() * (15000 - 3000) + 3000)
}

client.on('message', async (message) => {
    let messageContent = message.content.toLowerCase()
    if (message.author.bot) return
    if (messageContent.startsWith('$play') && message.member.voice.channel) {

        const playMusic = async () => {
            try {

                message.channel.startTyping()
                setTimeout(() => message.channel.stopTyping(), 10000)

                const args = message.content.split(' ').slice(1).join(" ")
                const regexp = /(?:.+?)?(?:\/v\/|watch\/|\?v=|\&v=|youtu\.be\/|\/v=|^youtu\.be\/)([a-zA-Z0-9_-]{11})+/;
                const urlexp = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;

                const channel = message.member.voice.channel
                const connection = await channel.join();

                const bitrate = message.member.voice.channel.bitrate
                const myMessage = message

                if (regexp.test(args)) {
                    const playMyMusic = async (reply) => {
                        // const audio = await youtubeUrl(args, myMessage, reply)
                        // if (audio) {
                        // const dispatcher = connection.play(await ytdl(args))
                            const dispatcher = connection.play(ytdl(args, {
                                highWaterMark: 1 << 25
                            }), {
                                bitrate: bitrate
                            })
                            dispatcher.on('start', () => getVideoInfo(args, myMessage, reply))
                            dispatcher.on('finish', () => {
                                setTimeout(() => {
                                    playMyMusic(false)
                                }, randomTimeGen())
                            })
                        // }
                    }
                    playMyMusic(true)
                } else if (urlexp.test(args)) {
                    const linkEmbed = new Discord.MessageEmbed()
                        .setColor('RANDOM')
                        .setTitle('Sorry, only YouTube links are supported right now')
                    message.reply(linkEmbed)
                } else {
                    const url = await searchInfo(args, myMessage, true)
                    const playMyAudio = async () => {
                        // const audio = await youtubeUrl(url, myMessage, false)
                        // if (audio) {
                            const dispatcher = connection.play(ytdl(url, {
                                highWaterMark: 1 << 25
                            }), {
                                bitrate: bitrate
                            })
                            dispatcher.on('finish', () => {
                                setTimeout(() => {
                                    playMyAudio()
                                }, randomTimeGen())
                            })
                        // }
                    }
                    playMyAudio()
                }
            } catch (e) {
                console.log(e)
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
            const trendChannel = message.member.voice.channel
            const connection = await trendChannel.join()
            const url = await trending(message)
            // const audio = await youtubeUrl(url, message, true)
            // if (audio) {
                const dispatcher = connection.play(ytdl(url, {
                    highWaterMark: 1 << 25
                }), {
                    bitrate: trendChannel.bitrate
                })
                dispatcher.on('finish', () => {
                    trendChannel.leave()
                })
            // }
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