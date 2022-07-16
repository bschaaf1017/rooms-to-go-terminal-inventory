const term = require('terminal-kit').terminal;

const { parseCommandType, clearDB } = require('./utils');
const { addProduct, listProducts } = require('./services/product');
const { addWarehouse, listWarehouses, listSingleWarehouse } = require('./services/warehouse');
const commandTypes = require('./config/commandTypes');


const history = ['ADD', 'STOCK', 'UNSTOCK', 'LIST', 'CLEAR'];

const autoComplete = [
  'ADD PRODUCT "<product_name>" <SKU>',
  'ADD WAREHOUSE WAREHOUSE# [STOCK_LIMIT]',
  'STOCK SKU WAREHOUSE# QTY',
  'UNSTOCK <SKU> <warehouse_#> <qty>',
  'LIST PRODUCTS',
  'LIST WAREHOUSES',
  'LIST WAREHOUSE <warehouse_#>',
  'CLEAR'
];

const app = () => {
  term.bold.green( 'Welcome to my interactive Rooms-to-Go warehouse and inventory terminal app') ;

  term.on( 'key' , (name , matches , data) => {
    if (name === 'CTRL_C') {
      process.exit();
    }
  }) ;

  renderInputField();
}

const renderInputField = () => {
  term.bold.magenta('\nEnter command: ')
  term.inputField(
    { history: history , autoComplete: autoComplete , autoCompleteMenu: true } ,
    ( error , input ) => {
      if (error) {
        terminal.red(`${error}`);
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
          break;
        case commandTypes.unstock:
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
      // if (commandType === commandTypes.addProduct) {
      //   addProduct(input);
      // } else if (commandType === commandTypes.addWarehouse) {
      //   addWarehouse(input);
      // } else if (commandType === commandTypes.stock) {

      // } else if (commandType === commandTypes.unstock) {

      // } else if (commandType === commandTypes.listProducts) {
      //   listProducts();
      // } else if (commandType === commandTypes.listWarehouses) {
      //   listWarehouses()
      // } else if (commandType === commandTypes.listWarehouse) {
      //   listSingleWarehouse(input);
      // } else if (commandType === commandTypes.clear) {
      //   clearDB();
      // }
      renderInputField();
    }
  );
}

app();
