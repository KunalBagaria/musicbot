import Discord from 'discord.js'
import helpEmbed from './help.js'
import searchInfo from './search.js'
import trending from './trending.js'
import dotenv from 'dotenv'
import youtubeUrl from './youtubedl.js'
import { broadcastAudio, skipFile } from './localAudio.js'

const envFile = dotenv.config()
const client = new Discord.Client()

const trigger = envFile.PREFIX || process.env.PREFIX || '$'

const queue = []
let songNumber = 0
let broadcast

const playMusic = async (message, skip) => {
    try {
        message.channel.startTyping()
        setTimeout(() => message.channel.stopTyping(), 10000)

        const regexp = /(?:.+?)?(?:\/v\/|watch\/|\?v=|\&v=|youtu\.be\/|\/v=|^youtu\.be\/)([a-zA-Z0-9_-]{11})+/;
        const urlexp = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;
        const channel = message.member.voice.channel
        const connection = await channel.join();
        const bitrate = message.member.voice.channel.bitrate
        const myMessage = message

        const playMyAudio = async (reply) => {
            let audio = ''
            let song = queue[songNumber]

            if (regexp.test(song)) {
                audio = await youtubeUrl(song, myMessage, false)
            } else if (urlexp.test(song)) {
                const linkEmbed = new Discord.MessageEmbed()
                    .setColor('RANDOM')
                    .setTitle('Sorry, only YouTube links are supported right now')
                myMessage.reply(linkEmbed)
            } else {
                const url = await searchInfo(song, myMessage, reply)
                audio = await youtubeUrl(url, myMessage, false)
            }

            if (!audio) {
                audio = await youtubeUrl(url, myMessage, false)
            }

            const dispatcher = connection.play(audio, {
                bitrate: bitrate
            })
            dispatcher.on('finish', () => {
                if (songNumber + 1 === queue.length) {
                    songNumber = 0
                } else {
                    songNumber++
                }
                setTimeout(() => {
                    playMyAudio(true)
                }, randomTimeGen())
            })
        }

        if (!queue[0]) {
            songNumber = 0
            queue.push(myMessage.content.split(' ').slice(1).join(" "))
            playMyAudio(true)
            myMessage.channel.stopTyping()
        } else if (skip) {
            if (songNumber + 1 === queue.length) {
                songNumber = 0
            } else {
                songNumber++
            }
            playMyAudio(true)
        } else {
            queue.push(myMessage.content.split(' ').slice(1).join(" "))
            const queueAddEmbed = new Discord.MessageEmbed()
                .setColor('RANDOM')
                .setTitle(`**${message.content.split(' ').slice(1).join(" ").toUpperCase()}** has been added to queue`)
                .setFooter(`Requested by ${myMessage.author.tag}`)
                .setTimestamp()
            myMessage.reply(queueAddEmbed)
            myMessage.channel.stopTyping()
        }
    } catch (e) {
        console.log(e)
    }
}


client.on('ready', async () => {
    console.log("I'm ready")
    client.user.setActivity(`Music 24x7 🎸`, {
        type: "PLAYING"
    })
    broadcast = client.voice.createBroadcast();
})

const randomTimeGen = () => {
    return Math.floor(Math.random() * (15000 - 3000) + 3000)
}

client.on('message', async (message) => {
    let messageContent = message.content.toLowerCase()
    if (message.author.bot) return
    if (messageContent.startsWith(`${trigger}play`) && message.member.voice.channel) {
        playMusic(message, false)
    } else if (messageContent === `${trigger}skip` && message.member.voice.channel) {
        playMusic(message, true)
        const skipEmbed = new Discord.MessageEmbed()
          .setTitle('The current video has been skipped')
          .setColor('RANDOM')
        message.reply(skipEmbed)
    } else if ((messageContent.startsWith(`${trigger}stop`) || messageContent.startsWith(`${trigger}leave`)) && message.member.voice.channel) {
        try {
            message.member.voice.channel.leave()
            queue.splice(0, queue.length)
            songNumber = 0
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
    } else if (messageContent === `${trigger}help`) {
        message.reply(helpEmbed())
    } else if (messageContent === `${trigger}trending` && message.member.voice.channel) {
        try {
            message.channel.startTyping()
            setTimeout(() => message.channel.stopTyping(), 10000)
            const trendChannel = message.member.voice.channel
            const connection = await trendChannel.join()
            const url = await trending(message)
            const audio = await youtubeUrl(url, message, true)
            if (audio) {
                const dispatcher = connection.play(audio, {
                    bitrate: trendChannel.bitrate
                })
                dispatcher.on('finish', () => {
                    trendChannel.leave()
                })
            }
        } catch (e) {
            console.log(e)
        }
    } else if (messageContent === `${trigger}reset`) {
        queue.splice(0, queue.length)
        songNumber = 0
        console.log(queue)
    } else if (messageContent === `${trigger}queue` && message.member.voice.channel) {
        const queueEmbed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setTitle('Queue for this server')
        if (queue[0]) {
            queue.forEach((song) => {
                queueEmbed.addFields({
                    name: song.toUpperCase(),
                    value: '\u200B'
                })
            })
        } else {
            queueEmbed.setDescription('Nothing on the queue :/')
        }
        message.reply(queueEmbed)
    } else if (messageContent === `${trigger}broadcast` && message.member.voice.channel) {
      broadcastAudio(message, false)
      const broadcastEmbed = new Discord.MessageEmbed()
        .setTitle('Now broadcasting audio')
        .setColor('RANDOM')
      message.reply(broadcastEmbed)
    } else if (messageContent === `${trigger}change`) {
      skipFile()
      const skipEmbed = new Discord.MessageEmbed()
        .setTitle('Now skipping file')
        .setColor('RANDOM')
      message.reply(skipEmbed)
    }
})


const token = envFile.TOKEN || process.env.TOKEN
client.login(token)

process.on('uncaughtException', (err) => {
    console.error('There was an uncaught error', err)
})
