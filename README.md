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
  * This is the package I used for listening for input in the terminal and rendering text with different styles and colors
  * I chose this specific package because it seemed to be one of the most widely used, with the best documentation and was well maintained
* #### lodash: ^4.17.21
  * I used this package to type check for error handling purposes 
* #### fs: 0.0.1-security
  * I used this to write and read to a json file as a means of 'persistant' storage 
* #### mocha: ^10.0.0
* #### chai: ^4.3.6
  * I used the above two packages for writing basic unit tests and I chose them becasue i felt the solutions they provide fit my use case and the syntax is very intuitive 
* #### eslint: ^8.20.0
* #### eslint-config-airbnb-base: ^15.0.0
  * The above two packages were used to enforce code style and format 

## Setup
To get started testing out this app
* clone the repo `git clone https://github.com/bschaaf1017/rooms-to-go-terminal-inventory.git`
* Install the packages `npm install`
* Run the app `npm start`

There are some other commands i added and used while i was developing the app:
* finding linting errors `npm run lint`
* auto fixing any linting errors `npm run lint:fix`
