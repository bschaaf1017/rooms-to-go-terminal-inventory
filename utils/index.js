module.exports = {
  commandType: (input) => {
    const command = input.split(' ')
    console.log('command:', command)
  },
}