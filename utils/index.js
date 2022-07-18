const { terminal } = require('terminal-kit');
const fs = require('fs');

const commandTypes = require('../config/commandTypes');

module.exports = {
  parseCommandType: (input) => {
    if (input === '') {
      terminal.red('\nPlease enter a valid command');
      return;
    }
    const inputCommand = input.split(' ');

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
        || (
          commandList[i] === commandTypes.clear
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
  },

  validateSKU: (sku) => {
    const skuRegex = /^[a-zA-Z\d]{8}-[a-zA-Z\d]{4}-[a-zA-Z\d]{4}-[a-zA-Z\d]{4}-[a-zA-Z\d]{12}$/;
    return skuRegex.test(sku);
  },

  readJsonfile: () => {
    try {
      const file = fs.readFileSync('rooms-to-go.json', 'utf8');
      return JSON.parse(file);
    } catch (err) {
      console.log('err: ', err);
    }
    return;
  },

  writeToJsonFile: (data) => {
    data = JSON.stringify(data);
    try {
      fs.writeFileSync('rooms-to-go.json', data);
    } catch (err) {
      console.log('err', err);
    }
  },

  clearDB: () => {
    const newFile = JSON.stringify({
      products: {},
      warehouses: {},
      stock: [],
    });
    try {
      fs.writeFileSync('rooms-to-go.json', newFile);
    } catch (err) {
      console.log('err: ', err);
    }
  },
};
