import { ref } from 'vue'

const toast = ref(null)
const addMissingContentToast = (params) => {
  const defaults = {
    content: `
      Thank you for exploring this topic.
      Currently, there are little to no resources available in this area.
      The DISTEM Website is a living document that will be continuously updated over time.
      The scarcity of resources here often highlights the significant lack of funding for research in certain areas, particularly those prioritizing Indigenous authors and knowledge keepers.
      We aim to focus on resources related to our local Indigenous groups, and we appreciate your understanding and patience as we expand our collection.
    `,
    error: true,
    autohide: false,
    // delay: 10000,
  }
  toast.value = {...defaults, ...params}
}

export const useToast = () => {
  return {
    toast,
    addMissingContentToast,
  }
}