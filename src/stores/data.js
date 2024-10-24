import collections from '../../public/data/library.json'

const rootCollection = {
  key: 'root',
  title: "Local Case Studies",
  collections,
  items: [],
}
const collectionMap = new Map()
const itemMap = new Map()

const processCollection = (collection, parentKey = null) => {
  // add parentKey reference reference
  collection.parentKey = parentKey
  // add collection to collection Map
  collectionMap.set(collection.key, collection)

  // recursively process child collections
  if (collection.collections.length > 0) {
    collection.collections.forEach(subCollection => {
      processCollection(subCollection, collection.key)
    })
  }

  // process items
  if (collection.items.length > 0) {
    collection.items.forEach(item => {
      itemMap.set(item.id, item)
    })
  }
}
processCollection(rootCollection)

export const useData = () => {
  return {
    rootCollection,
    collectionMap,
    itemMap,
  }
}