#!/usr/bin/env node
import { Command } from 'commander'

import { add } from './commands/add'
import { doctor } from './commands/doctor'
import { init } from './commands/init'
import { list } from './commands/list'
import { generatePlatforms } from './commands/generate'

const program = new Command()

program.name('timkit').description('CLI for Timui').version('0.0.1')

program.addCommand(init)
program.addCommand(add)
program.addCommand(list)
program.addCommand(doctor)
program.addCommand(generatePlatforms)

program.parse()
