import ytdl from 'ytdl-core'

const getInfo = async (args) => {
    const info = await ytdl.getInfo(args)
    const formats = info.formats
    const audios = []
    formats.forEach((format) => {
        if (!format.hasVideo && format.container === 'webm') {
            audios.push(format.url)
        }
    })
    const url = audios[0] ? audios[0] : ''
    return url
}

export default getInfo