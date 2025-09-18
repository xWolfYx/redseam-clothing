import View from "./View.js";
import * as icon from "./icons.js";

class PaginationView extends View {
  _parent = document.querySelector(".main-container");

  addHandlerPaginationRender(handler) {
    this._parent.addEventListener("onload", handler);
  }

  renderPagination(first, last, next, prev, total) {
    const pagination = `
        <footer>
          <div class="page-container">
            <a href="${prev ?? 1}">
              <img src="${icon.chevronLeft}" alt="">
            </a>
            <a href="${next}" class="page active">${1}</a>
            <a href="${next}" class="page">${2}</a>
            <span class="page">...</span>
            <a href="${next}" class="page">${total - 2}</a>
            <a href="${last}" class="page">${total - 1}</a>
            <a href="${next}" href="">
              <img src="${icon.chevronRight}" alt="">
            </a>
          </div>
        </footer>`;
    this._parent.insertAdjacentHTML("beforeEnd", pagination);
  }

  nextPage() {}
  prevPage() {}
  toPage() {}
}

export default new PaginationView();
