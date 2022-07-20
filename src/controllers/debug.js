const { terminal } = require('terminal-kit');

const {
  readJsonfile,
  writeToJsonFile,
} = require('../utils');

module.exports = {
  addCommands: (enteredCommands) => {
    const file = readJsonfile(false);
    const { commands } = file;

    enteredCommands.forEach((command) => commands.push(command));

    const newFile = {
      ...file,
      commands: [...commands],
    };

    writeToJsonFile(newFile, false);
  },

  listCommands: () => {
    const file = readJsonfile(false);
    const { commands } = file;

    const table = [];

    commands.forEach((command) => table.push([command.time, command.input]));
    table.unshift(['time', 'input']);

    terminal('\n');
    terminal.table(table, {
      hasBorder: true,
      contentHasMarkup: true,
      borderChars: 'lightRounded',
      borderAttr: { color: 'blue' },
      textAttr: { bgColor: 'default' },
      firstCellTextAttr: { bgColor: 'blue' },
      firstRowTextAttr: { bgColor: 'blue' },
      width: 80,
      fit: true,
    });
  },
};
