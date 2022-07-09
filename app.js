const DiscordBot = require('./DiscordBot');
const { Intents } = require('discord.js');

const bits = [];
for (const key in Intents.FLAGS) {
  bits.push(Intents.FLAGS[key]);
}
const intents = new Intents(bits);

const bot = new DiscordBot({
  intents: intents, // '98303',
});

bot.start();