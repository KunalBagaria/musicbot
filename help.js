import Discord from 'discord.js'
import dotenv from 'dotenv'
const envFile = dotenv.config()
const trigger = envFile.PREFIX || process.env.PREFIX || '$'

const helpEmbed = () => {
    const embed = new Discord.MessageEmbed()
        .setColor('RANDOM')
        .setTitle('Commands for playing Music 24x7')
        .setImage('https://thumbor.forbes.com/thumbor/fit-in/1200x0/filters%3Aformat%28jpg%29/https%3A%2F%2Fspecials-images.forbesimg.com%2Fimageserve%2F750037840%2F0x0.jpg%3Ffit%3Dscale')
        .setDescription("This bot will automatically loop your singleton links")
        .addFields(
            {
                name: `➦ ${trigger}play link/search for video`,
                value: 'Plays your YouTube URLs or Keywords'
            },
            {
                name: `➦ ${trigger}stop`,
                value: 'Stops playing in your server'
            },
            {
                name: `➦ ${trigger}trending`,
                value: 'Plays a top trending video from YouTube'
            },
            {
              name: `➦ ${trigger}queue`,
              value: `Shows the queue for this server.`
            },
            {
              name: `➦ ${trigger}skip`,
              value: `Skips the current song.`
            }
        )
        .setFooter('This musicbot is made by Kunal Bagaria ● https://github.com/kb24x7/musicbot')
    return embed
}

export default helpEmbed
