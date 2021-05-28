import Discord from 'discord.js'

const client = new Discord.Client()
const trigger = '$'

client.on('ready', () => {
    console.log("I'm ready")
})

client.on('message', async (message) => {
    if (message.author.bot) return
    if (message.content.startsWith(trigger)) {
        let command = message.content.split(trigger)[1].toLowerCase()
        if (command.includes('play') && message.member.voice.channel) {
            let toPlayUrl = message.content.split('play ')[1]
            if (toPlayUrl) {
                const connection = await message.member.voice.channel.join();
                const playSong = async () => {
                    const dispatcher = connection.play(toPlayUrl, { highWaterMark: 240 })
                    dispatcher.on('start', () => {
                        console.log(toPlayUrl, 'is now playing!');
                    })
                    dispatcher.on('finish', () => {
                        playSong()
                    })
                }
                playSong()
            } else {
                message.channel.send(`Indicate the URL of a song to play (YouTube links won't work)`)
            }
        } else if (command.includes('stop') && message.member.voice.channel) {
            const connection = await message.member.voice.channel.leave();
        } else {
            message.channel.send('You are not in a voice channel!')
        }
    }
})

client.login("ODAyNTEwNTY1NDQ3ODI3NDk3.YAwSNA.o1-uxAdVKCmTD2YopImCbSxrwlk")