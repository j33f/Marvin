const Command = require('./utils/Command.class.js');
const { MessageActionRow, MessageButton } = require('discord.js');

const rows = [
  new MessageActionRow()
    .addComponents(
      new MessageButton()
        .setCustomId('0')
        .setLabel('0')
        .setStyle('PRIMARY'),
    )
    .addComponents(
      new MessageButton()
        .setCustomId('half')
        .setLabel('1/2')
        .setStyle('PRIMARY'),
    )
    .addComponents(
      new MessageButton()
        .setCustomId('1')
        .setLabel('1')
        .setStyle('PRIMARY'),
    )
    .addComponents(
      new MessageButton()
        .setCustomId('2')
        .setLabel('2')
        .setStyle('PRIMARY'),
    ),
  new MessageActionRow()
    .addComponents(
      new MessageButton()
        .setCustomId('3')
        .setLabel('3')
        .setStyle('PRIMARY'),
    )
    .addComponents(
      new MessageButton()
        .setCustomId('5')
        .setLabel('5')
        .setStyle('PRIMARY'),
    )
    .addComponents(
      new MessageButton()
        .setCustomId('8')
        .setLabel('8')
        .setStyle('PRIMARY'),
    ),

  new MessageActionRow()
    .addComponents(
      new MessageButton()
        .setCustomId('stop')
        .setLabel('Stop')
        .setStyle('PRIMARY'),
    )
    .addComponents(
      new MessageButton()
        .setCustomId('show')
        .setLabel('Show')
        .setStyle('PRIMARY'),
    ),

];

let results = [];

const command = new Command(
  'poker',
  'Planing poker!',
  async (interaction) => {
    console.log(interaction.isButton());
    if (!interaction.isButton()) {
      results = [];
      await interaction.reply({ content: 'C\'est parti !', components: rows });
      return;
    }

    const received = interaction.custom_id();
    console.log('received', received);
    switch (true) {
      case received === 'stop':
        results = [];
        await interaction.reply({ content: 'Tout ça pour ça ? Déprimant...', components: rows });
        break;
      case received === 'show':
        await interaction.reply({
          content: `Moyenne: ${results.reduce((a, b) => a + b, 0)}, [${results.map(a => Math.floor(a) < a ? a : Math.floor(a)).join(', ')}]`,
          components: [],
        });
        break;
      case received.match(/[0-8half]*/):
        results.push(parseFloat(received.replace('half', '0.5')));
        await interaction.reply('Merci...');
        break;
      default:
        await interaction.reply('Euh...');
        break;
    }
  },
);

module.exports = command.me;