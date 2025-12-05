#!/usr/bin/env node
import { Command } from "commander"

const program = new Command()

program
    .name("timkit")
    .description("CLI for Timkit UI")
    .version("0.0.1")

program.command("init")
    .description("Initialize Timkit UI in your project")
    .action(() => {
        console.log("Initializing Timkit UI...")
    })

program.parse()
