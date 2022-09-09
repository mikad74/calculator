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
  const numRowFunctionSymbols = ["sto \u2192", "<span class='var-button-1'>x</span><span class='var-button-2'><div>yzt</div><div>abc</div></span>", "x<sup>2</sup>"];
  const numRowFunctionsRaw = ["\u2192", undefined, "^(2)"];
  const primaryOperations = ["rewrite","add", "subtract", "multiply", "divide"];
  const primaryOperatorSymbol = [
    symbols["rewrite"],
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
    labelText: "^",
    classes: ["operator-btn", "exponentiate-btn"],
    rawText: `^(`,
  });
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
    labelText: `${primaryOperatorSymbol[2]}`,
    classes: ["operator-btn", `${primaryOperations[3]}-btn`],
  });
  const firstRowDiv = setupButtonRow(firstFunctionRow);
  firstRowDiv.classList.add("buttonRow");
  buttonBox.appendChild(firstRowDiv);
  let secondFunctionRow = [];
  secondFunctionRow.push({
    labelText: "\u03c0",
    classes: ["const-btn", "pi-btn"],
  });
  secondFunctionRow.push({
    labelText: "sin",
    classes: ["func-btn", "sin-btn"],
  });
  secondFunctionRow.push({
    labelText: "cos",
    classes: ["func-btn", "cos-btn"],
  });
  secondFunctionRow.push({
    labelText: "tan",
    classes: ["func-btn", "tan-btn"],
  });
  secondFunctionRow.push({
    labelText: `${primaryOperatorSymbol[3]}`,
    classes: ["operator-btn", `${primaryOperations[4]}-btn`],
  });
  const secondRowDif = setupButtonRow(secondFunctionRow);
  secondRowDif.classList.add("buttonRow");
  buttonBox.appendChild(secondRowDif);
  let thirdFunctionRow = [];
  thirdFunctionRow.push({
    labelText: "ln",
    classes: ["func-btn", "ln-btn"],
  });
  thirdFunctionRow.push({
    labelText: "frac",
    classes: ["layout-btn", "frac-btn"],
  });
  thirdFunctionRow.push({
    labelText: "E",
    classes: ["operator-btn", "e-btn"],
  });
  thirdFunctionRow.push({
    labelText: "table",
    classes: ["special-btn", "table-btn"],
  });
  thirdFunctionRow.push({
    labelText: "clear",
    classes: ["special-btn", "clear-btn"],
  });
  const thirdRowDif = setupButtonRow(thirdFunctionRow);
  thirdRowDif.classList.add("buttonRow");
  buttonBox.appendChild(thirdRowDif);
  let fourthFunctionRow = []
  fourthFunctionRow.push({
    labelText: "2nd",
    classes: ["special-btn", "shift-btn"],
  });
  fourthFunctionRow.push({
    labelText: "mode",
    classes: ["special-btn", "mode-btn"],
  });
  fourthFunctionRow.push({
    labelText: "delete",
    classes: ["special-btn", "delet-btn"],
  });
  let fifthFunctionRow = []
  fifthFunctionRow.push({
    labelText: "log",
    classes: ["func-btn", "log-btn"],
  });
  fifthFunctionRow.push({
    labelText: "prb",
    classes: ["special-btn", "prb-btn"],
  });
  fifthFunctionRow.push({
    labelText: "data",
    classes: ["special-btn", "data-btn"],
  });

  const fourthRowDiv = setupButtonRow(fourthFunctionRow)
  fourthRowDiv.classList.add('buttonRow')
  const fifthRowDiv = setupButtonRow(fifthFunctionRow)
  fifthRowDiv.classList.add('buttonRow')
  const finalRowDif = document.createElement('div')
  const buttonDiv = document.createElement('div')
  buttonDiv.appendChild(fourthRowDiv)
  buttonDiv.appendChild(fifthRowDiv)
  buttonDiv.classList.add('button-div')
  const dpadDiv = document.createElement('div')
  dpadDiv.classList.add("dpad")
  const dpadUp = document.createElement('div')
  const dpadLeftRight = document.createElement('div')
  const dpadDown = document.createElement('div')
  const upButton = document.createElement('button')
  upButton.innerText = "\u25b2"
  upButton.classList.add("dpad-button")
  dpadUp.appendChild(upButton)
  const leftButton = document.createElement('button')
  leftButton.classList.add("dpad-button")
  leftButton.innerText = "\u25c0"
  const rightButton = document.createElement('button')
  rightButton.classList.add("dpad-button")
  rightButton.innerText = "\u25b6"
  dpadLeftRight.appendChild(leftButton)
  dpadLeftRight.appendChild(rightButton)
  const downButton = document.createElement('button')
  downButton.classList.add("dpad-button")
  downButton.innerText = "\u25bc"
  dpadDown.appendChild(downButton)
  dpadUp.appendChild(upButton)
  dpadUp.classList.add('dpad-up')
  dpadDiv.appendChild(dpadUp)
  dpadDiv.appendChild(dpadLeftRight)
  dpadLeftRight.classList.add('dpad-left-right')
  dpadDiv.appendChild(dpadDown)
  dpadDown.classList.add('dpad-down')
  finalRowDif.appendChild(buttonDiv)
  finalRowDif.appendChild(dpadDiv)
  finalRowDif.classList.add("final-row")
  buttonBox.appendChild(finalRowDif)

};

calculator.setupDisplay();
setupButtons();
