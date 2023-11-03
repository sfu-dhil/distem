/**
 * Citation Style Language files (in .locale/ and in ./csl) are courtesy of the Citation Style Language project: CitationStyles.org . See individual files
 * for authorship and translators.
 *
 */

import LOCALE_EN_US from "./locale/locale-en-US.xml?raw";
import CSL from "citeproc";

// A bit of Vite-specific thing (which we may want to remove)
// This loads in all of the CSL files, and puts them in an object from the getGo
// we may instead decide it's better to fetch these as necessary
const cslModules = import.meta.glob("./csl/*.csl", { as: "raw", eager: true });
const STYLES = Object.entries(cslModules).reduce((obj, [key, value]) => {
  const name = key.split("/").pop().split(".")[0];
  obj[name] = value;
  return obj;
}, {});

export default class Bibliography {
  setData(data) {
    if (data.length === 0) {
      console.log("Empty data, so not building anything");
      this.getBibliography = () => "";
      return;
    }
    this.citations = new Map();
    for (const item of data) {
      this.citations.set(item.id, item);
    }
    return this;
  }

  getBibliography(style = "APA7") {
    const self = this;
    const citeproc = new CSL.Engine(
      {
        retrieveLocale: () => LOCALE_EN_US,
        retrieveItem: this.retrieveItem.bind(self)
      },
      STYLES[style]
    );
    citeproc.updateItems([...this.citations.keys()]);
    const result = citeproc.makeBibliography();
    return result[1].join("");
  }

  retrieveItem(id) {
    if (!this.citations.has(id)) {
      console.log(`Item ${id} not found`);
      return false;
    }
    return this.citations.get(id);
  }
}
