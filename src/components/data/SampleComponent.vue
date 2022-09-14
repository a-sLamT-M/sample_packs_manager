<template>
  <div class="sample-single noselect dragable" @click="onclickCallback" draggable="true" @dragstart="ondragStart">
    <div id="sample-view-left" >
      <i class="fa-solid fa-file-waveform wavefile-icon" ></i>
      <div id="sample-view-left-column">
        <span id="sample-name">
          {{ HandledName }}
        </span>
        <span id="sample-path">
          {{ HandledPath }}
        </span>
      </div>
    </div>
    <div id="sample-view-right">
      <span id="size">
        Size: {{ sample.sampleSize }}
      </span>
      
      <div class="star-icon" @click="() => { onIconClicked() }">
        <i v-if="sample.stared" class="fa-solid fa-star star-icon-child stared"></i>
        <i v-else class="fa-regular fa-star star-icon-child" ></i>
      </div>
    </div>
  </div>
</template>

<script>
import '../../assets/css.css'

import { play, stop } from '@/utils/audioutils'
const { ipcRenderer } = require('electron')

export default {
  name: 'SampleComponent',
  props: ['sample', 'onStarclickCallback'],
  data() {
    return {
      toggled: false
    }
  },
  methods: {
    onclickCallback: function() {
      stop()
      play(this.sample.samplePath)
    },
    ondragStart: function(event) {
      event.preventDefault()
      ipcRenderer.send('ondragstart', this.sample.samplePath)
    },
  
    onIconClicked() {
      this.onStarclickCallback()
    },
  },
  computed: {
    HandledPath: function() {
      if(this.sample.samplePath.length >= 75) {
        return this.sample.samplePath.slice(0, 75) + '...'
      }
      return this.sample.samplePath
    },
    HandledName: function() {
      if(this.sample.sampleName.length >= 60) {
        return this.sample.sampleName.slice(0, 69) + '...'
      }
      return this.sample.sampleName
    }
  },
}
</script>
<style scoped>
  .sample-single {
    color: var(--text-sample-comp-normal);
    display: flex;
    padding: 0.5rem;
    margin: 0.5rem;
    margin-left: 2.5rem;
    margin-right: 2rem;
    background-color: var(--bg-sample-comp-black);
    border: var(--border-sample-comp-black);
    border-radius: 0.5em;
    border-style:ridge;
    box-shadow: 5px 5px 5px var(--bg-sample-comp-shadow);
    transition: 0.1s;
    cursor: pointer;
  }
  .sample-single:hover {
    background-color: var(--hover-bg-sample-comp-black);
    transition: 0.1s;
    transform: translate(8px);
  }
  #sample-view-left {
    display:flex;
    flex-direction: row;
    flex: 1;
  }
  #sample-view-right {
    display: flex;
  }
  #sample-view-left-column {
    align-items: flex-start;
    margin-left: 0.4rem;
    display: flex;
    flex-direction: column;
  }
  .star-icon-child {
    height: 15px;
    transition: 0.1s;
  }
  .star-icon-child:hover {
    transform: translateY(-5px);
    height: 20px;
    color: rgb(114, 119, 134);
    padding: 5px;
    transition: 0.1s;
  }
  #size {
    margin-right: 0.5rem;
    pointer-events: none;
    font-size: 13px;
  }
  #sample-path {
    font-size: 13px;
  }
  #sample-name {
    margin-bottom: 0.2rem;
    font-size: 15px;
  }
  .wavefile-icon {
    margin-top: 0.1rem;
    height: 15px;
  }
  .stared {
    color: rgb(95, 100, 114);
  }
</style>