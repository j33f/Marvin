const Command = require('./utils/Command.class.js');
const { MessageActionRow, MessageButton } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');

const dices = ['d2', 'd3', 'd4', 'd6', 'd12', 'd20'];

const menu = () => {
  const rows = [];
  let rowCount = 0;
  let row = new MessageActionRow();
  dices.forEach(dice => {
    if (rowCount === 5) {
      rows.push(row);
      row = new MessageActionRow();
      rowCount = 0;
    }

    rowCount++;
    row.addComponents(
      new MessageButton()
        .setCustomId(`dice-${dice}`)
        .setLabel(`${dice}`)
        .setStyle('PRIMARY'),
    );
  });

  if (rowCount > 0) {
    rows.push(row);
  }

  return rows;
};

const joinVocalChannel = async (interaction) => {
  const channels = await interaction.guild.channels.fetch();
  const channel = channels.find(chan => chan.name === 'DnD');

  console.log(interaction.member.guild.channels.cache);

  await joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guild.id,
    adapterCreator: channel.guild.voiceAdapterCreator,
  });

  return channel;
};

const handler = async (interaction) => {
  const min = 1;
  let max;

  try {
    max = parseInt(interaction.options.get('dice').value);
  } catch (e) {
    max = parseInt(interaction.options.dice);
  }

  const result = Math.floor(Math.random() * (max - min + 1) + min);

  if (!isNaN(result)) {
    const channel = await joinVocalChannel(interaction);

    await channel.send({ content: `Lancé de D${max} donne ${result}.`, tts: false });
  }

  const content = `Résultat **${result}**\n\n_________________\n\nLancer :`;
  await interaction.reply({ content, components: menu() });
};

const dice = new Command(
  'dice',
  'roll a dice',
  handler,
  (interaction) => {
    const button = interaction.customId.replace(/^(dice-)/, '');
    return new Promise((resolve) => {
      if (dices.includes(button) || button === 'stop') {
        interaction.options = { dice: button.replace(/^(d)/, '') };
        handler(interaction)
          .then (() => resolve(1));
      } else {
        resolve(0);
      }
    });
  },
);

dice.def.addStringOption(option => option.setName('dice').setDescription('Combien de faces ?').setRequired(false));

module.exports = dice.me;