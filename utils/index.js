const { terminal } = require('terminal-kit');
const commandTypes = require('../config/commandTypes');

const term = require( 'terminal-kit' ).terminal;

module.exports = {
  parseCommandType: (input) => {
    if (input === '') {
      terminal.red('\nPlease enter a valid command');
      return;
    }
    const splitCommand = input.split(' ')

    Object.values(commandTypes).forEach(command => {
      console.log('command: ', command)

      if (splitCommand[0].concat(' ', splitCommand[1]) === command) {
        console.log('here')
        return command;
      }
    })

    terminal.red('\nPlease enter a valid command');
    return;

  },
}