const Command = require('./utils/Command.class.js');
const { resetNicknames, getMembersByRoleName, getRole, getMemberById, interactionUserHaveRole } = require('./utils/membersAndRoles');

const enddnd = new Command(
  'enddnd',
  'End the current DnD game!',
  async (interaction) => {
    if (!await interactionUserHaveRole(interaction, 'GM')) {
      interaction.reply({ content: 'https://c.tenor.com/nw2rtAIe1UQAAAAd/power-lord-of-the-rings.gif' });
      return;
    }

    await resetNicknames(interaction.guild);
    const members = await getMembersByRoleName(interaction, 'PJ');
    const role = await getRole(interaction, 'PJ');
    for (const map of members) {
      const [member] = map.values();
      const user = await getMemberById(interaction.member.guild, member);

      if (user.voice) {
        await user.voice.disconnect('Partie terminée');
      }

      await user.roles.remove(role);
    }
    interaction.reply({ content: 'Done.' });
  },
);

module.exports = enddnd.me;