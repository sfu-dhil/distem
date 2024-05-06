export default function setupShowMore() {
    const showMoreContentList = [].slice.call(document.querySelectorAll('.show-more-content'))
    showMoreContentList.map((showMoreContentEl) => {
        if (showMoreContentEl.offsetHeight < showMoreContentEl.scrollHeight || showMoreContentEl.offsetWidth < showMoreContentEl.scrollWidth) {
            const showMoreBtn = document.createElement("button")
            showMoreBtn.classList.add('btn')
            showMoreBtn.classList.add('btn-primary')
            showMoreBtn.classList.add('btn-sm')
            showMoreBtn.classList.add('mb-3')
            showMoreBtn.innerText = 'Show more'
            const showMore = () => {
                showMoreContentEl.classList.remove('show-more-content')
                showMoreContentEl.removeEventListener("click", showMore)
                showMoreBtn.remove()
            }
            showMoreContentEl.addEventListener("click", showMore)
            showMoreBtn.addEventListener("click", showMore)
            showMoreContentEl.after(showMoreBtn)
        } else {
            showMoreContentEl.classList.remove('show-more-content')
        }
    })
}