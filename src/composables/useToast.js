import { reactive } from 'vue'

const toasts = reactive([])

const addToast = (params) => {
  const defaults = {
    content: '',
    error: false,
    autohide: true,
    delay: 5000,
  }
  const toast = {...defaults, ...params}
  toasts.push(toast)
}

const removeToastByIndex = (index) => {
  toasts.splice(index, 1)
}
const removeToastByValue = (value) => {
  const index = toasts.indexOf(value)
  removeToastByIndex(index)
}

export default function useToast() {
  return {
    toasts,
    addToast,
    removeToast: removeToastByValue,
    removeToastByIndex,
    removeToastByValue,
  }
}