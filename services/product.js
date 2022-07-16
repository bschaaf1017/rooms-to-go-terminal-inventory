const { terminal } = require('terminal-kit');

module.exports = {

  addProduct: (input) => {
    const product = input.split(/\s*(")\s*/);
    // string must start and end with a "
    console.log('product: ', product)
    // const inQuotes = /^".*"$/.test(product[2]);

    if (
      product[1] !== '"'
      && product[3] !== '"'
      && product.length !== 5
      || (product.length === 5 && product[4] === '')
    ) {
      terminal.red('Invalid product name, product name must start with " and end with "');
      return;
    }

    const removeQuotes = product[2].replace(/[^a-zA-Z \d]/g, '')
    console.log('removeQuotes: ', removeQuotes)


  }
}