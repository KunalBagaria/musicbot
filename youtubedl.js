import youtubedl from 'youtube-dl-exec'
import Discord from 'discord.js'

const youtubeUrl = async (args, message, reply) => {
    let url
    try {
        if (reply) {
            const output = await youtubedl(args, {
                dumpJson: true
            })
            if (output && output?.is_live) {
                const liveEmbed = new Discord.MessageEmbed()
                    .setColor('RANDOM')
                    .setTitle('Sorry, live videos are not supported yet')
                message.reply(liveEmbed)
            } else if (output) {
                const videoEmbed = new Discord.MessageEmbed()
                    .setColor('RANDOM')
                    .setTitle(output.title)
                    .setDescription('Now Playing')
                    .setURL(args)
                    .setImage(output.thumbnail)
                    .setFooter(`Published by ${output.uploader}`)
                message.reply(videoEmbed)
            }
        }
        const audio = await youtubedl(args, {
            format: 'bestaudio',
            getUrl: true
        })
        url = audio ? audio : await youtubeUrl(args, message, reply)
        message.channel.stopTyping()
    } catch (e) {
        console.log(e)
    }
    return url
}

export default youtubeUrl