import View from "./View.js";

class ProductSettingsView extends View {
  _parent = document.querySelector(".list-info-container");

  addHandlerSettingsRender(handler) {
    const settingsContainer = document.querySelector(".list-info-container");
    settingsContainer.addEventListener("click", (e) => {
      const button = e.target.closest("button");
      if (
        !button ||
        (!button.classList.contains("filter-settings-btn") &&
          !button.classList.contains("sort-settings-btn"))
      )
        return;

      let setting = "";

      if (button.classList.contains("filter-settings-btn")) setting = "filter";
      if (button.classList.contains("sort-settings-btn")) setting = "sort";

      handler(setting);
    });
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
    const sortContainer = document.querySelector(".sort-container");
    if (sortContainer) sortContainer.remove();
    if (filterContainer) filterContainer.remove();
    else this._parent.insertAdjacentHTML("beforeend", filterHTML);
  }

  toggleSortOptions() {
    const sortHTML = `
    <form class="sort-container">
      <span>Sort by</span>
      <div class="sort-buttons">
        <input type="button" value="New products first">
        <input type="button" value="Price, low to high">
        <input type="button" value="Price, high to low">
      </div>
    </form>
    `;
    const sortContainer = document.querySelector(".sort-container");
    const filterContainer = document.querySelector(".filter-container");
    if (filterContainer) filterContainer.remove();
    if (sortContainer) sortContainer.remove();
    else this._parent.insertAdjacentHTML("beforeend", sortHTML);
  }
}

export default new ProductSettingsView();
