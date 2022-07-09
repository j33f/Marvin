const Command = require('./utils/Command.class.js');
const { MessageActionRow, MessageButton } = require('discord.js');

const { joinVocalChannel } = require('./utils/vocChan');
const selectPos = require('./utils/randomBetween');
const { getMembersByRoleName, interactionUserHaveRole, changeNicknameByMemberId } = require('./utils/membersAndRoles');

let channel;

const classesContent = {
  barbarian: require('./dnd/characters/barbarian'),
  dwarf: require('./dnd/characters/dwarf'),
  elf: require('./dnd/characters/elf'),
  magician: require('./dnd/characters/magician'),
};

const classes = Object.keys(classesContent);
let choosedClasses = [];

const selectCharacter = (gender) => {
  const min = 0;
  const max = classes.length - 1;

  if (choosedClasses.length === classes.length) {
    throw new Error('All characters are taken');
  }

  let pos = selectPos(min, max);

  while (choosedClasses.includes(classes[pos])) {
    pos = selectPos(min, max);
  }

  const theClass = classesContent[classes[pos]][gender];
  choosedClasses.push(classes[pos]);

  return theClass;
};

const genderTranslate = {
  'female': 'féminin',
  'male': 'masculin',
  'random': 'aléatoire',
};

const handler = async (interaction) => {
  if (!await interactionUserHaveRole(interaction, 'GM')) {
    interaction.reply({ content: 'https://c.tenor.com/nw2rtAIe1UQAAAAd/power-lord-of-the-rings.gif' });
    return;
  }

  const { chan } = await joinVocalChannel(interaction);
  channel = chan;

  const genderMenu = [
    new MessageActionRow(),
  ];
  genderMenu[0].addComponents(
    new MessageButton()
      .setCustomId('character-gender-female')
      .setLabel('Féminin')
      .setStyle('PRIMARY'),
  );
  genderMenu[0].addComponents(
    new MessageButton()
      .setCustomId('character-gender-male')
      .setLabel('Masculin')
      .setStyle('PRIMARY'),
  );
  genderMenu[0].addComponents(
    new MessageButton()
      .setCustomId('character-gender-random')
      .setLabel('Aléatoire')
      .setStyle('SECONDARY'),
  );

  choosedClasses = [];

  const PJs = await getMembersByRoleName(interaction, 'PJ');

  // eslint-disable-next-line no-unused-vars
  for (const [_, member] of PJs) {
    await member.send({ content: 'Merci de choisir le genre de ton personage :', components: genderMenu });
  }

  await channel.send({ content: '@here Je vous ai envoyé un MP afin de choisir le genre de votre personage."', tts: false });
  await interaction.reply({ content: 'Done.' });
};

const buttonsHandler = (interaction) => {
  return new Promise((resolve) => {
    let gender = interaction.customId.replace(/^(character-gender-)/, '');

    if (interaction.customId.lastIndexOf('character-gender-', 0) !== 0) {
      resolve(0);
      return;
    }

    if (gender === 'random') {
      gender = ['male', 'female'][selectPos(0, 1)];
    }

    let character;

    try {
      character = selectCharacter(gender);
    } catch (e) {
      console.log('OMG', e);
      interaction.update({ content: 'Tous les personages ont été attribués... voir avec le GM.', components: [] })
        .then(resolve(1));
    }

    if (character) {
      (async () => {
        console.log(interaction);
        await interaction.update({ content: `Tu as choisi un personnage de genre **${genderTranslate[gender]}**.`, components: [] });
        await interaction.followUp({ content: `**Tu as reçu le rôle ${character.className}.**\n` });

        await changeNicknameByMemberId(interaction.originGuild, interaction.user.id, character.nick);
        await interaction.followUp({ content: `**Ton nick sur ce serveur a été changé pour ${character.nick}.**\nIl sera remi comme avant à la fin du jeu.\n\n` });

        for (const l of character.lore) {
          await interaction.followUp({ content: l.replace(/ {2}/g, '') });
        }
        let content;
        if (gender === 'male') {
          content = `@here Accueillons un nouvel aventurier : <@${interaction.user.id}> !`;
        } else {
          content = `@here Accueillons une nouvelle aventurière : <@${interaction.user.id}> !`;
        }
        await channel.send({ content, tts: false });
        resolve(1);
      })();
    }
  });
};

const choosechar = new Command(
  'choosechar',
  'Lancer un choix de personnage DnD',
  handler,
  buttonsHandler,
);

module.exports = choosechar.me;
