<template>
  <div id="headbar">
    <div id="header-left">
        <svg xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink" 
        viewBox="0 0 512 512" class="svg">
            <path d="M432 32H80a64.07 64.07 0 0 0-64 64v320a64.07 64.07 0 0 0 64 64h352a64.07 64.07 0 0 0 64-64V96a64.07 64.07 0 0 0-64-64zM96 256a16 16 0 0 1-10-28.49L150.39 176L86 124.49a16 16 0 1 1 20-25l80 64a16 16 0 0 1 0 25l-80 64A16 16 0 0 1 96 256zm160 0h-64a16 16 0 0 1 0-32h64a16 16 0 0 1 0 32z" 
            fill="currentColor">   
            </path></svg>
        Sample Packs Manager
    </div>
    <div id="header-right">
        <span @click="minimizeWin" class="right-button">
            <svg class="svg-right minimize" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M5 12h14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
        </span>
        <span v-if="maximized" @click="toggleWinSize" class="right-button">
            <svg class="svg-right unmaximize" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 19v-2a2 2 0 0 1 2-2h2"></path><path d="M15 5v2a2 2 0 0 0 2 2h2"></path><path d="M5 15h2a2 2 0 0 1 2 2v2"></path><path d="M5 9h2a2 2 0 0 0 2-2V5"></path></g></svg>
        </span>
        <span v-else @click="toggleWinSize" class="right-button">
            <svg class="svg-right maximize" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8V6a2 2 0 0 1 2-2h2"></path><path d="M4 16v2a2 2 0 0 0 2 2h2"></path><path d="M16 4h2a2 2 0 0 1 2 2v2"></path><path d="M16 20h2a2 2 0 0 0 2-2v-2"></path></g></svg>
            
        </span>
        <span @click="close" class="right-button">
            <svg class="svg-right close" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18"></path><path d="M6 6l12 12"></path></g></svg>
            
        </span>
    </div>
  </div>
</template>

<script>
const remote = window.require('@electron/remote')
const win = remote.getCurrentWindow()
export default {
    data() {
        return{
            maximized: win.isMaximized()
        }
    },
    methods: {
        minimizeWin: function() {
            win.minimize()
        },
        toggleWinSize: function() {
            if(win.isMaximized()) {
                win.unmaximize()
            } else {
                win.maximize()
            }
            this.maximized = win.isMaximized()
        },
        close: function() {
            win.close()
        }
    },
    mounted() {
        win.on('maximize', (event) => {
            this.maximized = win.isMaximized()
        })
        win.on('unmaximize', (event) => {
            this.maximized = win.isMaximized()
        })
    }
}
</script>

<style>
    .svg {
        align-items: center;
        height: 17px;
        margin-right: 10px;
    }
    .svg-right {
        height: 18px;
        margin-left: 20px;
    }
    .right-button {
        display: flex;
        flex-direction: column;
        color: var(--text-title-normal);
        transition: 0.2s ease;
        border-radius: 100%;
        cursor: pointer;
        margin-right: 0.2rem;
    }
    .right-button:hover > svg {
        color: var(--text-title-hover);
        transition: 0.2s ease;
    }
    #header-left {
        display: flex;
        color: var(--text-title-normal);
        align-items: center;
        margin-top: 2px;
        margin-left: 2px;
        font-size: 14px;
    }
    #header-right {
        display: flex;
        margin-top: 2px;
        margin-right: 2px;
        align-items: bottom;
    }
    #headbar {
        align-items: center;
        display: flex;
        position: fixed;
        z-index: 999;
        top: 0;
        left: 0;
        right: 0;
        background-color: var(--headbar-bg-color);
        padding: 0.8rem;
        justify-content: space-between;
        -webkit-app-region: drag;

    }
    #header-right {
        -webkit-app-region: no-drag;
    }
</style>