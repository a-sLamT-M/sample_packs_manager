<template>
  <div class="topbar">
    <Headbar />
  </div>
  <Sidebar />
  <div :style="{ 'margin-left': sidebarWidth }" class="router-view">
    <router-view />
  </div>
</template>

<script>
import Sidebar from '@/components/sidebar/Sidebar'
import { sidebarWidth } from '@/components/sidebar/state'
import Headbar from '@/components/headbar/Headbar'
export default {
  components: { Sidebar, Headbar },
  setup() {
    return { sidebarWidth }
  }
}
</script>

<style>

 ::-webkit-scrollbar
{
    width:5px;
    height:16px;
    background-color:#F5F5F5;
}

::-webkit-scrollbar-track
{
    background-color:var(--scroll-bar-bg-black);
}

::-webkit-scrollbar-thumb
{
    background-color:var(--scroll-bar-black);
}

body{
  bottom: 0;
  background: var(--right-bg-black-color);
  background-size: auto;
  top:0;
      left:0;
      bottom:0;
      right:0;
}

.topbar {
  padding: 0.5rem;
}

:root {
  --sidebar-bg-color: #2b303b;
  --sidebar-item-hover: #21252e;
  --sidebar-item-active: #181a20;
  --headbar-bg-color: #1d1f25;
  --button-headbar-hover-normal: #34373f;
  --right-bg-black-color: #313642;
  --text-white-color: #949aa7;
  --text-sidebar-title-white: #e5e9f1;
  --text-sidebar-text-white: #d3d7df;
  --text-searchbar-active: #7e8db1;
  --text-searchbar-normal: #cdd1da;
  --text-title-normal: #cdd1da;
  --text-title-hover: #ffffff;
  --text-sample-comp-normal: #bfc3cc;
  --bg-sample-comp-black: #292d38;
  --bg-sample-comp-shadow: #24262ec2;
  --hover-bg-sample-comp-black: #17191f;
  --border-sample-comp-black: #272d3d00;
  --scroll-bar-bg-black: #1d1f25;
  --scroll-bar-black: #3f4657;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
