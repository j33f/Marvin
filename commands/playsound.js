const Command = require('./utils/Command.class.js');
const SoundManager = require('./utils/SoundManager.class.js');
const { interactionUserHaveRole } = require('./utils/membersAndRoles');

const defaultVolumes = {
  campfire: 0.3,
  cave: 0.1,
  epicCombat: 0.08,
  hive: 0.08,
  magicForest: 0.2,
  nobleParty: 0.05,
  ritual: 0.035,
  riverside: 0.08,
  antre: 0.03,
};

let soundManager;

const playsound = new Command(
  'playsound',
  'play a sound in a voice channel',
  async (interaction) => {
    if (!await interactionUserHaveRole(interaction, 'GM')) {
      interaction.reply({ content: 'https://c.tenor.com/nw2rtAIe1UQAAAAd/power-lord-of-the-rings.gif' });
      return;
    }

    await interaction.reply({ content: 'Quel son jouer ?', components: await SoundManager.menu() });
  },
  async (interaction) => {
    if (interaction.customId.lastIndexOf('playsound-', 0) !== 0) {
      return 0;
    }

    const soundName = interaction.customId.replace(/^(playsound-)/, '');

    if (!soundManager) {
      soundManager = new SoundManager({
        channelName: 'DnD',
        defaultVolumes,
        interaction,
      });
      await soundManager.init();
    }

    try {
      await soundManager.playOrStop(interaction, soundName);
    } catch (error) {
      console.error(error.message);
    }
    /*
    const reply = { content: 'Quel son jouer ?', components: await SoundManager.menu() };
    try {
      await interaction.reply(reply);
    } catch (error) {
      await interaction.editReply(reply);
    }
*/

    return 1;
  },
);
module.exports = playsound.me;
