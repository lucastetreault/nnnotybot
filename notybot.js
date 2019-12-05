const Bot = require('keybase-bot');

const THANK_SET = 0;
const F_SET = 1;

const PHRASE_SETS = [
    ['thank you', ' ty ', 'thanks', 'thank', 'merci', 'gracias'],
    ['fuck you']
];

function findMatch(text) {
    let match = null;
    PHRASE_SETS.forEach((set, index) => {
        const s = set.findIndex(p => text.toLowerCase().includes(p));
        if (s !== -1) {
            match = [index, s];
        }
    });
    return match;
}

async function main() {
    const bot = new Bot()
    try {
        const username = process.env.NOTYBOT_USERNAME;
        const paperkey = process.env.NOTYBOT_PAPERKEY;

        await bot.init(username, paperkey, { verbose: false })
        const onMessage = message => {
            const channel = message.channel
            const sender = message.sender;
            const body = message.content.text.body;

            const username = sender.username;

            if (username === bot.myInfo().username) {
                console.info('Found self.');
                return;
            }

            if (body.includes(`@${bot.myInfo().username}`)) {
                bot.chat.send(channel, { body: `Hey @here, look at big brain @${username} talking to a bot!` });
                return;
            }

            match = findMatch(body);
            if (match == null) {
                console.info('Message does not contain key phrase.');
                return;
            }

            switch (match[0]) {
                case THANK_SET:
                    let m = !body.includes('you') || !PHRASE_SETS[match[0]][match[1]].includes('you') ? `No, ${PHRASE_SETS[match[0]][match[1]].trim()} to you @${username}!` : `No, ${PHRASE_SETS[match[0]][match[1]].trim()} @${username}!`;
                    m = m.replace(' you ', ' YOU ');
                    bot.chat.send(channel, { body: m });
                    break;
                case F_SET:
                    bot.chat.send(channel, { body: `No, fuck YOU @${username}!` });
                    break;
            }
        };

        console.log(`Notybot initialized as ${bot.myInfo().username}.`);

        bot.chat
            .watchAllChannelsForNewMessages(onMessage, (error) => {
                console.error(error);
                bot.deinit();
            });
    } catch (error) {
        console.error(error);
    }
}
main();