import Discord from 'discord.js'
import fs from 'fs'

const queue = []
let songNumber = 0
let dispatcher
let myMessage
let connection

const checkIfAudioFile = (fileName) => {
  const allowedFormats = ['mp3', 'webm', 'wav', 'ogg', 'm4a']
  const extension = fileName.split('.').pop()
  return allowedFormats.includes(extension)
}

const broadcastAudio = async (message, skip) => {
  myMessage = message
  if (!skip) {
    connection = await myMessage.member.voice.channel.join()
    fs.readdirSync('./audio').forEach((file) => {
      if (checkIfAudioFile(file)) {
        queue.push(`./audio/${file}`)
      }
    })
  }
  const startBroadcast = () => {
    if (queue[0]) {
      dispatcher = connection.play(fs.createReadStream(queue[songNumber]), {
        bitrate: 384000
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

const skipFile = () => {
  if (songNumber + 1 === queue.length) {
    songNumber = 0
  } else {
    songNumber++
  }
  broadcastAudio(myMessage, true)
}

export {
  broadcastAudio,
  skipFile
}
