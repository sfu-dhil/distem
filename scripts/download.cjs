/**
 * Script for downloading Zotero API response offline;
 * these results are then stored for use in the actual web application
 */
require("dotenv").config();
const fs = require("fs/promises");
const path = require("path");
const { default: api } = require("zotero-api-client");

/**
 * the ZOTERO_API_KEY and GROUP_ID
 * should be set as an environment variable
 * OR in a `.env` file at the root
 */
const { ZOTERO_API_KEY, GROUP_ID } = process.env;
const zotero = getZotero();

/**
 * Class for a collection
 */
class Collection {
  /** Construct the collection class */
  constructor(data) {
    Object.assign(this, data);
    return this.init();
  }
  /** Initialize the collection */
  async init() {
    this.setTitleAndNum();
    await this.getCollections();
    await this.getItems();
    return this;
  }
  /** Titles tend to be formatted like:
   * "02-Title"
   * so they need to be split for sorting / display
   */
  setTitleAndNum() {
    const [num, ...title] = this.name.split("-");
    this.title = title.join("-");
    this.num = parseInt(num);
    return this;
  }
  /**
   * Recursive method to get a collection's subcollections
   */
  async getCollections() {
    const collections = await zotero
      .collections(this.key)
      .subcollections()
      .get();
    const data = await Promise.all(
      collections.getData().map((c) => new Collection(c))
    );
    data.sort((a, b) => {
      return a.num - b.num;
    });
    this.collections = data;
    return this;
  }
  /** Retrieves all items in a subcollection
   * (note this assumes items are never in a parent collection
   * to a sub-collection)
   */
  async getItems() {
    const items = await zotero.collections(this.key).items().get({
      format: "csljson",
    });
    const data = await items.getData().json();
    this.items = data.items;
    return this;
  }
}

/** Initial function to kick the process off */
(async function () {
  const response = await zotero.collections().top().get();
  const library = await Promise.all(
    response.getData().map((c) => new Collection(c))
  );
  library.sort((a, b) => {
    return a.num - b.num;
  });
  /** @todo: Make this to a configurable path */
  await writeFile("public/data/library.json", JSON.stringify(library, null, 4));
  console.log("Done!");
})();

/** Function to retrieve the Zotero API object */
function getZotero() {
  if (!ZOTERO_API_KEY) {
    throw new Error("ZOTERO_API_KEY not set");
  }
  if (!GROUP_ID) {
    throw new Error("GROUP_ID not set");
  }
  return api(ZOTERO_API_KEY, {
    limit: 50,
  }).library("group", GROUP_ID);
}

/** Helper function to check if a given path exists */
const pathExists = async (uri) => {
  try {
    await fs.access(uri);
    return true;
  } catch {
    return false;
  }
};

/** Writes a file to a directory (optionally adding a directory
 * if necessary) */
const writeFile = async (uri, data) => {
  const dirname = path.dirname(uri);
  const exists = await pathExists(dirname);
  if (!exists) {
    await fs.mkdir(dirname, { recurse: true });
  }
  await fs.writeFile(uri, data, "utf-8");
};
