const fs = require('fs')
const fsp = require('fs/promises')
const path = require('path')

const storePath = process.env.DATABASE_PATH
  ? path.resolve(process.env.DATABASE_PATH)
  : path.join(__dirname, 'data', 'contents.json')

const storeDir = path.dirname(storePath)
let queue = Promise.resolve()

async function ensureStoreFile() {
  await fsp.mkdir(storeDir, { recursive: true })

  if (!fs.existsSync(storePath)) {
    await fsp.writeFile(storePath, JSON.stringify({ lastId: 0, contents: [] }, null, 2))
  }
}

async function readStore() {
  await ensureStoreFile()

  const raw = await fsp.readFile(storePath, 'utf8')

  if (!raw.trim()) {
    return { lastId: 0, contents: [] }
  }

  try {
    const parsed = JSON.parse(raw)
    return {
      lastId: Number(parsed.lastId) || 0,
      contents: Array.isArray(parsed.contents) ? parsed.contents : [],
    }
  } catch {
    return { lastId: 0, contents: [] }
  }
}

async function writeStore(store) {
  await ensureStoreFile()
  await fsp.writeFile(storePath, JSON.stringify(store, null, 2))
}

function enqueue(task) {
  queue = queue.then(task, task)
  return queue
}

function normalize(sql) {
  return String(sql).replace(/\s+/g, ' ').trim().toUpperCase()
}

function invokeCallback(cb, err, result) {
  if (typeof cb === 'function') {
    cb.call(result || {}, err, result)
  }
}

const db = {
  all(sql, params, cb) {
    enqueue(async () => {
      try {
        const store = await readStore()
        if (normalize(sql).startsWith('SELECT * FROM CONTENTS')) {
          invokeCallback(cb, null, store.contents)
          return
        }

        throw new Error(`Unsupported query: ${sql}`)
      } catch (error) {
        invokeCallback(cb, error)
      }
    })
  },

  get(sql, params, cb) {
    enqueue(async () => {
      try {
        const store = await readStore()
        const normalized = normalize(sql)

        if (normalized === 'SELECT * FROM CONTENTS WHERE KEY = ?') {
          const key = Array.isArray(params) ? params[0] : undefined
          const row = store.contents.find((item) => item.key === key)
          invokeCallback(cb, null, row)
          return
        }

        throw new Error(`Unsupported query: ${sql}`)
      } catch (error) {
        invokeCallback(cb, error)
      }
    })
  },

  run(sql, params, cb) {
    enqueue(async () => {
      try {
        const store = await readStore()
        const normalized = normalize(sql)

        if (normalized === 'INSERT INTO CONTENTS (KEY, TYPE, VALUE, URL) VALUES (?, ?, ?, ?)') {
          const [key, type, value, url] = Array.isArray(params) ? params : []
          const nextId = store.lastId + 1
          const row = { id: nextId, key, type, value, url }
          store.lastId = nextId
          store.contents.push(row)
          await writeStore(store)
          invokeCallback(cb, null, { lastID: nextId, changes: 1 })
          return
        }

        if (normalized === 'UPDATE CONTENTS SET TYPE = ?, VALUE = ?, URL = ? WHERE KEY = ?') {
          const [type, value, url, key] = Array.isArray(params) ? params : []
          const row = store.contents.find((item) => item.key === key)

          if (!row) {
            invokeCallback(cb, null, { changes: 0 })
            return
          }

          row.type = type
          row.value = value
          row.url = url
          await writeStore(store)
          invokeCallback(cb, null, { changes: 1 })
          return
        }

        throw new Error(`Unsupported query: ${sql}`)
      } catch (error) {
        invokeCallback(cb, error)
      }
    })
  },
}

console.log(`Database store ready at ${storePath}`)

module.exports = db
