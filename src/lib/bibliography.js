import LOCALE_EN_US from "../assets/locale/locale-en-US.xml?raw"
import CSL from "citeproc"

// A bit of Vite-specific thing (which we may want to remove)
// This loads in all of the CSL files, and puts them in an object from the getGo
// we may instead decide it's better to fetch these as necessary
const cslModules = import.meta.glob("../assets/csl/*.csl", { as: "raw", eager: true })
const STYLES = Object.entries(cslModules).reduce((obj, [key, value]) => {
  const name = key.split("/").pop().split(".")[0]
  obj[name] = value
  return obj
}, {})

export default function getBibliography(items, style='APA7') {
  const citations = new Map()
  for (const item of items) {
    citations.set(item.id, item)
  }

  const citeproc = new CSL.Engine(
    {
      retrieveLocale: () => LOCALE_EN_US,
      retrieveItem: (id) => {
        if (!citations.has(id)) {
          return false
        }
        return citations.get(id)
      },
    },
    STYLES[style]
  )

  citeproc.updateItems([...citations.keys()])
  const result = citeproc.makeBibliography()

  return result[1]
}