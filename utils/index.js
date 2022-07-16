const term = require( 'terminal-kit' ).terminal;

module.exports = {
  commandType: (input) => {
    if (input === '') {
      return 'Please enter a valid command';
    }
    const command = input.split(' ')

    console.log('command:', command)
  },
}