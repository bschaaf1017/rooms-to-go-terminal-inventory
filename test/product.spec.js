const { expect } = require('chai');

const { app, terminateApp } = require('../src/app');
const { addProduct, listProducts } = require('../src/controllers/product');
const { readJsonfile, writeToJsonFile, clearDB} = require('../src/utils');


describe('Testing Product Controller', () => {
  before(() => {
    app(true);
  });

  after(() => {
    clearDB(true);
    terminateApp();
  });

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

    it('If a product with entered SKU is already in DB should not allow creating it', () => {
      const add = addProduct('ADD PRODUCT "Sofia Vegara 5 Piece Living Room Set" 38538505-0767-453f-89af-d11c809ebb3b', true);
      expect(add).to.be.false;
    });

    it('If a product with same name is already in DB but has different SKU, should still create', () => {
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
