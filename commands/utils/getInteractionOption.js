const getInteractionOption = (interaction, optionName, defaultValue = undefined) => {


  if (interaction.options.get) {
    const opt = interaction.options.get(optionName).value;
    if (opt) {
      return opt;
    }
  }
  if (interaction.options[optionName]) {
    return interaction.options[optionName];
  }
  if (defaultValue) {
    return defaultValue;
  }
  throw new Error(`Cannot find option named "${optionName}"`);
};

module.exports = { getInteractionOption };