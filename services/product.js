const { terminal } = require('terminal-kit');

module.exports = {

  addProduct: (input) => {
    const product = input.split(' ');
    // string must start and end with a "
    const inQuotes = /^".*"$/.test(product[2]);

    if (!inQuotes) {
      terminal.red('Invalid product name, product name must start with " and end with "');
    }
    console.log('inQuotes:-=-=', inQuotes)
  }
}