<script setup>
import { useToast } from '../../stores/toast.js'
import Toast from './Toast.vue'

const {
  toast,
} = useToast()
</script>

<template>
  <div class="position-relative" aria-live="assertive" aria-atomic="true">
    <div id="toast-container" class="position-fixed top-50 start-50 translate-middle">
      <Toast v-if="toast" v-model:toast="toast"></Toast>
    </div>
  </div>
</template>