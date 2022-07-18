const term = require('terminal-kit').terminal;

const { parseCommandType, clearDB } = require('./utils');
const { addProduct, listProducts } = require('./services/product');
const { addWarehouse, listWarehouses, listSingleWarehouse } = require('./services/warehouse');
const { stockProduct, unstockProduct } = require('./services/stock');
const commandTypes = require('./config/commandTypes');

const history = ['ADD', 'STOCK', 'UNSTOCK', 'LIST', 'CLEAR'];

const autoComplete = [
  'ADD PRODUCT "<product_name>" <sku>',
  'ADD WAREHOUSE <warehouse_num> [stock_limit]',
  'STOCK <sku> <warhouse_num> <qty>',
  'UNSTOCK <sku> <warehouse_num> <qty>',
  'LIST PRODUCTS',
  'LIST WAREHOUSES',
  'LIST WAREHOUSE <warehouse_#>',
  'CLEAR',
];

const renderInputField = () => {
  term.bold.magenta('\nEnter command: ');
  term.inputField(
    { history, autoComplete, autoCompleteMenu: true },
    (error, input) => {
      if (error) {
        term.red(`${error}`);
      }
      const commandType = parseCommandType(input);

      switch (commandType) {
        case commandTypes.addProduct:
          addProduct(input);
          break;
        case commandTypes.addWarehouse:
          addWarehouse(input);
          break;
        case commandTypes.stock:
          stockProduct(input);
          break;
        case commandTypes.unstock:
          unstockProduct(input);
          break;
        case commandTypes.listProducts:
          listProducts();
          break;
        case commandTypes.listWarehouses:
          listWarehouses();
          break;
        case commandTypes.listWarehouse:
          listSingleWarehouse(input);
          break;
        case commandTypes.clear:
          clearDB();
          break;
        default:
          break;
      }
      renderInputField();
    },
  );
};

const app = () => {
  term.bold.green('Welcome to my interactive Rooms-to-Go warehouse and inventory terminal app');

  term.on('key', (name, matches, data) => {
    if (name === 'CTRL_C') {
      process.exit();
    }
  });

  renderInputField();
};

app();
