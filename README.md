**Project in progress**

# Decolonizing and Indigenizing STEM (Science, Technology, Engineering, Mathematics) at SFU (DISTEM)

> **Principal Investigator**: Nawal Musleh-Motut<br/>
> **Collaborators**: Sheri Fabian, Megan Donahue, Ashley > Edwards, Edward Anderson, blake danis<br/><br/>
> The overarching goal of the DISTEM project is to support STEM faculty as they begin or continue to decolonize and Indigenize STEM pedagogy, curricula, and classrooms at SFU, for both Indigenous and non-Indigenous students. This entails investigating faculty members’ understanding of decolonization and Indigenization, assessing their needs and identifying the best tools to assist in operationalizing these processes and goals, and making, implementing, and assessing recommendations made by the project team. The DISTEM project aims to meet faculty needs by creating a central online archive of relevant and varied resources focused on decolonizing and Indigenizing STEM, both generally and in regard to teaching and learning, in postsecondary institutions. To support and facilitate faculty learning, the project will use a STEM related variation of the [Brian Deer Classification System](https://www.lib.sfu.ca/help/academic-integrity/indigenous-initiatives/icrc/brian-deer-classification), which centres Indigenous communities and knowledge. In doing so, the project will encourage users to move through the website and resources in a decolonial and thus relational way, thereby challenging the Eurocentric and neocolonial organization of information relevant to Indigenous Peoples most often used in libraries and archives.


## Setting up

Copy `.env.dist` to `.env` (do not commit to github)

```bash
cp .env.dist .env
```
Fill in `ZOTERO_API_KEY` and `GROUP_ID:`

* `ZOTERO_API_KEY`: Get a Zotero account and an API key (through the Account Settings)
* `GROUP_ID`: Get access to a group library

Building the development site:

1. First, download data from Zotero (if you haven't)

```bash
npm run download
```

2. Run the development server

```bash
npm run dev
```


## Dependencies

For full list, see `package.json`

* [Citation Style Language project](CitationStyles.org)
* [Zotero Web API](https://github.com/tnajdek/zotero-api-client)
* [CiteProc JS](https://github.com/juris-m/citeproc-js)