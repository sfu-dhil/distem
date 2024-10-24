<script setup>
import { useTemplateRef, ref, onMounted, onUnmounted } from 'vue'
import Chart from '../Chart.vue'
import ToastContainer from '../toast/ToastContainer.vue'
import Bibliography from '../modal/Bibliography.vue';
import ItemDetail from '../modal/ItemDetail.vue';

const prototypeEl = useTemplateRef('prototype-el')

const width = ref(null)
const height = ref(null)

const updateSize = () => {
  width.value = prototypeEl.value.clientWidth
  height.value = prototypeEl.value.clientHeight
}
onMounted(() => {
  updateSize()
  // window.addEventListener('resize', updateSize)
})
onUnmounted(() => {
  // window.removeEventListener('resize', updateSize)
})
</script>

<template>
  <div ref="prototype-el" class="w-100 vh-100 overflow-y-hidden text-bg-dark">
    <Chart v-model:width="width" v-model:height="height"></Chart>
    <ToastContainer></ToastContainer>
    <Bibliography></Bibliography>
    <ItemDetail></ItemDetail>
  </div>
</template>