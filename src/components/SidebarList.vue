<script setup>
import SidebarButton from './SidebarButton.vue'

const props = defineProps({
  collection: {
    type: Object,
    required: true,
  }
})
</script>

<template>
  <div class="list-group list-group-flush list-group-item">
    <SidebarButton :collection="collection"></SidebarButton>

    <div v-if="collection.collections.length > 0" class="list-group list-group-flush list-group-item">
      <SidebarList v-for="c in collection.collections" :collection="c"></SidebarList>
    </div>
  </div>
</template>