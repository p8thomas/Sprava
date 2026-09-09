const button = document.querySelector("#ping");
const result = document.querySelector("#result");

button.addEventListener("click", () => {
  const time = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  result.textContent = `Working at ${time}.`;
});
