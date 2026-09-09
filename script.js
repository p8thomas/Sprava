const tabs = document.querySelectorAll("[data-panel]");
const panels = document.querySelectorAll("[data-panel-content]");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.panel;

    tabs.forEach((item) => item.classList.toggle("is-active", item === tab));
    panels.forEach((panel) => {
      panel.classList.toggle("is-hidden", panel.id !== target);
    });
  });
});
