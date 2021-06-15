import YouTube from 'discord-youtube-api'
import dotenv from 'dotenv'
const envFile = dotenv.config()

const yt = new YouTube(envFile.YOUTUBE ? envFile.YOUTUBE : process.env.YOUTUBE)
const searchInfo = async (args) => {
    const info = await yt.searchVideos(args)
    const url = `https://www.youtube.com/watch?v=${info.id}`
    return url
}
export { searchInfo }