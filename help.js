import Discord from 'discord.js'

const helpEmbed = () => {
    const embed = new Discord.MessageEmbed()
        .setColor('RANDOM')
        .setTitle('Commands for playing Music 24x7')
        .setImage('https://thumbor.forbes.com/thumbor/fit-in/1200x0/filters%3Aformat%28jpg%29/https%3A%2F%2Fspecials-images.forbesimg.com%2Fimageserve%2F750037840%2F0x0.jpg%3Ffit%3Dscale')
        .setDescription("This bot will automatically loop your singleton links")
        .addFields(
            {
                name: '➦ $play link',
                value: 'Plays your YouTube URLs. Keyword support coming soon!'
            },
            {
                name: '➦ $stop',
                value: 'Stops playing in your server'
            }
        )
    return embed
}

export default helpEmbed