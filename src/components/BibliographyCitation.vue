<script setup>
const props = defineProps({
  bibliography: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="mb-3">
    <cite v-html="bibliography"></cite>
  </div>
</template>