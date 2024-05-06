import getBibliography from "../lib/bibliography.js"
import { ref } from 'vue'


const title = ref('')
const content = ref('')
const show = ref(false)

const showModal = (titleStr, contentStr) => {
  title.value = titleStr
  content.value = contentStr
  show.value = true
}

const showBibliographyModal = (items) => {
  const content = getBibliography(items)
  showModal("Bibliography", content)
}

const showItemDetailsModal = (item) => {
  const title = item.shortTitle ? item.shortTitle : item.title
  const bibliography = getBibliography([item])

  const img = item.coverImage ? `<img src="${item.coverImage}" class="cover-image rounded float-start mx-3" alt="${item.title} cover image">` : ''
  let url, urlText
  if (item.DOI) {
    url = `https://doi.org/${item.DOI}`
    urlText = 'Source'
  } else if(item.URL) {
    url = item.URL
    urlText = 'Website'
  }
  const link = url ? `<a href="${url}" target="_blank" class="btn btn-primary">${urlText} <i class="bi bi-box-arrow-up-right"></i></a>` : ''

  const content = `
    ${img}
    <div class="mb-3">${bibliography}</div>
    <div class="show-more-content">${item.abstract || ''}</div>
    <div class="my-3 d-grid gap-2 d-md-flex justify-content-md-end">
      ${link}
    </div>
  `
  showModal(title, content)
}

export default function useModal() {
  return {
    title,
    content,
    show,
    showModal,
    showBibliographyModal,
    showItemDetailsModal,
  }
}