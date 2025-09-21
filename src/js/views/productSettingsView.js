import View from "./View.js";

class ProductSettingsView extends View {
  _parent = document.querySelector(".list-info-container");

  addHandlerSettingsRender(handler) {
    this._parent.addEventListener("click", (e) => {
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

  addHandlerFilterItems(handler) {
    this._parent.addEventListener("submit", (e) => {
      e.preventDefault();
      const dataArr = new FormData(e.target);
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }

  addHandlerSortItems(handler) {
    const sortContainer = document.querySelector(".sort-container");
    sortContainer.addEventListener("click", (e) => {
      if (!e.target.classList.contains("sort-btn")) return;
      const result = e.target.dataset.sort;
      handler(result);
    });
  }

  toggleFilterOptions() {
    const filterContainer = document.querySelector(".filter-container");
    const sortContainer = document.querySelector(".sort-container");
    if (!sortContainer.classList.contains("hidden"))
      sortContainer.classList.add("hidden");

    if (filterContainer.classList.contains("hidden"))
      filterContainer.classList.remove("hidden");
    else filterContainer.classList.add("hidden");
  }

  toggleSortOptions() {
    const sortContainer = document.querySelector(".sort-container");
    const filterContainer = document.querySelector(".filter-container");
    if (!filterContainer.classList.contains("hidden"))
      filterContainer.classList.add("hidden");

    if (sortContainer.classList.contains("hidden"))
      sortContainer.classList.remove("hidden");
    else sortContainer.classList.add("hidden");
  }
}

export default new ProductSettingsView();
