<template>
  <div id="sample-path-single" class="noselect" @click="onclickCallback">
    <div id="sample-path-view-left">
      <i class="fa-regular fa-folder folder-icon"></i>
      <div id="sample-path-view-left-column">
        <span id="sample-path">
          {{folder.folderPath}}
        </span>
      </div>
    </div>
    <div id="sample-path-view-right">
      <span id="size">
        Count: {{ folder.size }}
      </span>
      <i class="fa-solid fa-trash trashico"></i>
    </div>
  </div>
</template>

<script>
import '../../assets/css.css'

export default {
  name: 'SamplePathComponent',
  props: [ 'folder', 'onclickCallback']
}
</script>

<style scoped>
  #sample-path-single {
    color: var(--text-sample-comp-normal);
    font-size: 18px;
    display: flex;
    flex-direction: row;
    padding: 0.5rem;
    margin: 0.5rem;
    margin-left: 2.5rem;
    margin-right: 2.5rem;
    border: var(--border-sample-comp-black);
    border-radius: 0.5em;
    border-style:ridge;
    background-color: var(--bg-sample-comp-black);
    box-shadow: 5px 4px 5px var(--bg-sample-comp-shadow);
    transition: 0.1s;
    cursor: pointer;
  }
  #sample-path-single:hover {
    background-color: var(--hover-bg-sample-comp-black);
    transition: 0.1s;
    transform: translate(5px);
  }
  #sample-path-view-left{
    align-items: center;
    display: flex;
    flex-direction: row;
    flex: 1;
  }
  #sample-path-view-left-column {
    display: flex;
    flex-direction: column;
  }
  .folder-icon {
    padding-right: 1rem
  }
  .trashico {
    margin-left: 0.8rem;
  }
</style>
