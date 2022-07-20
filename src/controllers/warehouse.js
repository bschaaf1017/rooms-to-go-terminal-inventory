const { terminal } = require('terminal-kit');
const _ = require('lodash');

const {
  readJsonfile,
  writeToJsonFile,
} = require('../utils');

module.exports = {
  addWarehouse: (input, isTest) => {
    input = input.split(' ');

    if (input.length <= 2) {
      if (!isTest) {
        terminal.red('\nYou must provide a Warhouse number');
      }
      return false;
    }
    // make sure warehouse number is type number
    if (_.isNaN(Number(input[2]))) {
      if (!isTest) {
        terminal.red('\nWarehouse number must be a number');
      }
      return false;
    }

    // make sure warehouse stock limit is type number
    if (input[3] && _.isNaN(Number(input[3]))) {
      if (!isTest) {
        terminal.red('\nWarehouse stock limit must be a number');
      }
      return false;
    }

    const warehouseNum = input[2];
    const stockLimit = input[3] ? Number(input[3]) : null;
    const file = readJsonfile(isTest);
    const { warehouses } = file;

    if (warehouses[warehouseNum]) {
      if (!isTest) {
        terminal.red(`\nA warehouse with number: ${warehouseNum} already exists.`);
      }
      return false;
    }

    const newFile = {
      ...file,
      warehouses: {
        ...warehouses,
        [warehouseNum]: {
          warehouseNum,
          stockLimit,
          stockedProducts: {},
        },
      },
    };

    writeToJsonFile(newFile, isTest);
    if (!isTest) {
      terminal.green(`\nWarehouse # ${warehouseNum} added sucsessfully!`);
    }

    return true;
  },

  listWarehouses: (isTest) => {
    const file = readJsonfile(isTest);
    const { warehouses } = file;

    if (_.isEmpty(warehouses)) {
      if (!isTest) {
        terminal.red('\nThere are no warehouses in the database.');
      }
      return false;
    }

    const table = [];
    for (const key in warehouses) {
      table.push([
        warehouses[key].warehouseNum,
        warehouses[key].stockLimit ? warehouses[key].stockLimit : 'Unlimited',
      ]);
    }

    table.unshift(['Warehouse #', 'Stock Limit']);
    if (!isTest) {
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
    }
    return table;
  },

  listSingleWarehouse: (input, isTest) => {
    input = input.split(' ');

    if (input.length !== 3 || input[2] === '') {
      if (!isTest) {
        terminal.red('\nYou must provide a Warhouse number');
      }
      return false;
    }

    const inputWarehouseNum = input[2];

    const file = readJsonfile(isTest);
    const { warehouses } = file;

    if (warehouses[inputWarehouseNum] === undefined) {
      if (!isTest) {
        terminal.red('\nThe Warhouse number you provided does not exist');
      }
      return false;
    }

    const { stockedProducts } = warehouses[inputWarehouseNum];

    if (_.isEmpty(stockedProducts)) {
      if (!isTest) {
        terminal.red('\nWarhouse ')
          .blue.bold(`${inputWarehouseNum}`)
          .red(' doesnt have anything stocked in it yet but has space for ')
          .blue.bold(`${warehouses[inputWarehouseNum].stockLimit}`)
          .red(' products');
      }
      return false;
    }

    const table = [];
    for (const key in stockedProducts) {
      table.push([
        stockedProducts[key].productName,
        key,
        stockedProducts[key].qty,
      ]);
    }

    table.unshift(['Item Name', 'SKU', 'QTY']);
    if (!isTest) {
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
    }

    return table;
  },
};
