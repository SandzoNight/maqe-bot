const MAQEBot = require('./MAQEBot')

test('bot should facing north by default', () => {
    const bot = new MAQEBot()
    expect(bot.facingDirection).toBe('North')
})

test('bot should start at X:0 Y:0 by default', () => {
    const bot = new MAQEBot()
    expect(bot.positionX).toEqual(0)
    expect(bot.positionY).toEqual(0)
})

test('bot should throw error on empty command', () => {
    const commandList = [
        '',
        null,
        undefined,
    ]
    commandList.forEach(command => {
        const bot = new MAQEBot()
        expect(() => bot.processCommand(command)).toThrowError()
    })
})

test('bot should be able to process valid commands', () => {
    const commandList = [
        'RW15RW1',
        'W5RW5RW2RW1R',
        'RRW11RLLW19RRW12LW1',
        'LLW100W50RW200W10',
        'LLLLLW99RRRRRW88LLLRL',
        'W55555RW555555W444444W1',
        'LLRRR',
        'LW'
    ]
    
    commandList.forEach(command => {
        const bot = new MAQEBot()
        expect(() => bot.processCommand(command)).not.toThrowError()
    })
})

test('bot angle should not exceed 360 degree', () => {
    const bot = new MAQEBot()
    bot.adjustAngleValue(1000)
    expect(bot.angle).toBeLessThanOrEqual(360)
    bot.adjustAngleValue(50000)
    expect(bot.angle).toBeLessThanOrEqual(360)
})

test('bot angle should not subceed 0 degree', () => {
    const bot = new MAQEBot()
    bot.adjustAngleValue(-1000)
    expect(bot.angle).toBeGreaterThanOrEqual(0)
    bot.adjustAngleValue(-50000)
    expect(bot.angle).toBeGreaterThanOrEqual(0)
})

test('bot should be facing North', () => {
    const commandList = [
        'W5RW5RW2RW1R', // N
    ]
    
    commandList.forEach(command => {
        const bot = new MAQEBot()
        bot.processCommand(command)
        expect(bot.facingDirection).toBe('North')
    })
})

test('bot should be facing East', () => {
    const commandList = [
        'LLLLLW99RRRRRW88LLLRL', // E
        'W55555RW555555W444444W1', // E
        'LLRRR', // E
    ]
    
    commandList.forEach(command => {
        const bot = new MAQEBot()
        bot.processCommand(command)
        expect(bot.facingDirection).toBe('East')
    })
})

test('bot should be facing South', () => {
    const commandList = [
        'RW15RW1', // S
        'RRW11RLLW19RRW12LW1', // S
    ]
    
    commandList.forEach(command => {
        const bot = new MAQEBot()
        bot.processCommand(command)
        expect(bot.facingDirection).toBe('South')
    })
})

test('bot should be facing West', () => {
    const commandList = [
        'LLW100W50RW200W10', // W
    ]
    
    commandList.forEach(command => {
        const bot = new MAQEBot()
        bot.processCommand(command)
        expect(bot.facingDirection).toBe('West')
    })
})

test('bot return valid result format', () => {
    const bot = new MAQEBot()
    expect(bot.toString()).toBe('X: 0 Y: 0 Direction: North')

    const exampleCommand = 'RW15RW1'
    bot.processCommand(exampleCommand)
    expect(bot.toString()).toBe('X: 15 Y: -1 Direction: South')
})

test('bot should walk equals to total steps', () => {
    const commandList = [
        {
            command: 'RW15RW1',
            totalSteps: 16,
        },
        {
            command: 'W5RW5RW2RW1R',
            totalSteps: 13,
        },
        {
            command: 'RRW11RLLW19RRW12LW1',
            totalSteps: 43,
        },
        {
            command: 'LLW100W50RW200W10',
            totalSteps: 360,
        },
        {
            command: 'LLLLLW99RRRRRW88LLLRL',
            totalSteps: 187,
        },
        {
            command: 'W55555RW555555W444444W1',
            totalSteps: 1055555,
        },
        {
            command: 'LLRRR',
            totalSteps: 0,
        },
        {
            command: 'LLRRRW',
            totalSteps: 1,
        },
    ]
    commandList.forEach(commandObject => {
        const bot = new MAQEBot()
        bot.processCommand(commandObject.command)
        expect(bot.totalSteps).toEqual(commandObject.totalSteps)
    })
})

test('bot should be at X:15 Y:1 Direction:South', () => {
    const commandList = [
        {
            command: 'RW15RB1',
        },
    ]
    commandList.forEach(commandObject => {
        const bot = new MAQEBot()
        bot.processCommand(commandObject.command)
        expect(bot.positionX).toEqual(15)
        expect(bot.positionY).toEqual(1)
        expect(bot.facingDirection).toEqual('South')
    })
})

test('bot can walk backwards', () => {
    const commandList = [
        {
            command: 'W15B15',
            x: 0,
            y: 0,
            direction: 'North',
        },
        {
            command: 'W14R2W1B1',
            x: 0,
            y: 14,
            direction: 'South',
        }
    ]
    commandList.forEach(commandObject => {
        const bot = new MAQEBot()
        bot.processCommand(commandObject.command)
        expect(bot.positionX).toEqual(commandObject.x)
        expect(bot.positionY).toEqual(commandObject.y)
        expect(bot.facingDirection).toEqual(commandObject.direction)
    })
})

test('can specify turning amount to bot', () => {
    const commandList = [
        {
            command: 'R2L1LR2',
            direction: 'South',
        },
        {
            command: 'RRRLLL4LRW1',
            direction: 'East',
        }
    ]
    commandList.forEach(commandObject => {
        const bot = new MAQEBot()
        bot.processCommand(commandObject.command)
        expect(bot.facingDirection).toEqual(commandObject.direction)
    })
})