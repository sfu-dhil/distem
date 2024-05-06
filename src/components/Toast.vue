<script setup>
import useToast from '../composables/useToast'
import useAppState from '../composables/useAppState'
import { onMounted } from 'vue'
import { Toast } from 'bootstrap'

const {
  generateId,
} = useAppState()
const {
  toasts,
  removeToast,
} = useToast()

const props = defineProps({
  toast: {
    type: Object,
    required: true,
  }
})

const { content, error } = props.toast
const id = generateId('toast')

onMounted(() => {
  const { autohide, delay } = props.toast
  const toastEl = document.querySelector(`#${id}`)
  const bsToast = new Toast(toastEl, {
    autohide,
    delay,
  })
  bsToast.show()
  toastEl.addEventListener('hidden.bs.toast', () => {
    removeToast(props.toast)
  })
})
</script>

<template>
  <div :id="id" :class="error ? 'text-bg-danger' : 'text-bg-primary'" class="toast align-items-center border-0 m-3" role="alert" aria-live="assertive" aria-atomic="true">
    <div class="d-flex">
      <div class="toast-body">{{ content }}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  </div>
</template>