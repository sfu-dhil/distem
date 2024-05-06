<script setup>
import useToast from '../composables/useToast'
import Toast from './Toast.vue'

const {
  toasts,
} = useToast()
</script>

<template>
  <div class="position-relative" aria-live="assertive" aria-atomic="true">
    <div id="toast-container" class="position-fixed top-50 start-50 translate-middle">
      <Toast v-for="toast in toasts" :toast="toast"></Toast>
    </div>
  </div>
</template>