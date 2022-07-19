const display = document.querySelector(".display");


const setupButtonRow = function (buttons) {
  const buttonRowDiv = document.createElement("div");
  buttonRowDiv.classList.add("button-row");
  buttons.forEach((button) => {
    const buttonEl = document.createElement("button");
    button.classes.forEach((elClass) => {
      buttonEl.classList.add(elClass);
    });
    buttonEl.innerText = button.text;
    if (!button.classes.includes("enter-btn")) {
      buttonEl.addEventListener("click", function () {
        calculator.btnPres(button.text);
      });
    } else {
      buttonEl.addEventListener("click", function () {
        calculator.solve();
      });
    }
    buttonRowDiv.appendChild(buttonEl);
  });
  return buttonRowDiv;
};

const setupButtons = function () {
  const buttonBox = document.querySelector(".buttonbox");
  const primaryOperations = ["add", "subtract", "multiply", "divide"];
  const primaryOperatorSymbol = ["+", "-", `*`, `/`];
  let currentRow = [];
  for (let i = 0; i < 10; i++) {
    currentRow.push({ text: `${i}`, classes: ["num-btn", `butn-${i}`] });
    if (i === 0) {
      currentRow.push({ text: ".", classes: ["num-btn", "butn-dot"] });
      currentRow.push({ text: "enter", classes: ["enter-btn"] });
    }
    if (i % 3 == 0) {
      const operatorButton = primaryOperations[i / 3];
      const operatorSymbol = primaryOperatorSymbol[i / 3];
      currentRow.push({
        text: `${operatorSymbol}`,
        classes: ["operator-btn", `${operatorButton}-btn`],
      });
      const buttonRowDiv = setupButtonRow(currentRow);
      currentRow = [];
      buttonRowDiv.classList.add("buttonRow");
      buttonBox.appendChild(buttonRowDiv);
    }
  }
};

setupButtons();
