# Rooms to Go Terminal App

This is my terminal app created with node.js for the Rooms to Go take home assessment

## Table of contents
* [Technologies](#technologies)
* [Setup](#setup)
* [Implementation](#implementation)
* [Tests](#tests)

## Technologies
Project is created with:
* #### terminal-kit: 2.4.0
  * This is the package I used to listening for input in the terminal and rendering text with different styles and colors
  * I chose this specific package because it is one of the most widely used, with the best documentation and is well maintained
* #### lodash: ^4.17.21
  * I used this package to type check for error handling purposes 
* #### fs: 0.0.1-security
  * I used this to read/write to/from a json file as a means of 'persistant' storage 
* #### mocha: ^10.0.0
* #### chai: ^4.3.6
  * I used the above two packages for writing basic unit tests and I chose them becasue the solutions they provide fit my use case and the syntax is very intuitive 
* #### eslint: ^8.20.0
* #### eslint-config-airbnb-base: ^15.0.0
  * The above two packages were used to enforce code style and format, helping to improve readability and refactorability for teammates current and future. (something i personally look for during code review)

## Setup
To get started testing out this app
* clone the repo `git clone https://github.com/bschaaf1017/rooms-to-go-terminal-inventory.git`
* Install the packages `npm install`
* Run the app `npm start`
* There are 2 ways to quit the REPL once started
  * `ctrl c`
  * or type `> EOF` and hit `return` 

There are some other commands i added and used while i was developing the app:
* finding linting errors `npm run lint`
* auto fixing any linting errors `npm run lint:fix`

## Implementation
I will included a link to a screen share with more detailed walk through but also provided more details below..
[link to screen share walkthrough on youtube](https://youtu.be/t4rUg1sY7PE)

The data does persist, I chose to go this route because it made it easier for me during development rather than having to add products and warehouses again after each restart. The data is stored in a json file and retreived each time its needed and then added to or updated and then wrote back. So basically for data storage i used JS objects like hash tables so i could search the data in constant time rather than having to loop through an array each time i needed to check for a procduct, warehouse, stock, etc. (obviously this solution would not work at scale)

I did implement a fuction that will "drop the DB" by running the command `> CLEAR`

Also i implemeted a history array which will allow the user hit the up/down arrow to loop through recent commands.

In addition to the hisory i added auto complete functionality so the user can hit the `TAB` key after begining to type any known command to the application and it will show auto complete options.

I added an additional feature/ command: `> DEBUG` running this command will render a table displaying all the commands that had been run in the order they where ran in. Given more time, more functiality i would have liked to have added to this command would be providing some flags to the command like `-d` would display command in desceding order or `-l <any_number>` would only display the most recent n number of commands, etc.

Also i know that commands were only supposed to be stored after two were entered, so i made the desision that if there was one sitting waiting for another but the app was terminated to go ahead and store it by itself.

### There are custom error messages for every command they are displayed for things like:
- I wasnt sure what all formats SKUs could come in so i made and assumption and created the regex to only allow SKUs in this format `AaBc1234-Aa12-Aa12-Aa12-AaBcEf123456`
#### ADD PRODUCT
- if the entered command doesnt contain all the required parameters  
- if SKU is invalid
- if product with that SKU already exists
- if the warehouse cant hold that much more stock
#### LIST PRODUCTS
- there are no products in DB
#### ADD WAREHOUSE
- No warehouse number provided
- Warehouse number is not type number
- Stock limit is not type number
- A warehouse with input number already exists
#### LIST WAREHOUSES
- No warehouses in DB
#### LIST WAREHOUSE
- no warehouse number provided
- provided warehouse number does not exisit
- Input warehouse number exists but there is nothing stoced in it yet
#### STOCK
- invalid number of parameters of format
- invalid sku
- no products with that SKU
#### UNSTOCK
- invalid number of parameters of format
- invalid sku
- no products with that SKU
- No warehouses with input number
- No products stocked with that sku at input warehouse
...and im sure there are prolly more that i missed

## Tests
I wrote a bunch of basic unit tests with the mocha/chai framework

you can run these test by running `npm run test`

list of things i tested which can be found in `test/test.spec.js`
### Product Controller
#### addProduct()
- should create a product
- if command doesnt have all parameters, should return error
- if SKU is not in proper format, should return error
- Should return error if trying to add product with SKU thats already in DB
- Should create product with same name as long as SKU is unique
#### listProduct()
- should return list of products if some exist
- if no products in DB should return error
### Warehouse Controller
#### listWarehouses()
- Should return error if no warehouses in DB
- Should return list of warhouses if some exist
#### addWarehouse()
- Should return error if command didnt include warehouse number
- Should return error if warehouse number wasnt type number
- Should sucessfully add a new warehouse
- Should sucessfully add a new warehouse without a stock limit
- Should sucessfully add a new warehouse with a stock limit
#### listSingleWarehouse()
- Should return error if no warehouse number is entered
- Should return error if input warehouse number doest exist
- Should return error if input warehouse has no products stocked in it
- The quantitly of BEDs in Warehouse 444 should 200
### Stock Controller
#### stockProduct()
- Should return error if STOCK command doesnt contain required parameters
- Should return error if SKU is not valid format
- Should return error if there are no products in stock with input SKU
- Should return error if there are no warehouses with input warehouse number
- Should return error if input stock qty exceeds warehouse stock limit
- Should properly update warehouse stock limit if one exists
- Should properly update stock qty if warehouse already has stock of input product
#### unstockProduct()
- Should return error if UNSTOCK command doesnt contain required parameters
- Should return error if SKU is not valid format
- Should return error if there are no products in stock with input SKU
- Should return error if there are no warehouses with input warehouse number
- Should return error if warehouses has no products with input sku in stock
- Should set Stock qty to 0 if input qty is > than current stock
- Should return error if Stock qty at input warehouse is 0
- Should properly update stock qty at input warehouse

