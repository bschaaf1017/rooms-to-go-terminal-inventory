const { terminal } = require('terminal-kit');
const _ = require('lodash');

const {
  readJsonfile,
  writeToJsonFile,
} = require('../utils');

module.exports = {
  addWarehouse: (input) => {
    input = input.split(' ');

    if (input.length <= 2) {
      terminal.red('\nYou must provide a Warhouse number');
      return;
    }

    const warehouseNum = input[2];
    const stockLimit = input[3] ? parseInt(input[3]) : null;
    const file = readJsonfile();
    const { warehouses } = file;

    if (warehouses[warehouseNum]) {
      terminal.red(`\nA warehouse with number: ${warehouseNum} already exists.`);
      return;
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

    writeToJsonFile(newFile);
    terminal.green(`\nWarehouse # ${warehouseNum} added sucsessfully!`);
  },

  listWarehouses: () => {
    const file = readJsonfile();
    const { warehouses } = file;

    if (_.isEmpty(warehouses)) {
      terminal.red('\nThere are no warehouses in the database.');
      return;
    }

    const table = [];
    for (const key in warehouses) {
      table.push([
        warehouses[key].warehouseNum,
        warehouses[key].stockLimit ? warehouses[key].stockLimit : 'Unlimited',
      ]);
    }

    table.unshift(['Warehouse #', 'Stock Limit']);
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

  listSingleWarehouse: (input) => {
    input = input.split(' ');

    if (input.length !== 3 || input[2] === '') {
      terminal.red('\nYou must provide a Warhouse number');
      return;
    }

    const inputWarehouseNum = input[2];

    const file = readJsonfile();
    const { warehouses } = file;

    if (warehouses[inputWarehouseNum] === undefined) {
      terminal.red('\nThe Warhouse number you provided does not exist');
      return;
    }

    const { stockedProducts } = warehouses[inputWarehouseNum];

    if (_.isEmpty(stockedProducts)) {
      terminal.red('\nWarhouse ')
        .blue.bold(`${inputWarehouseNum}`)
        .red(' doesnt have anything stocked in it yet but has space for ')
        .blue.bold(`${warehouses[inputWarehouseNum].stockLimit}`)
        .red(' products');

      return;
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
