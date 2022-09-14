import { dbFunc } from "./dbfactory"
import { createStore } from 'vuex'
import { db } from "./dbfactory"
import { traverseDir } from '@/utils/fileutils'

const fs = require('fs')
const pathUtil = require("path")

export const store = createStore({
    state: {
        loading: false,
        searching: false,
        samplesisEmpty: true,
        currentLoadNum: 0,
        samples: [],
        folders: [],
        searchedSamples: [],
        searchCount: 0,
        settings: {},
        isSearchRandomize: false,
    },
    mutations: {
        samplesReload(state, sampleList) {
            state.samples = sampleList
        },
        foldersReload(state, folderList) {
            state.folders = folderList
        },
        settingsReload(state, settingsObj) {
            state.settings = settingsObj
        },
        loading(state) {
            state.loading = true
        },
        loaded(state) {
            state.loading = false
            state.currentLoadNum = 0
        },
        searching(state) {
            state.searching = true
        },
        searched(state) {
            state.searching = false
        },
        addFolder(state, folder) {
            state.folders.push(folder)
        },
        addSample(state, sample) {
            state.samples.push(sample)
        },
        currentLoading(state) {
            state.currentLoadNum += 1
        },
        searchedSamplesReload(state, samplesList) {
            state.searchedSamples = samplesList
        },
        addSearchedSamples(state, sampleList) {
            state.searchedSamples.concat(sampleList)
        },
        searchCountIm(state, num) {
            state.searchCount += num
        },
        updateSample(state, needChange) {
            try {
                const index = state.samples.findIndex(i =>
                    i.samplePath === needChange.samplePath
                )
                state.samples[index] = needChange
            }catch {}
            try {
                const u = state.searchedSamples.findIndex(i => 
                    i.samplePath === needChange.samplePath
               )
               state.searchedSamples[u] = needChange
            }catch {}
        },
        searchRandomizeToggle(state) {
            const t = state.isSearchRandomize
            state.isSearchRandomize = !t
        }
    },
    getters: {
        getSamples(state) {
            return state.samples
        },
        getFolders(state) {
            return state.folders
        },
        getStaredSamples(state) {
            return state.samples.filter(i => i.stared)
        }
    },
    actions: {
        async updateSamplesAction({ commit }) {
            commit('loading')
            const samples = await dbFunc.getAllSamples()
            commit('samplesReload', samples)
            commit('loaded')
        },
        async updateFoldersAction({ commit }) {
            commit('loading')
            const folders = await dbFunc.getAllFolders()
            commit('foldersReload', folders)
            commit('loaded')
        },
        async updateAllAction({ commit }) {
            commit('loading')
            const folders = await dbFunc.getAllFolders()
            commit('foldersReload', folders)
            const samples = await dbFunc.getAllSamples()
            commit('samplesReload', samples)
            commit('loaded')
        },
        async updateSettings({ commit }) {
            commit('loading')
            const s = await dbFunc.getSettings()
            commit('settingsReload', s)
            commit('loaded')
        },
        async setSettings({ commit }, kvp) {
            dbFunc.setSettings(kvp)
            const s = await dbFunc.getSettings()
            commit('settingsReload', s)
        },
        toggleRandomize({ commit }) {
            commit('searchRandomizeToggle')
        },
        async addPath({ commit }, path) {
            commit('loading')
                const p = await db.samplesfolderdb.find({ folderPath: path } )
                for(const j of p) {
                    if (j.folderPath === path){
                        setTimeout(() => {
                            commit('loaded')
                        }, 800);
                        return;
                    }
                }
                let files = traverseDir()(path)
                if (!files) return
                let audioFiles = []
                for (const f of files) {
                    let baseName = pathUtil.basename(f)
                    if (pathUtil.extname(baseName) === ".wav" ||
                        pathUtil.extname(baseName) === ".mp3" ||
                        pathUtil.extname(baseName) === ".ogg") audioFiles.push(f)
                }
                for (const af of audioFiles) {
                    let baseName = pathUtil.basename(af)
                    let fstat = fs.statSync(af)
                    let fileModel = {
                        sampleName: baseName,
                        relatvePath: path,
                        sampleFormat: pathUtil.extname(baseName),
                        samplePath: af,
                        sampleSize: fstat.size,
                        stared: false
                    }
                    await dbFunc.addSample(fileModel)
                    commit('addSample', fileModel)
                    commit('currentLoading')
                }
                commit('currentLoading')
                let pathModel = {
                    folderPath: path,
                    size: audioFiles.length,
                }
                await db.samplesfolderdb.insert(pathModel, (err, s) => console.error(err))

                setTimeout(() => {
                    commit('currentLoading')
                }, 800)
                commit('addFolder', pathModel)
                setTimeout(() => {
                    commit('loaded')
                }, 800);
        },
        async removePath({ commit, state }, path) {
            commit('loading')
                await dbFunc.deletePath(path)
                await db.samplesfolderdb.remove({folderPath: path}, { multi: true }, (err, num) => console.err(err))
                commit('currentLoading')
                const samples = await dbFunc.getAllSamples()
                commit('samplesReload', samples)
                const folders = await dbFunc.getAllFolders()
                commit('foldersReload', folders)
            setTimeout(async ()=>{
                commit('loaded')
            }, 1000)
        },
        async initSearched({ commit, state }) {
            commit('loading')
            state.searchedSamples.length = 0
            for(let i = 0; i <= 20; i++) {
                const result = await dbFunc.findSamplesRandomly()
                if(result === undefined || result === null) break
                state.searchedSamples.push(result[0])
            }
            commit('loaded')
        },
        async loadMoreRandom( { commit, state } ) {
            for(let i = 0; i <= 10; i++) {
                const result = await dbFunc.findSamplesRandomly()
                if(result === undefined || result === null) break
                state.searchedSamples.push(result[0])
            }
        },
        async starSample( {commit}, s) {
            commit('loading')
            const b = !s.stared
            const result = await dbFunc.updateSamples({samplePath: s.samplePath}, {$set: {stared: b}})
            if(result.length > 0) {
                for(let i of result) {
                    commit('updateSample', i)
                }
            }
            commit('loaded')
        },
        searchSamplesRegular({ commit, state }, str) {
            if (state.searching) return
            state.searchCount = 0
            state.searchedSamples.length = 0
            commit('searching')
            const r = []
            const strLowCased = str.toLowerCase()
            const splited = strLowCased.split(" ")
            for (let s_i = 0, s_len = state.samples.length; s_i < s_len; s_i++) {
                let j = state.samples[s_i]
                let ir = 0
                for (let s_t = 0, t_len = splited.length; s_t < t_len; s_t++) {
                    if (j.sampleName.toLowerCase().includes(splited[s_t])) {
                        ir++
                    }
                }
                if (ir === splited.length) {
                    r.push(j)
                }
            }
            if(r === undefined || r === null || r.length <= 0) {
                commit('searched')
                return
            }
            for(let obj of r) {
                if(obj === undefined || obj === null) {
                    commit('searched')
                    return
                }
            }
            const re = []
            let times = r.length < 200 ? r.length : 200
            if (state.isSearchRandomize) {
                let stimes = r.length < 100 ? r.length : 100
                for(let f = 0; f <= stimes; f++) {
                    const skiption = Math.floor(Math.random() * r.length)
                    if(r[skiption] === undefined) break
                    re.push(r[skiption])
                }
            } else {
                for(let f = 0; f <= times; f++) {
                    if(r[f] === undefined) break
                    re.push(r[f])
                }
            }
            // if(result === undefined || result === null) return
            if(re === undefined || re === null) {
                commit('searched')
                return
            }
            commit('searchCountIm', 50)
            commit('searchedSamplesReload', re)
            commit('searched')
        },
    }
})