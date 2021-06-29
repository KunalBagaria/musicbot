import Discord from 'discord.js'
import fs from 'fs'

const queue = []
let songNumber = 0
let dispatcher

const checkIfAudioFile = (fileName) => {
  const allowedFormats = ['mp3', 'webm', 'wav', 'ogg']
  const extension = fileName.split('.').pop()
  return allowedFormats.includes(extension)
}

const broadcastAudio = async (broadcastInput) => {
  const broadcast = broadcastInput
  fs.readdirSync('./audio').forEach((file) => {
    if (checkIfAudioFile(file)) {
      queue.push(`./audio/${file}`)
    }
  })
  const startBroadcast = () => {
    if (queue[0]) {
      dispatcher = broadcast.play(queue[songNumber], {
        bitrate: 192000,
        highWaterMark: 1 << 25
      })
      dispatcher.on('finish', () => {
        if (songNumber + 1 === queue.length) {
          songNumber = 0
        } else {
          songNumber++
        }
        startBroadcast()
      })
    }
  }
  startBroadcast()
}

const playBroadcast = async (broadcast, message) => {
  const myMessage = message
  const connection = await myMessage.member.voice.channel.join()
  connection.play(broadcast)
}

export {
  broadcastAudio,
  playBroadcast
}
