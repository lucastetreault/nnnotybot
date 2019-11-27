const Bot = require('keybase-bot');

const onMessage = message => {
    const channel = message.channel
    const sender = message.sender;
    const body = message.content.text.body;

    const username = sender.username;

    if (username === bot.myInfo().username) {
        console.info('Found self.');
        return;
    }

    if (!body.toLowerCase().includes('thank you')) {
        console.info('Message does not contain key phrase.');
        return;
    }

    bot.chat.send(channel, { body: `No, thank YOU @${username}!` });
}

async function main() {
    const bot = new Bot()
    try {
        const username = process.env.NOTYBOT_USERNAME;
        const paperkey = process.env.NOTYBOT_PAPERKEY;

        await bot.init(username, paperkey, { verbose: false })
        console.log(`Notybot initialized.`);

        bot.chat
            .watchAllChannelsForNewMessages(onMessage, (error) => {
                console.error(error);
                bot.deinit();
            });
    } catch (error) {
        console.error(error);
    } finally {
        await bot.deinit();
    }
}
main();