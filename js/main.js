const setupButtonRow = function (buttons) {
  const buttonRowDiv = document.createElement("div");
  buttonRowDiv.classList.add("button-row");
  buttons.forEach((button) => {
    const buttonEl = document.createElement("button");
    button.classes.forEach((elClass) => {
      buttonEl.classList.add(elClass);
    });
    if (button.rawText === undefined) {
      button.rawText = button.labelText;
    }
    if (button.displayText === undefined) {
      button.displayText = button.labelText;
    }
    buttonEl.innerHTML = button.labelText;
    if (button.classes.includes("enter-btn")) {
      buttonEl.addEventListener("click", function () {
        calculator.solve();
      });
    } else if (button.classes.includes("variable-btn")) {
      buttonEl.addEventListener("click", function () {
        calculator.variable();
      });
    } else if (
      button.classes.includes("square-btn") ||
      button.classes.includes("inverse-btn")
    ) {
      if (button.classes.includes("operator-btn")) {
        buttonEl.addEventListener("click", function () {
          calculator.btnPres(button.rawText, true, true);
        });
      } else {
        buttonEl.addEventListener("click", function () {
          calculator.btnPres(button.rawText, false, true);
        });
      }
    } else {
      if (button.classes.includes("operator-btn")) {
        buttonEl.addEventListener("click", function () {
          calculator.btnPres(button.rawText, true);
        });
      } else {
        buttonEl.addEventListener("click", function () {
          calculator.btnPres(button.rawText);
        });
      }
    }
    buttonRowDiv.appendChild(buttonEl);
  });
  return buttonRowDiv;
};

const setupButtons = function () {
  const buttonBox = document.querySelector(".buttonbox");
  const numRowFunctions = ["store-var", "variable", "square"];
  const numRowFunctionSymbols = ["sto \u2192", "x", "x<sup>2</sup>"];
  const numRowFunctionsRaw = ["\u2192", undefined, "^(2)"];
  const primaryOperations = ["add", "subtract", "multiply", "divide"];
  const primaryOperatorSymbol = [
    symbols["add"],
    symbols["subtract"],
    symbols["divide"],
    symbols["multiply"],
  ];
  let currentRow = [];
  for (let i = 0; i < 10; i++) {
    if (i === 0) {
      currentRow.push({ labelText: "on", classes: ["on-btn", "butn-on"] });
      currentRow.push({ labelText: `${i}`, classes: ["num-btn", `butn-${i}`] });
      currentRow.push({ labelText: ".", classes: ["num-btn", "butn-dot"] });
      currentRow.push({
        labelText: "( \u2011 )",
        rawText: "\u2011",
        classes: ["num-btn", "butn-negate"],
      });
      currentRow.push({ labelText: "enter", classes: ["enter-btn"] });
    }
    if ((i + 2) % 3 == 0) {
      const numRowFunction = numRowFunctions[(i + 2) / 3 - 1];
      const numRowFunctionSymbol = numRowFunctionSymbols[(i + 2) / 3 - 1];
      const numRowFunctionRaw = numRowFunctionsRaw[(i + 2) / 3 - 1];
      if (i === 4) {
        currentRow.push({
          labelText: `${numRowFunctionSymbol}`,
          rawText: `${numRowFunctionRaw}`,
          classes: ["func-btn", `${numRowFunction}-btn`],
        });
      } else {
        currentRow.push({
          labelText: `${numRowFunctionSymbol}`,
          rawText: `${numRowFunctionRaw}`,
          classes: ["operator-btn", `${numRowFunction}-btn`],
        });
      }
    }
    if (i !== 0)
      currentRow.push({ labelText: `${i}`, classes: ["num-btn", `butn-${i}`] });
    if (i % 3 == 0) {
      if (i != 0) {
        const operatorButton = primaryOperations[i / 3 - 1];
        const operatorSymbol = primaryOperatorSymbol[i / 3 - 1];
        currentRow.push({
          labelText: `${operatorSymbol}`,
          classes: ["operator-btn", `${operatorButton}-btn`],
        });
      }
      const buttonRowDiv = setupButtonRow(currentRow);
      currentRow = [];
      buttonRowDiv.classList.add("buttonRow");
      buttonBox.appendChild(buttonRowDiv);
    }
  }
  let firstFunctionRow = [];
  firstFunctionRow.push({
    labelText: "x<sup>-1</sup>",
    classes: ["operator-btn", "inverse-btn"],
    rawText: `^(${symbols.negate}1)`,
  });
  firstFunctionRow.push({
    labelText: "(",
    classes: ["bracket-btn", "open-bracket-btn"],
  });
  firstFunctionRow.push({
    labelText: ")",
    classes: ["bracket-btn", "close-bracket-btn"],
  });
  firstFunctionRow.push({
    labelText: `${primaryOperatorSymbol[3]}`,
    classes: ["operator-btn", `${primaryOperations[3]}-btn`],
  });
  const buttonRowDiv = setupButtonRow(firstFunctionRow);
  buttonRowDiv.classList.add("buttonRow");
  buttonBox.appendChild(buttonRowDiv);
};

calculator.setupDisplay();
setupButtons();
