const { terminal } = require('terminal-kit');

const {
  validateSKU,
  readJsonfile,
  writeToJsonFile,
} = require('../utils');

module.exports = {

  addProduct: (input) => {
    // split input on " "
    input = input.split(/\s*(")\s*/);

    if (
      input[1] !== '"'
      && input[3] !== '"'
      && input.length !== 5
      || (input.length === 5 && input[4] === '')
    ) {
      terminal.red('Invalid ADD PRODUCT format, enter command like this: ').italic('ADD PRODUCT "<product_name>" <SKU>');
      return;
    }

    const isValidSKU = validateSKU(input[4])
    if (!isValidSKU) {
      terminal.red('Invalid input SKU, should be in format: ').italic('abcd1234-ab12-ab12-ab12-abcdef123456');
      return;
    }

    const productName = input[2];
    const sku = input[4];
    let isSameSKU = false;

    const file = readJsonfile();
    const { products } = file;
    console.log('products: ', products)

    for (let i = 0; i < products.length; i++) {
      if (products[i].sku === sku) {
        isSameSKU = true;
        break;
      }
    }

    if (isSameSKU) {
      terminal.red(`A product with SKU: ${sku} already exists.`);
      return;
    }

    const newFile = {
      ...file,
      products: [
        ... products,
        {
          name: productName,
          sku
        }
      ]
    }

    console.log('newFile: ', newFile)

    writeToJsonFile(newFile);
    terminal.green(`Product ${productName} added sucsessfully!`)

  }
}