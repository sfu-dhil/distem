<script setup>
import useAppState from '../composables/useAppState'
import useToast from '../composables/useToast'
import useModal from '../composables/useModal'

const {
  selected,
  animating,
} = useAppState()
const {
  addToast,
} = useToast()
const {
  showBibliographyModal,
} = useModal()

const props = defineProps({
  collection: {
    type: Object,
    required: true,
  }
})

const selectCollection = () => {
  const collection = props.collection
  if(!animating.value) {
    if (collection.collections.length > 0) {
      selected.value = collection
    } else if (collection.items.length > 0) {
      showBibliographyModal(collection.items)
    } else {
      addToast({
        content: `No items for ${collection.title}`,
        error: true,
      })
    }
  }
}
</script>

<template>
  <button @click="selectCollection" :class="selected == collection ? 'active' : ''" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
    {{ collection.title }}
    <span v-if="collection.collections.length > 0" class="badge text-bg-secondary rounded-pill">{{ collection.collections.length }}</span>
    <span v-if="collection.items.length > 0" class="badge text-bg-primary rounded-pill">{{ collection.items.length }}</span>
  </button>
</template>