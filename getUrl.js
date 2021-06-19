import Discord from 'discord.js'
import ytdl from 'ytdl-core'


const getInfo = async (args, message) => {
    const info = await ytdl.getInfo(args)
    if (info.videoDetails.isLive) {
        const liveEmbed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setTitle('Sorry, Live videos are not supported yet.')
        if (message) {
            message.reply(liveEmbed)
        }
    }
    const formats = info.formats
    const audioFormats = []
    let url = ''
    formats.forEach((format) => {
        if (!format.hasVideo && format.container !== 'mp4') {
            audioFormats.push(format)
        }
    })
    audioFormats.forEach((format) => {
        if (format.audioBitrate > 100) {
            url = format.url
        }
    })
    if (!url) {
        url = audioFormats[0].url
    }
    return url
}

getInfo()

export default getInfo