const DEBUG = false
if (DEBUG === false) {
    console.debug = () => null
}

module.exports = class MAQEBot {
    constructor(positionX = 0, positionY = 0, facingDirection = 'North') {
        this.positionX = positionX
        this.positionY = positionY
        this.facingDirection = facingDirection
        this.angle = this.mapFacingDirectionToAngle(facingDirection)
        this.totalSteps = 0
    }

    processCommand(command) {
        if (!command) {
            throw Error(`Command not found`)
        }
        for (let i = 0; i < command.length; i++) {
            const char = command.charAt(i)
            if (char === 'R' || char === 'L') {
                this.changeDirection(char)
                continue
            } else if (char === 'W') {
                const restCommand = command.substring(i+1)
                if (restCommand) {
                    const firstFollowingChar = restCommand.charAt(0)
                    if (!isNaN(firstFollowingChar)) {
                        let stepsString = ''
                        for (let j = 0; j < restCommand.length; j++ ) {
                            if (isNaN(restCommand.charAt(j)) === false) {
                                stepsString += parseInt(restCommand.charAt(j))
                            } else {
                                i=i+j
                                break
                            }
                        }
                        if (stepsString) {
                            this.walk(parseInt(stepsString))
                            continue
                        } else {
                            throw Error(`'W' command must be followed by number (command index: ${i}, ${command})`)
                        }
                    }
                    throw Error(`'W' command must be followed by number (command index: ${i}, ${command})`)
                } else {
                    throw Error(`'W' command must be followed by number (command index: ${i}, ${command})`)
                }
            }
        }
    }

    changeDirection(direction) {
        switch(direction) {
            case 'R' : {
                this.angle += 90
                break
            }
            case 'L' : {
                this.angle -= 90
                break
            }
        }
        this.adjustAngleValue(this.angle)
        this.adjustFacingDirectionFromAngle(this.angle)
        console.debug('change direction to', direction)
        console.debug('facing', this.facingDirection, this.angle)
    }

    adjustAngleValue(angle) {
        console.debug('incoming angle', angle)
        if (angle > 360) {
            this.angle = angle % 360
        } else if (angle < 0) {
            this.angle = (angle % 360 + 360) % 360
        }
        console.debug('adjust to', angle)
    }
    
    walk(step) {
        console.debug('walk', step)
        switch(this.angle) {
            case 90 : {
                this.positionY += step
                break
            }
            case 180 : {
                this.positionX += step
                break
            }
            case 270 : {
                this.positionY -= step
                break
            }
            case 0 : {
                this.positionX -= step
                break
            }
        }
        this.totalSteps += Math.abs(step)
    }
    
    mapFacingDirectionToAngle(facingDirection) {
        const directiontoAngleMap = {
            west: 0,
            north: 90,
            east: 180,
            south: 270,
        }
        return directiontoAngleMap[facingDirection.toLowerCase()]
    }

    adjustFacingDirectionFromAngle(angle) {
        switch(angle) {
            case 0 :
            case 360 : {
                this.facingDirection = 'West'
                break
            }
            case 90 : {
                this.facingDirection = 'North'
                break
            }
            case 180 : {
                this.facingDirection = 'East'
                break
            }
            case 270 : {
                this.facingDirection = 'South'
                break
            }
            default : {
                throw Error(`Unknown angle (angle: ${angle})`)
            }
        }
    }

    toString() {
        return `X: ${this.positionX} Y: ${this.positionY} Direction: ${this.facingDirection}`
    }
}
