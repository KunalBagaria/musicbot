import Discord from 'discord.js'
import ytdl from 'ytdl-core'

const getVideoInfo = async (url, message, reply) => {

    const info = await ytdl.getInfo(url)

    if (info && reply) {

        const thumbnailDetail = info.videoDetails.thumbnails.pop()
        const thumbnail = thumbnailDetail.url
        const title = info.videoDetails.title
        const isLive = info.videoDetails.isLive
        const creator = info.videoDetails.author
        const videoEmbed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setImage(thumbnail)
            .setDescription(`${isLive ? '🛑' : ''} Now playing${isLive ? '' : ' on an infinite loop'}:`)
            .setTitle(title)
            .setURL(url)
            .setFooter(`Published by ${creator.name}`)

        message.reply(videoEmbed)
        message.channel.stopTyping()
    }
}

export default getVideoInfo