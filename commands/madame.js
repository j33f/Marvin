const Command = require('./utils/Command.class.js');
const BM = require('bonjour-madame');
const {
  MessageEmbed,
} = require('discord.js');

const client = new BM.BonjourMadameClient();

const command = new Command(
  'madame',
  'Bonjour Madame of the day (NSFW)',
  async (interaction) => {
    await interaction.reply('T\'as rien de mieux à faire ? Erk... _soupire_ déprimant...');

    let response, embed;
    try {
      const result = await client.get(false);

      embed = new MessageEmbed()
        .setColor('#e01f22')
        .setTitle(result.title)
        .setURL(result.pageUrl)
        .setAuthor({
          name: 'Bonjour Madame',
          iconURL: 'https://scontent-mrs2-1.xx.fbcdn.net/v/t1.18169-9/27545488_10157112273208102_455204711218389976_n.jpg?_nc_cat=109&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=hrmXoXVhDVIAX8a-cFF&_nc_ht=scontent-mrs2-1.xx&oh=00_AT8dG3Dvz4sNj2Uv8SFJwDMY57uVN4SP-Jubfpsyq5_TYg&oe=6288E9DA',
          url: result.pageUrl,
        })
        .setImage(result.imgUrl)
        .setTimestamp();
    } catch (e) {
      response = 'Eh ben j\'ai rien trouvé d\'intéressant. Déprimant, hein ?';
    }

    try {
      await interaction.followUp({ content: response, embeds: [embed], ephemeral: true });
    } catch (e) {
      await interaction.reply({ content: response, embeds: [embed], ephemeral: true });
    }
  },
);

module.exports = command.me;