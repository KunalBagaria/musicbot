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
        const broadcast = await client.voice.createBroadcast();
        const playSong = async () => {
            const dispatcher = await broadcast.play(musicLink)
            dispatcher.on('finish', () => {
                playSong()
            })
        }
        playSong()
        const channelOne = await client.channels.cache.get("849567857520017429");
        const channelTwo = await client.channels.cache.get("851009827207512084");
        const connectionOne = await channelOne.join()
        const connectionTwo = await channelTwo.join()
        await connectionOne.play(broadcast, { highWaterMark: 10000 });
        await connectionTwo.play(broadcast, { highWaterMark: 10000 });
    }
})

client.login("ODAyNTEwNTY1NDQ3ODI3NDk3.YAwSNA.o1-uxAdVKCmTD2YopImCbSxrwlk")