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
    const inputWarehouseNum = parseInt(input[2]);
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

    let prodName, warehouseNum, warehouseLimit;

    // make sure there is a product with the input sku
    for (let i = 0; i < products.length; i++) {
      if (products[i].sku === inputSku) {
        prodName = products[i].name;
        break;
      }
    }

    if (prodName === undefined) {
      terminal.red('\nThere are no products with that SKU, create a new product before stocking it in a warehouse');
      return;
    }

    // make sure there is a warehouse with the input warehouse number
    // could make this more efficient by either updating stock limit in this loop or splicing warehouse obj out of the array and adding it back later..
    for (let i = 0; i < warehouses.length; i++) {
      if (warehouses[i].warehouseNum === inputWarehouseNum) {
        warehouseLimit = warehouses[i].stockLimit ? warehouses[i].stockLimit : null;
        warehouseNum = warehouses[i].warehouseNum;
        break;
      }
    }

    if (warehouseNum === undefined) {
      terminal.red('\nThere are no warehouses with that number,create a new warehouse before stocking it with products');
      return;
    }

    console.log('productName: ', prodName, ' warehouseNum: ', warehouseNum, ' warehouseLimit: ', warehouseLimit)

    let newStockLimit = null;

    // check if there is enough available space for the product in the warehouse
    if (warehouseLimit) {
      if (inputQty > warehouseLimit) {
        terminal.red(`\nThere is only ${warehouseLimit} stock space in warehouse ${warehouseNum}, consider a warehouse with more stock space available.`);
        return;
      }
      newStockLimit = warehouseLimit - inputQty;
    }
    console.log('newStockLimit:', newStockLimit)

    //update warehouse stock limit if needed
    if (newStockLimit) {
      for (let i = 0; i < warehouses.length; i++) {
        if (warehouses[i].warehouseNum === inputWarehouseNum) {
          warehouses[i].stockLimit = newStockLimit;
          break;
        }
      }
    }
    console.log('warehouses after update: ', warehouses)

    const newStockData = {
      warehouseNum: inputWarehouseNum,
      productName: prodName,
      sku: inputSku,
      qty: inputQty,
    }

    writeToJsonFile({
      ...file,
      warehouses: [...warehouses],
      stock: [...stock, newStockData]
    })

    console.log('readJsonfile: ', readJsonfile())

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