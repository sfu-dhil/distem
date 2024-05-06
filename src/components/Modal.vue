<script setup>
import useAppState from '../composables/useAppState'
import useModal from '../composables/useModal'
import setupShowMore from "../lib/showMore.js"
import { Modal } from 'bootstrap'
import { onMounted, watch, nextTick } from 'vue'

const {
  generateId,
} = useAppState()
const {
  title,
  content,
  show,
} = useModal()

const id = generateId('app_modal')

watch(show, async (newShow, oldShow) => {
  if (newShow !== oldShow) {
    const modalEl = document.querySelector(`#${id}`)
    const bsModal = new Modal(modalEl)
    if (newShow === true) {
      bsModal.show()
    } else {
      bsModal.hide()
    }
  }
})

onMounted(() => {
  const modalEl = document.querySelector(`#${id}`)
  // const bsModal = new Modal(modalEl)
  // bsModal.show()
  modalEl.addEventListener('hidden.bs.modal', () => {
    show.value = false
  })
  modalEl.addEventListener('shown.bs.modal', () => {
    show.value = true
    nextTick(() => {
      setupShowMore()
    })
  })
})
</script>

<template>
  <div :id="id" class="modal" tabindex="-1">
      <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
          <div class="modal-content">
              <div class="modal-header">
                  <h5 class="modal-title" v-html="title"></h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body" v-html="content"></div>
          </div>
      </div>
  </div>
</template>