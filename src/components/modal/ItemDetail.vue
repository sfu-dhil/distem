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
  modalItemDetailShown,
  modalItemDetailItemId,
} = storeToRefs(displayStore)
const {
  itemMap,
} = useData()

const modalEl = useTemplateRef('item-detail-modal')

const item = computed(() => itemMap.get(modalItemDetailItemId.value))
const title = computed(() => item.value?.shortTitle ? item.value?.shortTitle : item.value?.title)
const bibliographyItems = computed(() => item.value ? getBibliography([item.value]) : '')

const toggleModal = (show) => {
  if (modalEl.value) {
    const bsModal = Modal.getOrCreateInstance(modalEl.value)
    show ? bsModal.show() : bsModal.hide()
  }
}
watch(modalItemDetailShown, async (newValue, oldValue) => {
  if (newValue !== oldValue) { toggleModal(newValue) }
})
onMounted(() => {
  toggleModal(modalItemDetailShown.value)
  modalEl.value.addEventListener('hidden.bs.modal', () => modalItemDetailShown.value = false)
  modalEl.value.addEventListener('shown.bs.modal', () => modalItemDetailShown.value = true)
})
</script>

<template>
  <div ref="item-detail-modal" class="modal" tabindex="-1">
      <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
          <div class="modal-content">
              <div class="modal-header">
                  <h5 class="modal-title">{{ title }}</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <img v-if="item?.coverImage" class="cover-image rounded float-start mx-3 mb-3"
                  :src="item?.coverImage" :alt="`${item?.title} cover image`" />
                <BibliographyCitation v-for="bibliography in bibliographyItems" :bibliography="bibliography"></BibliographyCitation>
                <p class="mb-3">{{ item?.abstract }}</p>
                <div class="my-3 d-grid gap-2 d-md-flex justify-content-md-end">
                  <a v-if="item?.DOI" :href="`https://doi.org/${item?.DOI}`" class="btn btn-primary" target="_blank">Source</a>
                  <a v-if="item?.URL" :href="item?.URL" class="btn btn-primary" target="_blank">Website</a>
                </div>
              </div>
          </div>
      </div>
  </div>
</template>

<style lang="scss" scoped>
.cover-image {
  max-width: 200px;
}
</style>