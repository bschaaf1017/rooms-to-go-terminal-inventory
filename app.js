const term = require('terminal-kit').terminal;

const { parseCommandType } = require('./utils');
const { addProduct } = require('./services/product');
const commandTypes = require('./config/commandTypes');


const history = ['ADD', 'S', 'U', 'LIST'];

const autoComplete = [
  'ADD PRODUCT "<product_name>" <SKU>',
  'ADD WAREHOUSE WAREHOUSE# [STOCK_LIMIT]',
  'STOCK SKU WAREHOUSE# QTY',
  'UNSTOCK <SKU> <warehouse_#> <qty>',
  'LIST PRODUCTS',
  'LIST WAREHOUSES',
  'LIST WAREHOUSE <warehouse_#>',
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
      console.log('validate: ', commandType)
      if (commandType === commandTypes.addProduct) {
        addProduct(input);
      } else if (commandType === commandTypes.addWarehouse) {

      } else if (commandType === commandTypes.stock) {

      } else if (commandType === commandTypes.unstock) {

      } else if (commandType === commandTypes.listProducts) {

      } else if (commandType === commandTypes.listWarehouses) {

      } else if (commandType === commandTypes.listWarehouse) {

      }
      renderInputField();
    }
  );
}

app();
