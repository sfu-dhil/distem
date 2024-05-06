import { ref } from 'vue'
import collections from '../../public/data/library.json'

const addParentReference = (collection, parent = null) => {
  collection.parent = parent
  if (collection.collections.length > 0) {
    collection.collections.forEach(subCollection => {
      addParentReference(subCollection, collection)
    })
  }
  return collection
}

const rootCollection = addParentReference({
  title: "Local Case Studies",
  collections,
  items: [],
})
const animating = ref(false)
const selected = ref(rootCollection)

const id_count = ref(0)
const generateId = (prefix = 'unique') => `${prefix}_${++id_count.value}`

export default function useAppState() {
  return {
    collection: rootCollection,
    animating,
    selected,
    generateId,
  }
}