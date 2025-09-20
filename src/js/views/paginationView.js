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
            <button class="page active disabled" data-page="${currPage}">${currPage}</button>
            <button class="page" data-page="${currPage + 1}">${currPage + 1}</button>
            <button class="page">...</button>
            <button class="page" data-page="${lastPage - 1}">${lastPage - 1}</button>
            <button class="page" data-page="${lastPage}">${lastPage}</button>
            <button class="page" data-page="${currPage + 1}">
              <img src="${icon.chevronRight}" alt="Next page button">
            </button>
          </div>`;
    this._parent.innerHTML = pagination;
  }

  addHandlerPageChange(handler) {
    document.querySelector(".pagination").addEventListener("click", (e) => {
      const button = e.target.closest("button");
      if (!button) return;

      const page = +button.dataset.page;
      if (!button.classList.contains("page")) {
        return;
      }
      handler(page);
    });
  }
}

export default new PaginationView();
