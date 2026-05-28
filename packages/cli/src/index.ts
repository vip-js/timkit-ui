#!/usr/bin/env node
import { Command } from 'commander'

import { add } from './commands/add'
import { agent } from './commands/agent'
import { doctor } from './commands/doctor'
import { generatePlatforms } from './commands/generate'
import { init } from './commands/init'
import { list } from './commands/list'

const program = new Command()

program.name('timkit').description('CLI for Timui').version('0.0.1')

program.addCommand(init)
program.addCommand(add)
program.addCommand(agent)
program.addCommand(list)
program.addCommand(doctor)
program.addCommand(generatePlatforms)

program.parse()
