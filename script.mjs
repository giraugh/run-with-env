#!/usr/bin/env node
import { program } from 'commander'
import dotenv from 'dotenv'
import shell from 'shelljs'
import { existsSync } from 'fs'

const command = program
  .name('run-with-env')
  .description('Run an npm script with a given environment')
  .option('-e, --env <env>', 'path to .env file', (current, old) => Array.isArray(old) ? [...old, current] : [current], '.env')
  .argument('command', 'name of npm command to run')
  .parse()

const [script] = command.args
const { env } = command.opts() 

// Load dotenv file(s)
const dotEnvPaths = Array.isArray(env) ? env : [env]
dotEnvPaths.forEach(path => {
  // Check it exists
  if (!existsSync(path)) {
    console.error(`No such env file with path "${path}"`)
    process.exit()
  }

  // Load the file
  dotenv.config({ path, override: true })
})

// Run npm script
const res = shell.exec(`npm run ${script}`, {
  // env: process.env
})
