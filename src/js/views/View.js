export default class View {
  _parent = document.querySelector(".main-container");
  _disabledBtnColor = "#E1DFE1";
  _activeBtnColor = "#3E424A";

  displayErrorMsg(message = "Unexpected error") {
    const messageDiv = document.createElement("div");
    messageDiv.classList = "error-message-div";
    messageDiv.innerHTML = `<span class="error-msg">${message}</span>`;
    document.body.insertAdjacentElement("beforeend", messageDiv);
    messageDiv.style.opacity = "1";
    setTimeout(() => (messageDiv.style.opacity = "0"), 4600);
    setTimeout(() => messageDiv.remove(), 5000);
  }
}
