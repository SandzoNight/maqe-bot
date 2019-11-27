const MAQEBot = require('./MAQEBot')

const command = process.argv[2]
if (!command) {
    throw Error ('Missing robot command')
}
const robot = new MAQEBot()
robot.processCommand(command)
console.log(robot.toString())