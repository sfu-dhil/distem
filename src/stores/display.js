import { defineStore } from 'pinia'
import { useData } from './data'

const {
  rootCollection,
} = useData()

export const useDisplayStore = defineStore('display', {
  state: () => ({
    // collection visualization
    collectionAnimating: false,
    selectedCollectionKey: rootCollection.key,

    // Bibliography Modal
    modalBibliographyShown: false,
    modalBibliographyCollectionKey: null,

    // Item Detail Modal
    modalItemDetailShown: false,
    modalItemDetailItemId: false,
  }),
  getters: {},
  actions: {
    hideModals() {
      this.modalBibliographyShown = false
      this.modalItemDetailShown = false
    },
    showItemDetail(itemId) {
      this.hideModals()
      this.modalItemDetailItemId = itemId
      this.modalItemDetailShown = true
    },
    showBibliography(collectionKey) {
      this.hideModals()
      this.modalBibliographyCollectionKey = collectionKey
      this.modalBibliographyShown = true
    },
  },
  persist: true,
})

