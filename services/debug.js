const { terminal } = require('terminal-kit');

const {
  readJsonfile,
  writeToJsonFile,
} = require('../utils');

module.exports = {
  addCommands: (enteredCommands) => {
    const file = readJsonfile();
    const { commands } = file;

    enteredCommands.forEach((command) => commands.push(command));

    const newFile = {
      ...file,
      commands: [...commands],
    };

    writeToJsonFile(newFile);
  },

  listCommands: () => {

  },
};
