const Command = require('./utils/Command.class.js');

const quote = new Command(
  'quote',
  'Replies with a quote',
);

module.exports = quote.me;