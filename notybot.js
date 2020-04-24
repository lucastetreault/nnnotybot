const Bot = require('keybase-bot')

async function main () {
  const bot = new Bot()
  try {
    const username = process.env.NOTYBOT_USERNAME
    const paperkey = process.env.NOTYBOT_PAPERKEY

    await bot.init(username, paperkey, { verbose: false })
    const onMessage = message => {
      const channel = message.channel
      const sender = message.sender
      const body = message.content.text.body

      const username = sender.username

      if (username === bot.myInfo().username) {
        console.info('Found self.')
        return
      }

      if (body.includes(`@${bot.myInfo().username}`)) {
        bot.chat.send(channel, { body: `@${username} Don't touch anything. Failure is contagious.` })
        return
      }

      if (!body.includes(`No, thanks to YOU`)) {
        console.log('It\'s not the fucking notybot')
        return
      }

      bot.chat.attach(channel, './nnnotybot.png').then(() => console.log('Sent a picture!'))
    }

    console.log(`Notybot initialized as ${bot.myInfo().username}.`)

    bot.chat
      .watchAllChannelsForNewMessages(onMessage, (error) => {
        console.error(error)
        bot.deinit()
      })
  } catch (error) {
    console.error(error)
  }
}

main()
