const { SlashCommandBuilder } = require('@discordjs/builders');

const quotes = [
  'La vie... Ne me parlez pas de la vie.',
  'Je pense que vous devriez savoir que je suis très déprimé.',
  'Désolé de respirer, ce que je ne fais jamais de toutes façons donc je ne sais même pas pourquoi j\'en parle, Oh Dieu que je suis déprimé.',
  'Ça ne me plaira pas.',
  'Je pourrais vous répondre, mais ça vous déprimerait.',
];

class Command {
  constructor(command, description, handler, buttonHandler) {
    this.command = command;
    this.description = description;

    this.handler = handler || this.defaultHandler;
    this.buttonsHandler = buttonHandler || this.defaultButtonsHandler;

    this.def = new SlashCommandBuilder()
      .setName(this.command)
      .setDescription(this.description);
  }

  get me() {
    return {
      command: this.command,
      def: this.def,
      handler: this.handler,
      buttonsHandler: this.buttonsHandler,
      thisObject: this,
    };
  }

  async defaultHandler(interaction) {
    const content = quotes[Math.floor(Math.random() * quotes.length)];
    await interaction.reply({ content, ephemeral: true });
  }

  async defaultButtonsHandler() {
    return 0;
  }
}

module.exports = Command;