<script setup>
import useAppState from '../composables/useAppState'
import SidebarList from './SidebarList.vue'

const {
  collection,
} = useAppState()
</script>

<template>
  <aside class="position-fixed top-0 bottom-0 start-0 p-0 m-0">
    <SidebarList :collection="collection"></SidebarList>
  </aside>
</template>