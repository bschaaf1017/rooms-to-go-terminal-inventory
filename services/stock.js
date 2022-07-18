const { terminal } = require('terminal-kit');

const {
  validateSKU,
  readJsonfile,
  writeToJsonFile,
} = require('../utils');

module.exports = {

  stockProduct: (input) => {
    input = input.split(' ');
    if (input.length !== 4) {
      terminal.red('\nInvalid STOCK input, please enter in this format: STOCK <sku> <warhouse_num> <qty>');
      return;
    }

    const inputSku = input[1];
    const inputWarehouseNum = input[2];
    const inputQty = parseInt(input[3]);

    // validate sku
    const isValidSKU = validateSKU(inputSku);
    if (!isValidSKU) {
      terminal.red('\nInvalid input SKU, should be in format: ').italic('abcd1234-ab12-ab12-ab12-abcdef123456');
      return;
    }

    const file = readJsonfile();
    const { products, warehouses, stock } = file;
    console.log('products: ', products)
    console.log('warehouses: ', warehouses)

    // make sure there is a product with the input sku
    if (products[inputSku] === undefined) {
      terminal.red('\nThere are no products with that SKU, create a new product before stocking it in a warehouse');
      return;
    }

    // make sure there is a warehouse with the input warehouse number
    if (warehouses[inputWarehouseNum] === undefined) {
      terminal.red('\nThere are no warehouses with that number, create a new warehouse before stocking it with products');
      return;
    }

    // check if there is enough available space for the product in the warehouse
    if (warehouses[inputWarehouseNum].stockLimit) {
      if (inputQty > warehouses[inputWarehouseNum].stockLimit) {
        terminal.red(`\nThere is only `)
          .blue.bold(`${warehouses[inputWarehouseNum].stockLimit}`)
          .red(' stock space in warehouse ')
          .blue.bold(`${inputWarehouseNum}`)
          .red(', consider a warehouse with more stock space available.');
        return;
      }

      //update warehouse stock limit to take into account what is being added
      warehouses[inputWarehouseNum].stockLimit -= inputQty;
    }
    console.log('warehouses after update:', warehouses)

    // check to see if this product already has some stock at that warehouse and increment,
    // writeToJsonFile only updated warehouse data if necessary and exit function
    console.log('do they equal?? ', Object.keys(warehouses[inputWarehouseNum].stockedProducts)[0] === inputSku)
    if (warehouses[inputWarehouseNum].stockedProducts[inputSku]) {
      const tempQty = warehouses[inputWarehouseNum].stockedProducts[inputSku].qty;
      warehouses[inputWarehouseNum].stockedProducts[inputSku].qty += inputQty;
      writeToJsonFile({
        ...file,
        warehouses: {
          ...warehouses,
        },
      });
      terminal.green('Successfully updated the quantity of ')
        .blue.bold(`${products[inputSku].name}`)
        .green(' from ')
        .blue.bold(`${tempQty}`)
        .green(' to ')
        .blue.bold(`${warehouses[inputWarehouseNum].stockedProducts[inputSku].qty}`);

      return;
    }

    warehouses[inputWarehouseNum].stockedProducts = {
      ...warehouses[inputWarehouseNum].stockedProducts,
      [inputSku]: {
        productName: products[inputSku].name,
        qty: inputQty,
      },
    }
    writeToJsonFile({
      ...file,
      warehouses: {
        ...warehouses,
      }
    });

    terminal.green('Successfully added ')
        .blue.bold(`${inputQty}`)
        .green(' of ')
        .blue.bold(`${products[inputSku].name}`)
        .green(' to warehouse ')
        .blue.bold(`${inputWarehouseNum}`);

    return;
  },

  unstockProduct: (input) => {

  },
}

/*
{
  warehouseNum: num
  productName: name
  sku: sku
  qty: qty
}
*/

