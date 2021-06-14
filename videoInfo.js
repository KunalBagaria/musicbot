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
        .footer('This musicbot is made my Kunal Bagaria ● https://github.com/kb24x7/musicbot')

    message.reply(videoEmbed)
    message.channel.stopTyping(true)
}

export default getVideoInfo