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
        || (
          commandList[i] === commandTypes.debug
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

  readJsonfile: (isTest) => {
    try {
      if (!isTest) {
        const file = fs.readFileSync('rooms-to-go.json', 'utf8');
        return JSON.parse(file);
      }
      const testFile = fs.readFileSync('rooms-to-go-test.json', 'utf8');
      return JSON.parse(testFile);
    } catch (err) {
      console.log('err: ', err);
    }
  },

  writeToJsonFile: (data, isTest) => {
    data = JSON.stringify(data);
    try {
      if (!isTest) {
        fs.writeFileSync('rooms-to-go.json', data);
      } else {
        fs.writeFileSync('rooms-to-go-test.json', data);
      }
    } catch (err) {
      console.log('err', err);
    }
  },

  clearDB: (isTest) => {
    const newFile = JSON.stringify({
      products: {},
      warehouses: {},
      commands: [],
    });
    try {
      if (!isTest) {
        fs.writeFileSync('rooms-to-go.json', newFile);
      } else {
        fs.writeFileSync('rooms-to-go-test.json', newFile);
      }
    } catch (err) {
      console.log('err: ', err);
    }
  },
};
