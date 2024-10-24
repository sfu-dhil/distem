<script setup>
import { useTemplateRef, onMounted, computed, watch, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useDisplayStore } from '../../stores/display.js'
import { useData } from '../../stores/data.js'
import { Modal } from 'bootstrap'
import getBibliography from "../../lib/bibliography.js"
import BibliographyCitation from '../BibliographyCitation.vue'


const displayStore = useDisplayStore()
const {
  modalBibliographyShown,
  modalBibliographyCollectionKey,
} = storeToRefs(displayStore)
const {
  collectionMap,
} = useData()

const modalEl = useTemplateRef('bibliography-modal')

const collection = computed(() => collectionMap.get(modalBibliographyCollectionKey.value))
const bibliographyItems = computed(() => getBibliography(collection.value?.items || []))

const toggleModal = (show) => {
  if (modalEl.value) {
    const bsModal = Modal.getOrCreateInstance(modalEl.value)
    show ? bsModal.show() : bsModal.hide()
  }
}
watch(modalBibliographyShown, async (newValue, oldValue) => {
  if (newValue !== oldValue) { toggleModal(newValue) }
})
onMounted(() => {
  toggleModal(modalBibliographyShown.value)
  modalEl.value.addEventListener('hidden.bs.modal', () => modalBibliographyShown.value = false)
  modalEl.value.addEventListener('shown.bs.modal', () => modalBibliographyShown.value = true)
})
</script>

<template>
  <div ref="bibliography-modal" class="modal" tabindex="-1">
      <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
          <div class="modal-content">
              <div class="modal-header">
                  <h5 class="modal-title">Bibliography</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <BibliographyCitation v-for="bibliography in bibliographyItems" :bibliography="bibliography"></BibliographyCitation>
              </div>
          </div>
      </div>
  </div>
</template>