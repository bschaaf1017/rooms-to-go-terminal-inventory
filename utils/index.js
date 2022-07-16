const { terminal } = require('terminal-kit');
const commandTypes = require('../config/commandTypes');

module.exports = {
  parseCommandType: (input) => {
    if (input === '') {
      terminal.red('\nPlease enter a valid command');
      return;
    }
    const inputCommand = input.split(' ')

    const commandList = Object.values(commandTypes);

    for (let i = 0; i < commandList.length; i++) {
      if (
        (
          commandList[i] === commandTypes.stock
          && inputCommand[0] === commandList[i]
        )
        || (
          commandList[i] === commandTypes.unstock
          && inputCommand[0] === commandList[i]
        )
      ) {
        return commandList[i];
      }
      if (inputCommand[0].concat(' ', inputCommand[1]) === commandList[i]) {
        return commandList[i];
      }
    }

    terminal.red('\nPlease enter a valid command');
    return;

  },
}