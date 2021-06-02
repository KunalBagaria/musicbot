import { Client, Intents } from 'discord.js'

const client = new Client({ intents: [Intents.ALL] });

client.on('ready', async () => {
    console.log("I'm ready")
})

client.on('message', async (message) => {
    if (message.author.bot) return
    let messageContent = message.content
    if (messageContent.includes('$play')){
        let musicLink = messageContent.split('$play ')[1]
        const channel = await client.channels.cache.get("849567857520017429");
        const connection = await channel.join()
        const playSong = async () => {
            const dispatcher = await connection.play(musicLink, { highWaterMark: 2048 })
            dispatcher.on('finish', () => {
                playSong()
            })
        }
        setTimeout(playSong, 10000)
    }
})

client.login("ODAyNTEwNTY1NDQ3ODI3NDk3.YAwSNA.o1-uxAdVKCmTD2YopImCbSxrwlk")