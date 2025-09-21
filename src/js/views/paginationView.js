import View from "./View.js";
import * as icon from "./icons.js";

class PaginationView extends View {
  _parent = document.querySelector(".pagination");

  addHandlerPaginationRender(handler) {
    this._parent.addEventListener("click", handler);
  }

  renderPagination(lastPage, currPage) {
    const pagination = `
          <div class="page-container">
            <button class="page" data-page="${currPage - 1}">
              <img src="${icon.chevronLeft}" alt="Previous page button">
            </button>
            ${this._renderPages(lastPage, currPage)}
            <button class="page" data-page="${currPage + 1}">
              <img src="${icon.chevronRight}" alt="Next page button">
            </button>
          </div>`;
    this._parent.innerHTML = pagination;
  }

  _renderPages(lastPage, currPage) {
    const pages = [];

    let start = 0;

    if (lastPage <= 4) {
      for (let i = 1; i <= lastPage; i++) pages.push(i);
    } else {
      if (currPage >= lastPage - 2) start = [lastPage - 3, lastPage - 2];
      else start = [currPage, currPage + 1, "..."];
      const end = [lastPage - 1, lastPage];

      pages.push(...start, ...end);
    }
    console.log(pages);

    return pages
      .map(
        (btnContent) =>
          `<button class="page ${btnContent === currPage && currPage ? "active" : ""}" data-page="${btnContent}">${btnContent}</button>`,
      )

      .join("");
  }

  addHandlerPageChange(handler) {
    document.querySelector(".pagination").addEventListener("click", (e) => {
      const button = e.target.closest("button");
      if (!button || button.textContent === "...") return;

      const page = +button.dataset.page;
      if (!button.classList.contains("page")) {
        return;
      }
      handler(page);
    });
  }
}

export default new PaginationView();
