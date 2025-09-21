import View from "./View.js";

class ProductSettingsView extends View {
  _parent = document.querySelector(".list-info-container");

  addHandlerFilterRender(handler) {
    const filterContainer = document.querySelector(".filter-settings");
    filterContainer.addEventListener("click", handler);
  }

  toggleFilterOptions() {
    const filterHTML = `
    <form class="filter-container">
      <span>Select price</span>
      <div class="filter-inputs">
        <input type="text" name="from" placeholder="From">
        <input type="text" name="to" placeholder="To">
        <input type="submit" value="Apply">
      </div>
    </form>
    `;
    const filterContainer = document.querySelector(".filter-container");
    if (filterContainer) filterContainer.remove();
    else this._parent.insertAdjacentHTML("beforeend", filterHTML);
  }
}

export default new ProductSettingsView();
