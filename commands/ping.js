const Command = require('./utils/Command.class.js');

const ping = new Command(
  'ping',
  'Replies with pong!',
  async (interaction) => {
    await interaction.reply({ content: 'pong!', ephemeral: true });
  },
);

module.exports = ping.me;