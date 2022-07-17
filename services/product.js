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
      terminal.red('\nInvalid ADD PRODUCT format, enter command like this: ').italic('ADD PRODUCT "<product_name>" <SKU>');
      return;
    }

    const isValidSKU = validateSKU(input[4])
    if (!isValidSKU) {
      terminal.red('\nInvalid input SKU, should be in format: ').italic('abcd1234-ab12-ab12-ab12-abcdef123456');
      return;
    }

    const productName = input[2];
    const sku = input[4];
    let isSameSKU = false;

    const file = readJsonfile();
    const { products } = file;

    for (let i = 0; i < products.length; i++) {
      if (products[i].sku === sku) {
        isSameSKU = true;
        break;
      }
    }

    if (isSameSKU) {
      terminal.red(`\nA product with SKU: ${sku} already exists.`);
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

    writeToJsonFile(newFile);
    terminal.green(`\nProduct ${productName} added sucsessfully!`)

  },

  listProducts: () => {
    const file = readJsonfile();
    const { products } = file;

    const table = products.map((product) => {
      return [product.name, product.sku]
    })
    if (table.length === 0) {
      terminal.red('\nThere are no prducts in the database.');
      return;
    }
    table.unshift(['Product Name', 'SKU'])
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
  }
}