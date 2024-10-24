<script setup>
import { useToast } from '../../stores/toast.js'
import { useTemplateRef, onMounted, computed, onUnmounted } from 'vue'
import { Toast } from 'bootstrap'


const toast = defineModel('toast')
const toastEl = useTemplateRef('toast-el')

const toastClass = computed(() => toast.value.error ? 'text-bg-danger' : 'text-bg-primary')
const content = computed(() => toast.value.content)
onMounted(() => {
  const bsToast = new Toast(toastEl.value, toast.value)
  bsToast.show()
  toastEl.value.addEventListener('hidden.bs.toast', () => toast.value = null)
})
onUnmounted(() => {
  toast.value = null
})
</script>

<template>
  <div ref="toast-el" :class="toastClass" class="toast align-items-center border-0 m-3" role="alert" aria-live="assertive" aria-atomic="true">
    <div class="d-flex">
      <div class="toast-body">{{ content }}</div>
      <button type="button" class="btn-close btn-close-white mx-3 px-2 m-auto " data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.toast {
  --bs-toast-max-width: 800px;

  .btn-close {
    margin-top: 1em !important;
  }
}
</style>
