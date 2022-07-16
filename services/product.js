const { terminal } = require('terminal-kit');

const {
  validateSKU
} = require('../utils');

module.exports = {

  addProduct: (input) => {
    // split input on " "
    const product = input.split(/\s*(")\s*/);
    // const inQuotes = /^".*"$/.test(product[2]);

    if (
      product[1] !== '"'
      && product[3] !== '"'
      && product.length !== 5
      || (product.length === 5 && product[4] === '')
    ) {
      // terminal.red('Invalid product name, product name must start with " and end with "');
      terminal.red('Invalid ADD PRODUCT format, enter command like this: ').italic('ADD PRODUCT "<product_name>" <SKU>');
      return;
    }

    const isValidSKU = validateSKU(product[4])
    console.log('isValidSKU: ', isValidSKU)
    if (!isValidSKU) {
      terminal.red('Invalid product SKU, should be in format: ').italic('abcd1234-ab12-ab12-ab12-abcdef123456');
      return;
    }

  }
}