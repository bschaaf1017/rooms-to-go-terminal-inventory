const { expect } = require('chai');

const { app, terminateApp } = require('../src/app');
const { addProduct, listProducts } = require('../src/controllers/product');
const { addWarehouse, listWarehouses, listSingleWarehouse } = require('../src/controllers/warehouse');
const { stockProduct, unstockProduct } = require('../src/controllers/stock');
const { clearDB, readJsonfile } = require('../src/utils');


describe('Rooms to Go Terminal App Tests', () => {
  before(() => {
    app(true);
  });

  after(() => {
    clearDB(true);
    terminateApp();
  });

  describe('Product Controller', () => {
    describe('#addProduct()', () => {
      it('should create a product', () => {
        const add = addProduct('ADD PRODUCT "Sofia Vegara 5 Piece Living Room Set" 38538505-0767-453f-89af-d11c809ebb3b', true);
        expect(add).to.be.true;
      });

      it('if command doesnt have all parameters, should return error', () => {
        const add = addProduct('ADD PRODUCT', true);
        expect(add).to.be.false;
      });

      it('if SKU is not in proper format, should return error', () => {
        const add = addProduct('ADD PRODUCT "test" 123-456-7890', true);
        expect(add).to.be.false;
      });

      it('Should return error if trying to add product with SKU thats already in DB', () => {
        const add = addProduct('ADD PRODUCT "Sofia Vegara 5 Piece Living Room Set" 38538505-0767-453f-89af-d11c809ebb3b', true);
        expect(add).to.be.false;
      });

      it('Should create product with same name as long as SKU is unique', () => {
        const add = addProduct('ADD PRODUCT "Sofia Vegara 5 Piece Living Room Set" 12345678-abcd-1234-abcd-1234567890ab', true);
        expect(add).to.be.true;
      });

    });

    describe('#listProduct()', () => {
      it('should return list of products if some exist', () => {
        const list = listProducts('LIST PRODUCTS', true);
        expect(list).to.be.an('array');
      });

      it('if no products in DB should return error', () => {
        clearDB(true);
        const list = listProducts('LIST PRODUCTS', true);
        expect(list).to.be.false;
      });
    });
  });

  describe('Warehouse Controller', () => {
    describe('#listWarehouses()', () => {
      it('Should return error if no warehouses in DB', () => {
        const list = listWarehouses('LIST WAREHOUSES', true);
        expect(list).to.be.false;
      });

      it('Should return list of warhouses if some exist', () => {
        addWarehouse('ADD WAREHOUSE 111 1000', true);
        const list = listWarehouses('LIST WAREHOUSES', true);
        expect(list).to.be.an('array');
      });
    });


    describe('#addWarehouse()', () => {
      it('Should return error if command didnt include warehouse number', () => {
        const add = addWarehouse('ADD WAREHOUSE', true);
        expect(add).to.be.false;
      });

      it('Should return error if warehouse number wasnt type number', () => {
        const add = addWarehouse('ADD WAREHOUSE Aabc', true);
        expect(add).to.be.false;
      });

      it('Should sucessfully add a new warehouse', () => {
        const add = addWarehouse('ADD WAREHOUSE 333', true);
        const file = readJsonfile(true);
        expect(Object.keys(file.warehouses['333'])).to.have.lengthOf(3);
      });

      it('Should sucessfully add a new warehouse without a stock limit', () => {
        const file = readJsonfile(true);
        expect(file.warehouses['333'].stockLimit).to.be.null;
      });

      it('Should sucessfully add a new warehouse with a stock limit', () => {
        const add = addWarehouse('ADD WAREHOUSE 444 1000', true);
        const file = readJsonfile(true);
        expect(file.warehouses['444'].stockLimit).to.equal(1000);
      });
    });


    describe('#listSingleWarehouse()', () => {
      it('Should return error if no warehouse number is entered', () => {
        const list = listSingleWarehouse('LIST WAREHOUSE', true);
        expect(list).to.be.false;
      });

      it('Should return error if input warehouse number doest exist', () => {
        const list = listSingleWarehouse('LIST WAREHOUSE 1111', true);
        expect(list).to.be.false;
      });

      it('Should return error if input warehouse has no products stocked in it', () => {
        const list = listSingleWarehouse('LIST WAREHOUSE 444', true);
        expect(list).to.be.false;
      });

      it('The quantitly of BEDs in Warehouse 444 should 200', () => {
        addProduct('ADD PRODUCT "BED" 5ce956fa-a71e-4bfb-b6ae-5eeaa5eb0a70', true);
        stockProduct('STOCK 5ce956fa-a71e-4bfb-b6ae-5eeaa5eb0a70 444 200', true);
        const list = listSingleWarehouse('LIST WAREHOUSE 444', true);
        expect(list[1][2]).to.equal(200);
      });
    });
  });

  describe('Stock Controller', () => {
    describe('#stockProduct()', () => {
      it('Should return error if STOCK command doesnt contain required parameters', () => {
        const stock = stockProduct('STOCK 5ce956fa-a71e-4bfb-b6ae-5eeaa5eb0a70 444', true);
        expect(stock).to.be.false;
      });

      it('Should return error if SKU is not valid format', () => {
        const stock = stockProduct('STOCK 5ce956fa-a7-4b-b6-5eeaa5eb0a70 444 200', true);
        expect(stock).to.be.false;
      });

      it('Should return error if there are no products in stock with input SKU', () => {
        const stock = stockProduct('STOCK 1234abcd-ab12-ab12-ab12-123456abcdef 444 200', true);
        expect(stock).to.be.false;
      });

      it('Should return error if there are no warehouses with input warehouse number', () => {
        const stock = stockProduct('STOCK 5ce956fa-a71e-4bfb-b6ae-5eeaa5eb0a70 4449 200', true);
        expect(stock).to.be.false;
      });

      it('Should return error if input stock qty exceeds warehouse stock limit', () => {
        const stock = stockProduct('STOCK 5ce956fa-a71e-4bfb-b6ae-5eeaa5eb0a70 444 2000', true);
        expect(stock).to.be.false;
      });

      it('Should properly update warehouse stock limit if one exists', () => {
        const stock = stockProduct('STOCK 5ce956fa-a71e-4bfb-b6ae-5eeaa5eb0a70 111 100', true);
        const file = readJsonfile(true);
        const { warehouses } = file;
        expect(warehouses['111'].stockLimit).to.equal(900);
      });

      it('Should properly update stock qty if warehouse already has stock of input product', () => {
        const stock = stockProduct('STOCK 5ce956fa-a71e-4bfb-b6ae-5eeaa5eb0a70 111 100', true);
        const file = readJsonfile(true);
        const { warehouses } = file;
        expect(warehouses['111'].stockedProducts['5ce956fa-a71e-4bfb-b6ae-5eeaa5eb0a70'].qty).to.equal(200);
      });
    });

    describe('#unstockProduct()', () => {
      it('Should return error if UNSTOCK command doesnt contain required parameters', () => {
        const stock = unstockProduct('UNSTOCK 5ce956fa-a71e-4bfb-b6ae-5eeaa5eb0a70 444', true);
        expect(stock).to.be.false;
      });

      it('Should return error if SKU is not valid format', () => {
        const stock = unstockProduct('UNSTOCK 5ce956fa-a7-4b-b6-5eeaa5eb0a70 444 200', true);
        expect(stock).to.be.false;
      });

      it('Should return error if there are no products in stock with input SKU', () => {
        const stock = unstockProduct('UNSTOCK 1234abcd-ab12-ab12-ab12-123456abcdef 444 200', true);
        expect(stock).to.be.false;
      });

      it('Should return error if there are no warehouses with input warehouse number', () => {
        const stock = unstockProduct('UNSTOCK 5ce956fa-a71e-4bfb-b6ae-5eeaa5eb0a70 4449 200', true);
        expect(stock).to.be.false;
      });

      it('Should return error if warehouses has no products with input sku in stock', () => {
        addProduct('ADD PRODUCT "Sofia Vegara 5 Piece Living Room Set" 38538505-0767-453f-89af-d11c809ebb3b', true);
        const stock = unstockProduct('UNSTOCK 38538505-0767-453f-89af-d11c809ebb3b 111 200', true);
        expect(stock).to.be.false;
      });

      it('Should set Stock qty to 0 if input qty is > than current stock', () => {
        // qty is 200 before running this test
        unstockProduct('UNSTOCK 5ce956fa-a71e-4bfb-b6ae-5eeaa5eb0a70 111 300', true);
        const file = readJsonfile(true);
        const { warehouses } = file;
        expect(warehouses['111'].stockedProducts['5ce956fa-a71e-4bfb-b6ae-5eeaa5eb0a70'].qty).to.equal(0);
      });

      it('Should return error if Stock qty at input warehouse is 0', () => {
        const stock = unstockProduct('UNSTOCK 5ce956fa-a71e-4bfb-b6ae-5eeaa5eb0a70 111 300', true);
        expect(stock).to.be.false;
      });

      it('Should properly update stock qty at input warehouse', () => {
        // qty is 200 before running this test
        unstockProduct('UNSTOCK 5ce956fa-a71e-4bfb-b6ae-5eeaa5eb0a70 444 100', true);
        const file = readJsonfile(true);
        const { warehouses } = file;
        expect(warehouses['444'].stockedProducts['5ce956fa-a71e-4bfb-b6ae-5eeaa5eb0a70'].qty).to.equal(100);
      });
    });
  })
});
