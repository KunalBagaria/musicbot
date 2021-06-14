import Discord from 'discord.js'
import ytdl from 'ytdl-core'

const getVideoInfo = async (url, message) => {
    const info = await ytdl.getInfo(url)
    const thumbnailDetail = info.videoDetails.thumbnails.pop()
    const thumbnail = thumbnailDetail.url
    const title = info.videoDetails.title
    const isLive = info.videoDetails.isLive

    const videoEmbed = new Discord.MessageEmbed()
        .setColor('RANDOM')
        .setImage(thumbnail)
        .setTitle(`${isLive ? '🛑' : ''} Now playing${isLive ? '' : ' on infinite loop'}:`)
        .setDescription(title)
        .setURL(url)

    message.reply(videoEmbed)
}

export default getVideoInfo