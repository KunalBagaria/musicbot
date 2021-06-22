import { YouTube } from 'youtube-sr'
import Discord from 'discord.js'

const trending = async (message) => {
    const details = await YouTube.homepage()
    const video = await details[Math.floor(Math.random() * details.length)]
    if (video) {
        message.channel.stopTyping()
    } else {
        const notFoundEmbed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setTitle('No results found for trending videos')
        message.reply(notFoundEmbed)
        message.channel.stopTyping()
    }
    const url = `https://www.youtube.com/watch?v=${video?.id ? video?.id : 'dQw4w9WgXcQ'}`
    return url
}

export default trending