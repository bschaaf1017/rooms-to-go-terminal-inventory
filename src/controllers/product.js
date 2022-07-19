const { terminal } = require('terminal-kit');
const _ = require('lodash');

const {
  validateSKU,
  readJsonfile,
  writeToJsonFile,
} = require('../utils');

module.exports = {

  addProduct: (input, isTest) => {
    // split input on " "
    input = input.split(/\s*(")\s*/);

    if (
      (input[1] !== '"' && input[3] !== '"' && input.length !== 5)
      || (input.length === 5 && input[4] === '')
    ) {
      if (!isTest) {
        terminal.red('\nInvalid ADD PRODUCT format, enter command like this: ').italic('ADD PRODUCT "<product_name>" <SKU>');
      }
      return false;
    }

    // validate SKU
    const isValidSKU = validateSKU(input[4]);
    if (!isValidSKU) {
      if (!isTest) {
        terminal.red('\nInvalid input SKU, should be in format: ').italic('abcd1234-ab12-ab12-ab12-abcdef123456');
      }
      return false;
    }

    const productName = input[2];
    const sku = input[4];

    const file = readJsonfile(isTest);
    const { products } = file;

    // see if product already exists
    if (products[sku]) {
      if (!isTest) {
        terminal.red(`\nA product with SKU: ${sku} already exists.`);
      }
      return false;
    }

    const newFile = {
      ...file,
      products: {
        ...products,
        [sku]: {
          name: productName,
          sku,
        },
      },
    };

    writeToJsonFile(newFile, isTest);
    if (!isTest) {
      terminal.green(`\nProduct ${productName} added sucsessfully!`);
    }
    return true;
  },

  listProducts: (isTest) => {
    const file = readJsonfile(isTest);
    const { products } = file;

    if (_.isEmpty(products)) {
      if (!isTest) {
        terminal.red('\nThere are no prducts in the database.');
      }
      return false;
    }

    const table = [];
    for (const key in products) {
      table.push([products[key].name, products[key].sku]);
    }

    table.unshift(['Product Name', 'SKU']);
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
