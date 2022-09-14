<script>
import SidebarLink from './SidebarLink'
import { collapsed, toggleSidebar, sidebarWidth } from './state'

export default {
  props: {},
  components: { SidebarLink },
  setup() {
    return { collapsed, toggleSidebar, sidebarWidth }
  }
}
</script>

<template>
  <div class="sidebar" :style="{ width: sidebarWidth }">
    <h1>
      <span class="noselect">Sample Packs Manager</span>
    </h1>

    <SidebarLink to="/" icon="fas fa-search">Search</SidebarLink>
    <SidebarLink to="/favorite" icon="fas fa-star">Favorite</SidebarLink>
    <SidebarLink to="/settings" icon="fa fa-gear">Settings</SidebarLink>
  </div>
</template>

<style>

</style>

<style scoped>
.sidebar {
  color: var(--text-sidebar-title-white);
  background-color: var(--sidebar-bg-color);
  float: left;
  position: fixed;
  z-index: 1;
  top: 3rem;
  left: 0;
  bottom: 0;
  padding: 0.5em;
  transition: 0.2s ease;
  display: flex;
  flex-direction: column;
}
.noselect {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently
                                    supported by Chrome, Edge, Opera and Firefox */
}
.sidebar h1 {
  height: 3.5em;
}

.collapse-icon {
  position: absolute;
  bottom: 0;
  padding: 0.75em;
  color: rgba(255, 255, 255, 0.7);
  transition: 0.2s linear;
}

.rotate-180 {
  transform: rotate(180deg);
  transition: 0.2s linear;
}
</style>
