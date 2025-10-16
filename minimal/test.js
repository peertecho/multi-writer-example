const test = require('brittle')
const createTestnet = require('hyperdht/testnet')

const MultiWriterRoom = require('.')

test('basic', async t => {
  const { testnet, bootstrap } = await setupTestnet(t)

  const { room: roomWriter1, invite } = await createRoom(t, { bootstrap })
  const { room: roomWriter2 } = await createRoom(t, { bootstrap, invite })

  t.is(roomWriter1.base.key.toString('hex'), roomWriter2.base.key.toString('hex'), 'both roomWriters should have the same key')
  t.is(roomWriter1.base.writable, true, 'roomWriter1 should be writable')
  t.is(roomWriter2.base.writable, true, 'roomWriter2 should be writable')

  await roomWriter1.addUser('user1', { hello: 'world', at: new Date().toISOString() })

  const user = await getUser(roomWriter2)
  t.is(user.id, 'user1', 'correct user id')
  t.is(user.info.hello, 'world', 'correct user info')

  await roomWriter2.close()
  await roomWriter1.close()
  await testnet.destroy()
})

/** @type {function(MultiWriterRoom)} */
async function getUser (room) {
  const users = await room.getUsers()
  const user = users.find(item => item.id === 'user1')
  if (user) return user

  await new Promise(resolve => setTimeout(resolve, 100))
  return getUser(room)
}

async function createRoom (t, { bootstrap, invite }) {
  const storage = await t.tmp()
  const room = new MultiWriterRoom({ storage, bootstrap, invite })
  t.teardown(() => room.close(), { order: 2000 })
  await room.ready()
  return { room, invite: invite || await room.createInvite() }
}

async function setupTestnet (t) {
  const testnet = await createTestnet()
  t.teardown(() => testnet.destroy(), { order: 5000 })
  const bootstrap = testnet.bootstrap
  return { testnet, bootstrap }
}
