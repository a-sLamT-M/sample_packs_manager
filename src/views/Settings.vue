<template>

  <div class="settings">
    <div id="droparea">
      <h2 class="noselect" v-if="loading">PLEASE WAIT</h2>
      <h2 class="noselect" v-if="loading">ACTIONS DONE: {{ currentLoadNum }} </h2>
      <h2 class="noselect" v-else>DROP YOUR SAMPLE FOLDER HERE</h2>
    </div>
    <loading class="setting-loading"
    v-model:active="loading"
    :can-cancel="false"
    >
  </loading>
  <div calss="paths-display" v-if="!loading">
    <h1 class="settings-head-text">General</h1>
    <SettingSwitch :active="isSearchRandomize" display="Searched Results Randomize" :onSwitchedCallback="toggleSearchRandomize"></SettingSwitch>
    <h1 class="settings-head-text">Paths</h1>
    <div class="sample-path-list" v-for="s in folders" :key="s">
      <SamplePathComponent :folder="s" :onclickCallback="() => removeFolder(s)"/>
    </div>
  </div>
  </div>

</template>

<script>
import Loading from 'vue-loading-overlay';

const fs = require('fs')
import { mapState, mapActions } from 'vuex';

import SettingSwitch from '@/components/setting/SettingSwtich.vue';

import SamplePathComponent from '@/components/data/SamplePathComponent.vue'
import '../assets/css.css'

export default {
  name: 'Settings',
  components: { SamplePathComponent, Loading, SettingSwitch },
  data()  {
      return {
        dropActive: false,
      }
  },
  computed: {
    ...mapState(
      ['folders', 'loading', 'currentLoadNum', 'isSearchRandomize']
    )
  },
  methods: {
    ...mapActions(
      ['updateFoldersAction','addPath','removePath','toggleRandomize']
    ),
    async toggleSearchRandomize() {
      this.toggleRandomize()
    },
    handleErr(err, s) {console.log(err, s)},
    menuName: function (path) {
      return `context-menu-${path.folderPath}`
    },
    async removeFolder(folder) {
      this.$swal.fire({
        title: 'Do you really want to remove this folder?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Yes',
        denyButtonText: `No`,     
      }).then(async (r) => {
        if(r.isConfirmed){
          this.removePath(folder.folderPath)
        } else {
          return
        }
      })
    },
    async dropEvent(e) {
      let dropArea = document.getElementById('droparea')
      dropArea.classList.remove("dropactive")
      this.dropActive = false
      e.stopPropagation()
      e.preventDefault()
      this.handleFile(e.dataTransfer.files)
    },
    handleFile(files) {
      if(this.loading) return
      if (!(files && files.length)) {return; }
      for (const f of files) {
        if(fs.statSync(f.path, this.handleErr).isDirectory()) {
            this.addPath(f.path)
          }
      }
    } 

  },
  async mounted() {
    this.updateFoldersAction()
    let dropArea = document.getElementById('droparea')
    dropArea.addEventListener('drop', this.dropEvent, false)
    dropArea.addEventListener('dragleave', (e) => {
      e.stopPropagation()
      e.preventDefault()
      this.dropActive = false
      dropArea.classList.remove("dropactive")
    })
    dropArea.addEventListener('dragover', (e) => {
      if(this.loading) return
      dropArea.classList.add("dropactive")
      e.stopPropagation()
      e.preventDefault()
      this.dropActive = true
    })
    dropArea.addEventListener('dragenter', (e) => {
      if(this.loading) return
      dropArea.classList.add("dropactive")
      e.stopPropagation()
      e.preventDefault()
      this.dropActive = true
    })
  }
}
</script>

<style>
.dropactive {
  background-color: rgba(255, 163, 163, 0.8);
}

.settings-head-text {
  color: var(--text-title-normal);
  margin-top: 0.8em;
  margin-left: 1.2em;
  font-weight: 100;
  text-align: left;
  letter-spacing: 0.03em;
  -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Old versions of Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none; /* Non-prefixed version, currently
                                      supported by Chrome, Edge, Opera and Firefox */
}

#droparea {
  margin-top: 3rem;
  border: dotted;
  margin-right: 2.5em;
  margin-left: 4rem;
  padding: 3.5em;
  color: var(--text-title-normal);
  -webkit-touch-callout: none;
  /* iOS Safari */
  -webkit-user-select: none;
  /* Safari */
  -khtml-user-select: none;
  /* Konqueror HTML */
  -moz-user-select: none;
  /* Old versions of Firefox */
  -ms-user-select: none;
  /* Internet Explorer/Edge */
  user-select: none;
  /* Non-prefixed version, currently
                                    supported by Chrome, Edge, Opera and Firefox */
}

.setting-loading {
  margin-top: 2rem;
  z-index: 999;
  top: 60%;
  left: 57%;

}

.drop-active {
  background-color: rgba(231, 234, 246, 0.8);
}
</style>
