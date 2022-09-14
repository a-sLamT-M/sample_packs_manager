const fs = require('fs')
const Datastore = require('nedb-promises')
const pathUtil = require("path")

/* const _samplesDb = Datastore.create({
  filename: pathUtil.join(process.cwd(), "data", "samples.db"),
  autoload: true,
  inMemoryOnly: false
})
const _folderDb = Datastore.create({
  filename: pathUtil.join(process.cwd(), "data", "folders.db"),
  autoload: true,
  inMemoryOnly: false
})
**/
var dbsettings = {
  dbs: []
}
const dbsettingsPath = pathUtil.join(process.cwd(), 'data', 'dbsettings.json') 
const dataPath = pathUtil.join(process.cwd(), 'data')
const dbMaxCount = 8000
const maxLoadInsertableCalled = 500
var dbPool = []
loadSamplesDbPool()
export var db = {}
db.samplesdbs = []
loadDbs()
db.samplesfolderdb = Datastore.create({filename: pathUtil.join(process.cwd(), "data", "folders.db"), autoload: true})
var seFields = [
  { searchResultRandomize: false },
]
var insertableLoaded = maxLoadInsertableCalled
var currentDb

export const dbFunc = {
  reinit() {
    loadSamplesDbPool()
    loadDbs()
  },
  dbChanged() {
    for (const f of this.dbChangedEvent) {
      f();
    }
  },
  async addSample(sample) {
    await loadInsertableDb()
    await currentDb.insert(sample, (err, s) => console.error(err))
  },
  async findSamples(query) {
    const result = []
    for(const k of db.samplesdbs) {
      const l = k.find(query)
      if(l.length > 0) result = result.concat(l)
    }
    return result;
  },
  async updateSamples(query, value) {
    const r = []
    for(const k of db.samplesdbs) {
      const result = await k.update(query, value, {returnUpdatedDocs: true})
      if(result === undefined || result === null) break
      r.push(result)
    }

    return r
  },
  async deletePath(path) {
    for(const k of db.samplesdbs) {
      await k.remove({relatvePath: path}, { multi: true}, (err, num) => console.err(err))
    }
  },
  async findSamplesRandomly() {
    if(db.samplesdbs.length <= 0) return
    const dbSkiped = Math.floor(Math.random() * db.samplesdbs.length)
    const countOfDb = await db.samplesdbs[dbSkiped].count({})
    const samplesSkiped = Math.floor(Math.random() * countOfDb)
    const result = await db.samplesdbs[dbSkiped].find({}).skip(samplesSkiped).limit(1)
    return result;
  },
  async checkIfDbFull(db) {
    return await db.count({}) >= dbMaxCount
  },
  async checkIfFull() {
    const result = await db.samplesdbs[db.samplesdbs.length - 1].count({}) >= dbMaxCount
    return result 
  },
  addDbChangedEvent(func) {
    this.dbChangedEvent.push(func)
  },
  getAllFolders: async () => {
    return await db.samplesfolderdb.find({})
  },
  getAllSamples: async () => {
    let result = []
    for(const i of db.samplesdbs) {
      const h = await i.find({})
      if(h.length > 0) result = result.concat(h)
    }
    return result
  },
  getSettings: async () => {
    if (settingCount < 1) {
      let settingsDoc = {
        name: 'settings'
      }
      await db.settingsdb.insert(settingsDoc)
    }
    for(const value of seFields) {
      if(await db.settingsdb.count(value) <= 0) {
        await db.settingsdb.update({name: 'settings'}, { $addToSet: value})
      }
    }
    return await db.settingsdb.find({name: 'settings'})
  },
  setSettings: async (kvp) => {
    await db.settingsdb.update({name: 'settings'}, kvp)
  }
}

loadInsertableDb() 

function loadSamplesDbPool() {
  if(!fs.existsSync(dataPath)) fs.mkdirSync(dataPath)
  if (!fs.existsSync(dbsettingsPath, (err, s) => console.error(err))) {
    dbsettings.dbs.push('__samples_def.db')
    let json = JSON.stringify(dbsettings)
    fs.writeFileSync(dbsettingsPath, json, 'utf-8', (err, s) => console.error(err))
  }
  dbsettings = JSON.parse(fs.readFileSync(dbsettingsPath, 'utf8'))
  if (!dbsettings) return
  for(let u of dbsettings.dbs) {
      dbPool.push(u)
  }
}

function loadDbs() {
  for(let u of dbPool) {
    db.samplesdbs.push(Datastore.create({filename: pathUtil.join(process.cwd(), 'data', u), autoload: true}))
  }
}

function addSamplesDb() {
  const name = '__samples_' + dbPool.length + '.db'
  dbsettings.dbs.push(name)
  let json = JSON.stringify(dbsettings)
  fs.writeFileSync(dbsettingsPath, json, 'utf-8', (err, s) => console.error(err))
  dbPool.push(name)
  db.samplesdbs.push(Datastore.create({filename: pathUtil.join(process.cwd(), 'data', name), autoload: true}))
}

async function loadInsertableDb() {
  insertableLoaded++
  if(insertableLoaded <= maxLoadInsertableCalled) return
  insertableLoaded = 0
  for(let d of db.samplesdbs) {
    let dbCount = await d.count({})
    if(dbCount < 7500) currentDb = d
  }
  if(await dbFunc.checkIfFull()) {
    addSamplesDb()
  }
}