const { terminal } = require('terminal-kit');

const {
  readJsonfile,
  writeToJsonFile,
} = require('../utils');

module.exports = {
  addWarehouse: (input) => {
    input = input.split(' ')
    console.log('input: ', input)
    if (input.length <= 2) {
      terminal.red('You must provide a Warhouse number');
      return;
    }

    const warehouseNum = parseInt(input[2]);
    const stockLimit = input[3] ? parseInt(input[3]) : null;
    console.log('warehouseNum: ', warehouseNum)
    const file = readJsonfile();
    const { warehouses } = file;
    let isSameNum = false;
    console.log('warehouses: ', warehouses)

    for (let i = 0; i < warehouses.length; i++) {
      if (warehouses[i].warehouseNum === warehouseNum) {
        isSameNum = true;
        break;
      }
    }

    if (isSameNum) {
      terminal.red(`A warehouse with number: ${warehouseNum} already exists.`);
      return;
    }

    const newFile = {
      ...file,
      warehouses: [
        ... warehouses,
        {
          warehouseNum,
          stockLimit
        }
      ]
    }

    writeToJsonFile(newFile);
    terminal.green(`Warehouse # ${warehouseNum} added sucsessfully!`)

  },

  listWarehouses: () => {
    const file = readJsonfile();
    const { warehouses } = file;

    const table = warehouses.map((warehouse) => {
      return [warehouse.warehouseNum, warehouse.stockLimit ? warehouse.stockLimit : 'Unlimited']
    })
    if (table.length === 0) {
      terminal.red('\nThere are no warehouses in the database.');
      return;
    }
    table.unshift(['Warehouse #', 'Stock Limit'])
    terminal('\n')
    terminal.table(table,{
      hasBorder: true ,
      contentHasMarkup: true ,
      borderChars: 'lightRounded' ,
      borderAttr: { color: 'blue' } ,
      textAttr: { bgColor: 'default' } ,
      firstCellTextAttr: { bgColor: 'blue' } ,
      firstRowTextAttr: { bgColor: 'blue' } ,
      width: 80 ,
      fit: true
    })
  },

  listSingleWarehouse: () => {

  },
}