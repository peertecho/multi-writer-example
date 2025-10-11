#!/usr/bin/env node

const { isPear, isBare } = require('which-runtime')
const { command, flag } = require('paparam')
const os = require('os')
const process = require('process')
const goodbye = require('graceful-goodbye')

const MultiWriterRoom = require('.')

const cmd = command('multi-writer',
  flag('--storage|-s <storage>', 'Storage location'),
  flag('--invite|-i <invite>', 'Room invite')
)

let args = []
if (isPear) args = global.Pear.config.args
else if (isBare) args = global.Bare.argv.slice(2)
else args = process.argv.slice(2)

main(args)

async function main (args) {
  cmd.parse(args)
  if (!cmd.running) return

  const room = new MultiWriterRoom(cmd.flags)
  goodbye(() => room.close())
  await room.ready()

  console.log('\nInvite:', await room.createInvite())

  await saveUserInfo(room)
}

/** @type {function(MultiWriterRoom)} */
async function saveUserInfo (room) {
  const userInfo = os.userInfo()
  const userId = `${os.hostname()} ~ ${process.cwd()} ~ ${room.storage}`
  await room.addUser(userId, { ...userInfo, pid: process.pid, at: new Date().toISOString() })

  const users = await room.getUsers()
  console.log('Users:')
  users
    .sort((a, b) => new Date(b.at) - new Date(a.at))
    .slice(0, 5)
    .forEach((user) => {
      console.log(`- ${JSON.stringify(user)}`)
    })
}
