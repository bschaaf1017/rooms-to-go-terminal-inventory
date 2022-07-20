const term = require('terminal-kit').terminal;

const { parseCommandType, clearDB } = require('./utils');
const { addProduct, listProducts } = require('./controllers/product');
const { addWarehouse, listWarehouses, listSingleWarehouse } = require('./controllers/warehouse');
const { stockProduct, unstockProduct } = require('./controllers/stock');
const { addCommands, listCommands } = require('./controllers/debug');
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
  'DEBUG',
];

let enteredCommands = [];

const renderInputField = (isTest) => {
  if (!isTest) {
    term.bold.magenta('\nEnter command: ');
  }
  term.inputField(
    { history, autoComplete, autoCompleteMenu: true },
    (error, input) => {
      if (error) {
        term.red(`${error}`);
      }
      // add command to array and check if it length is 2
      enteredCommands.push({
        time: new Date().toLocaleString(),
        input,
      });

      if (enteredCommands.length === 2) {
        addCommands(enteredCommands);
        enteredCommands = [];
      }

      const commandType = parseCommandType(input);

      switch (commandType) {
        case commandTypes.addProduct:
          addProduct(input, false);
          break;
        case commandTypes.addWarehouse:
          addWarehouse(input, false);
          break;
        case commandTypes.stock:
          stockProduct(input);
          break;
        case commandTypes.unstock:
          unstockProduct(input);
          break;
        case commandTypes.listProducts:
          listProducts(false);
          break;
        case commandTypes.listWarehouses:
          listWarehouses();
          break;
        case commandTypes.listWarehouse:
          listSingleWarehouse(input, false);
          break;
        case commandTypes.clear:
          clearDB(false);
          break;
        case commandTypes.debug:
          listCommands();
          break;
        default:
          break;
      }
      renderInputField();
    },
  );
};

const terminateApp = () => {
  if (enteredCommands.length > 0) {
    // if there is only one command in the enteredCommands array write to file before exit
    addCommands(enteredCommands);
  }
  process.exit();
};

const app = (isTest) => {
  if (!isTest) {
    term.bold.green('Welcome to my interactive Rooms-to-Go warehouse and inventory terminal app');
  }

  term.on('key', (name) => {
    if (name === 'CTRL_C') {
      terminateApp();
    }
  });

  renderInputField(isTest);
};

app(false);

module.exports = { app, terminateApp };
