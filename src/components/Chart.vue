<script setup>
import { useTemplateRef, onMounted, computed, watch, nextTick, ref } from 'vue'
import { storeToRefs } from 'pinia'
import * as d3 from "d3"
import anime from "animejs/lib/anime.es.js"
import { useDisplayStore } from '../stores/display.js'
import { useData } from '../stores/data.js'
import { useToast } from '../stores/toast.js'
import { Popover } from 'bootstrap'

const displayStore = useDisplayStore()
const {
  collectionAnimating,
  selectedCollectionKey,
} = storeToRefs(displayStore)
const {
  collectionMap,
} = useData()
const {
  addMissingContentToast,
} = useToast()

const svgEl = useTemplateRef('svg-el')
const gRootEl = useTemplateRef('g-root-el')
const width = defineModel('width')
const height = defineModel('height')
const popoverList = ref([])
const centerCircleEl = useTemplateRef('center-circle-el')

const selected = computed({
  get() {
    return collectionMap.get(selectedCollectionKey.value)
  },
  set(collection) {
    selectedCollectionKey.value = collection.key
  }
})
const parentCollection = computed(() => selected.value.parentKey ? collectionMap.get(selected.value.parentKey) : null)

const chunkWords = (string, chunkLength) => {
  const words = string.trim().split(/\s+/)
  const chunks = words.reduce((chunks, word) => {
    if(chunks[chunks.length - 1].length >= chunkLength) {
      chunks.push([])
    }
    chunks[chunks.length - 1].push(word)
    return chunks
  }, [[]])

  return chunks.map((chunk) => chunk.join(' '))
}

const animate = (reverse = false) => {
  const strokeDashoffset = {
    value: [ 0, (el) => {
        const pathLength = parseFloat(el.getAttribute("data-r")) * Math.PI * 2
        el.setAttribute("stroke-dasharray", pathLength)
        return pathLength
      }
    ],
  }
  const opacity = { value: [1, 0] }
  if (reverse) {
    strokeDashoffset.value.reverse()
    opacity.value.reverse()
  }
  return anime
    .timeline({
      easing: "cubicBezier(.28, .94, 1, .99)",
      loop: false,
      begin: () => { collectionAnimating.value = true },
      complete: () => { collectionAnimating.value = false },
    })
    .add({
      targets: "path",
      opacity,
      strokeDashoffset,
    })
    .add({
      targets: "circle",
      opacity,
      duration: 200,
    }, 100)
    .add(
      {
        targets: "text",
        opacity,
        duration: 200,
      },
      100
    )
}

const updateSVG = async () => {
  const svg = d3.select(svgEl.value)
    .attr("viewBox", `0 0 ${height.value} ${width.value}`)
  const g = d3.select(gRootEl.value)

  // Create a zoom handler
  const zoom = d3
    .zoom()
    .extent([
      [0, 0],
      [height.value, width.value]
    ])
    .scaleExtent([0.1, 8])
    .on("zoom", ({ transform }) => {
      return g.attr("transform", transform)
    })

  // And put it on the zoom thing
  svg.call(zoom)
  svg.call(zoom.transform, d3.zoomIdentity)
  svg.call(zoom.translateBy, height.value / 2, width.value / 2)

  popoverList.value.forEach((popover) => {
    popover.dispose()
  })
  const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
  popoverList.value = [...popoverTriggerList].map(popoverTriggerEl => Popover.getOrCreateInstance(popoverTriggerEl))

  await animate(true).finished
}

watch(selectedCollectionKey, (newSelected, oldSelected) => {
  if (newSelected !== oldSelected) {
    nextTick(() => {
      updateSVG()
    })
  }
})

onMounted(() => {
  nextTick(() => {
    updateSVG()
  })
})

const getArcPath = r =>`M 0 0
  m 0, ${r}
  a ${r}, ${r} 0 0, 1 0, ${r * -2}
  a ${r}, ${r} 0 0, 1 0, ${r * 2}
`
const getRadius = () => {
  return width.value / ((selected.value.collections.length + 1) * 2 + 1)
}
const decorateCollections = (collections) => {
  const colors = d3.quantize(d3.interpolateHcl("#60c96e", "#4d4193"), collections.length + 1)
  const radius = getRadius()
  const radiis = d3.range(radius, (width.value / 2), radius).reverse()

  const totalItems = collections.reduce( (total, collection) => total+=collection.items.length, 0)
  const orbitColors = d3.scaleSequential().domain([1, totalItems]).interpolator(d3.interpolateViridis)
  const orbitRotation = d3.scaleLinear()
    .range([0, 360])
    .interpolate(d3.interpolateRound)
  const orbitDuration = d3.scaleLinear()
    .range([100, 20])
    .interpolate(d3.interpolateRound)

  let itemCount = 0
  collections.forEach((collection, collectionIndex) => {
    const radii = radiis[collectionIndex]

    collection.ui = {
      totalItems,
      radius,
      radii,
      color: colors[collectionIndex],
      d: getArcPath(radii),
    }
    collection.items.forEach((item, itemIndex) => {
      item.ui = {
        radii,
        radius: radius * 0.3,
        color: orbitColors(++itemCount),
        rotation: orbitRotation(1.0 * itemIndex / collection.items.length),
        duration: orbitDuration(1.0 * (collectionIndex+1) / collections.length),
      }
    })
  })

  return collections
}

const changeSelected = async (collection) => {
  const animation = animate(false)
  await animation.finished
  selected.value = collection
}
const ringClick = (collection) => {
  const { collections, items, title } = collection
  if (collections.length > 0) {
    changeSelected(collection)
  } else if (items.length > 0) {
    displayStore.showBibliography(collection.key)
  } else {
    addMissingContentToast()
  }
}
const centerCircleClick = () => {
  if (parentCollection.value) {
    changeSelected(parentCollection.value)
  }
}
const updateAttribute = (target, attribute, value) => {
  target.setAttribute(attribute, value)
}
const pauseAnimations = () => {
  svgEl.value.pauseAnimations()
}
const unpauseAnimations = () => {
  svgEl.value.unpauseAnimations()
}
</script>

<!-- v-if="selected.collections && selected.collections.length > 0" -->
<template>
  <svg ref="svg-el" height="100%" width="100%" :viewBox="`0 0 ${height} ${width}`">
    <g ref="g-root-el">
      <g v-for="(collection, collectionIndex) in decorateCollections(selected.collections.slice().reverse())">
        <!-- white background -->
        <path stroke="#fff" stroke-opacity="1.0" :stroke-width="collection.ui.radius"
              fill="none" :data-r="collection.ui.radii" :d="collection.ui.d"
        ></path>
        <!-- ring -->
        <path :id="`svg_cat_${collectionIndex}`" class="ring"
              :stroke="collection.ui.color" stroke-opacity="0.3" :stroke-width="collection.ui.radius"
              fill="none" :data-r="collection.ui.radii" :d="collection.ui.d"
              @click="ringClick(collection)"
              @mouseover="updateAttribute($event.target, 'stroke-opacity', 0.5)"
              @mouseout="updateAttribute($event.target, 'stroke-opacity', 0.3)"
        ></path>
        <!-- item orbiting satellites -->
        <circle v-for="(item, itemIndex) in collection.items"
                :id="`satellite_${collectionIndex}_${itemIndex}`" class="satellite"
                x="0" :cy="item.ui.radii" :r="item.ui.radius"
                :fill="item.ui.color" fill-opacity="0.5" :title="item.shortTitle ? item.shortTitle : item.title"
                data-bs-toggle="popover" data-bs-trigger="hover"
                @click="() => displayStore.showItemDetail(item.id)"
                @mouseover="updateAttribute($event.target, 'fill-opacity', 1); pauseAnimations()"
                @mouseout="updateAttribute($event.target, 'fill-opacity', 0.5); unpauseAnimations()"
        >
          <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite"
                            :from="`${item.ui.rotation} 0 0`" :to="`${item.ui.rotation+360} 0 0`" :dur="item.ui.duration" />
        </circle>
        <!-- label -->
        <text class="label">
          <textPath startOffset="50%" :['xlink:href']="`#svg_cat_${collectionIndex}`">
            {{ collection.title }}
          </textPath>
        </text>
      </g>
      <!-- center circle -->
      <g>
        <!-- white background -->
        <path stroke="#fff" stroke-opacity="1.0" :stroke-width="getRadius() * 1.5"
              fill="none" :data-r="getRadius() * 0.75" :d="getArcPath(getRadius() * 0.75)"
        ></path>
        <!-- circle ring -->
        <path id="cat_center_circle" ref="center-circle-el" class="ring"
              stroke="#4d4193" stroke-opacity="0.3" :stroke-width="getRadius() * 1.5"
              fill="none" :data-r="getRadius() * 0.75" :d="getArcPath(getRadius() * 0.75)"
              @click="centerCircleClick()"
              @mouseover="updateAttribute($event.target, 'stroke-opacity', 0.5)"
              @mouseout="updateAttribute($event.target, 'stroke-opacity', 0.3)"
        ></path>
        <!-- label -->
        <text class="center_circle_label label"
              x="0" :y="`-${chunkWords(selected.title, 3).length * 0.5}em`"
              :title="parentCollection ? `Click to go back to <br />${parentCollection.title}` : ''"
              :data-bs-toggle="`${parentCollection ? 'popover' : ''}`" data-bs-trigger="hover" data-bs-html="true"
              @click="centerCircleClick()"
              @mouseover="updateAttribute(centerCircleEl, 'stroke-opacity', 0.5)"
              @mouseout="updateAttribute(centerCircleEl, 'stroke-opacity', 0.3)"
              text-anchor="middle" alignment-baseline="middle" xlink:href="#cat_center_circle">
          <tspan v-for="wordChunk in chunkWords(selected.title, 3)" x="0" dy="1em">{{ wordChunk }}</tspan>
        </text>
      </g>
    </g>
  </svg>
</template>


<style lang="scss" scoped>
svg {
  path.ring, circle.satellite, .center_circle_label {
    cursor: pointer;
  }

  text.label:not(.center_circle_label) {
    pointer-events: none;
  }

  text.label {
    textPath {
      text-anchor: middle;
    }
  }
}
</style>