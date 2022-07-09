const Command = require('./utils/Command.class.js');
const wikipedia = require('wikijs').default;
const stopwords = require('stopwords-iso');
const LanguageDetect = require('languagedetect');
const lngDetector = new LanguageDetect();

const command = new Command(
  'wikipedia',
  'search on	Wikipedia',
  async (interaction) => {
    const locale = interaction.locale || lngDetector.detect(interaction.content)[0][0].slice(0, 2);
    const apiUrl = `https://${locale}.wikipedia.org/w/api.php`;

    await interaction.reply('Regardez-moi, un cerveau de la capacité d\'une planête et j\'en suis réduit à chercher sur Wikipedia... ');

    let query, response;
    if (interaction.options) {
      query = interaction.options.get('query').value;
    } else {
      let words = interaction.content.toLowerCase().replace(/[,;.:!?]/g, '').replace(/ {2,}/g, ' ').trim().split(' ');
      const commandPosition = words.indexOf('wikipedia');
      words = words.slice(commandPosition + 1);

      if (stopwords[locale]) {
        // remove stopwords
        query = words.filter(word => !stopwords[locale].includes(word)).join(' ').trim();
        query = query.replace('propos', '').replace('about', '');
      } else {
        query = words.join(' ').trim();
      }
    }

    try {
      console.log(`[Wikipedia] Searching for: ${query} for locale ${locale}`);
      const result = await wikipedia({ apiUrl: apiUrl })
        .page(query);

      const summary = await result.summary();
      const url = result.url();

      response = `${summary.substring(0, 500)}...\nAllez-voir ici pour plus d'infos : ${url}`;
    } catch (e) {
      response = 'Oh il n\'y a rien à propos de cela sur Wikipedia, c\'est déprimant...';
    }
    if (interaction.editReply) {
      await interaction.editReply({ content: response, ephemeral: true });
    } else {
      await interaction.reply(response);
    }
  },
);

command.def.addStringOption(option => option.setName('query').setDescription('Que voulez-vous chercher ?').setRequired(true));

module.exports = command.me;