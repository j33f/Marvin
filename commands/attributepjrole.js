const Command = require('./utils/Command.class.js');
const { getRole, getMemberById } = require('./utils/membersAndRoles');

const responses = [
  'Comme si quelqu\'un en avait quelque chose à faire...',
  'Ok...',
  'https://c.tenor.com/1NHZzGKTmYwAAAAC/little-girl-meme.gif',
  'https://pbs.twimg.com/media/C35qomTUcAAYPjJ.jpg',
  'https://c.tenor.com/b7KY5b4zZdsAAAAC/%D0%B4%D0%BE%D0%B1%D0%B1%D0%B8%D1%81%D0%B2%D0%BE%D0%B1%D0%BE%D0%B4%D0%B5%D0%BD-%D0%B4%D0%BE%D0%B1%D0%B1%D0%B8.gif',
  'https://media1.giphy.com/media/SFkjp1R8iRIWc/giphy.gif',
  'https://aminoapps.com/c/anime/page/blog/space-dandy-x-the-hitchhikers-guide-to-the-galaxy/BJtw_uoGYqrkBbroRpLPGq1eebpDWw',
  'Pathétique... Enfin bref...',
  'Eh bien, en voilà une nouvelle ! Vous allez en faire un vlog ?',
  'Et on dit que les humains sont intelligent... *soupir* Pathétique...',
  'Et c\'est reparti...',
];

const attributepjrole = new Command(
  'chaussette',
  'Go to DnD',
  async (interaction) => {
    const role = await getRole({ member: { guild: interaction.originGuild } }, 'PJ');
    const user = await getMemberById(interaction.originGuild, interaction.author.id);
    const chan = (await interaction.originGuild.channels.fetch()).find(c => c.name === 'DnD');
    const reply = responses[Math.floor(Math.random() * responses.length)];
    await user.roles.add(role);
    await user.send(`Rejoins-nous sur <#${chan.id}>, et attend les instructions du GM !`);
    await interaction.reply({ content: reply, ephemeral: true });
  },
);

module.exports = attributepjrole.me;