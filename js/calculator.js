// Heart of the calculator. This file deals with everything regarding the calculator itself

const calculator = {
  displayBuffer: undefined,
  currentLine: undefined,
  lineInput: undefined,
  functionLine: undefined,
  saveState: undefined,
  isError: false,
  state: { val: [], type: [] },
  cursor: { x: 0, y: 0 },
  inFrac: 0,
  history: [],
  variables: {
    x: 0,
    y: 0,
    z: 0,
    t: 0,
    a: 0,
    b: 0,
    c: 0,
  },
  table: {
    page: 0,
    functionBase: "y=",
    function: { val: [], type: [] },
    start: "1",
    startBase: "Start=",
    startLine: undefined,
    startCounter: 0,
    step: "1",
    stepBase: "Step=",
    stepLine: undefined,
    selectedLine: 0,
    optionLine: undefined,
    option: true,
    okLine: undefined,
  },
  constants: {
    "\u03c0": Math.PI,
  },

  options: {
    angle: "rad",
    insert: false,
  },

  variableIterator: 0,
  setupDisplay: function () {
    this.displayBuffer = document.querySelector(".display");
    this.currentLine = document.createElement("div");
    this.currentLine.classList.add("line");
    this.currentLine.classList.add("current");
    this.lineInput = document.createElement("div");
    this.lineInput.classList.add("input");
    this.lineInput.innerHTML = "";
    this.currentLine.appendChild(this.lineInput);
    this.displayBuffer.appendChild(this.currentLine);
    this.updateDisplay();
  },
  updateState: function (val, type) {
    if (
      this.options.insert ||
      this.state.type[this.cursor.x] === "placeholder"
    ) {
      this.state.val[this.cursor.x] = " ";
      if (this.cursor.x >= this.state.val.length) {
        this.state.val.push(val);
        this.state.type.push(type);
      } else {
        this.state.val.splice(this.cursor.x, 0, val);
        this.state.type.splice(this.cursor.x, 0, type);
      }
    } else {
      if (this.cursor.x >= this.state.val.length) {
        this.state.val.push(val);
        this.state.type.push(type);
      } else {
        this.state.val.splice(this.cursor.x, 1, val);
        this.state.type.splice(this.cursor.x, 1, type);
      }
    }
    this.updateCursor(1);
  },
  updateCursor: function (val) {
    this.cursor.x += val;
    if (this.state.type[this.cursor.x] === "frac") {
      this.cursor.x += val / Math.abs(val);
    }
  },
  btnPres: function (raw, type, operator = false, enclose = false) {
    this.currentLine = document.querySelector(".line.current");
    if (operator) {
      if (this.state.val.length === 0) {
        this.updateState("Ans", "number");
      }
    }
    if (enclose) {
      this.encloser();
    }

    console.log(type);
    switch (type) {
      case "negate":
        this.updateState(raw, type);
        break;

      case "func":
        this.updateState(raw, type);
        this.updateState("(", "open-bracket");
        break;

      case "square": // TODO: Recursion
        this.updateState("^", "exp");
        this.updateState("(", "open-bracket");
        this.updateState("2", "number");
        this.updateState(")", "close-bracket");
        break;

      case "invert": // TODO: Recursion
        this.updateState("^", "exp");
        this.updateState("(", "open-bracket");
        this.updateState("-1", "number");
        this.updateState(")", "close-bracket");
        break;

      case "exp":
        this.updateState("^", "exp");
        this.updateState("(", "open-bracket");
        this.updateState("\u25A1", "placeholder");
        this.updateState(")", "close-bracket");
        this.updateCursor(-2);
        break;

      case "standard-form":
        this.updateState("*", "multiply");
        this.updateState("10", "number");
        this.updateState("^", "exp");
        this.updateState("(", "open-bracket");
        break;

      default:
        this.updateState(raw, type);
        break;
    }

    this.updateDisplay();
  },
  encloser: function () {
    if (this.state.type[this.state.type.length - 1] === "close-bracket") {
      let bracketCounter = 0;
      let bracketComplete = false;
      let containsExponent = false;
      for (var i = this.state.type.length - 1; i >= 1; i--) {
        if (this.state.type[i] === "exp") containsExponent = true;
        if (this.state.type[i] === "close-bracket") {
          bracketCounter++;
          bracketComplete = false;
        }
        if (!bracketComplete) {
          if (this.state.type[i] === "open-bracket") {
            bracketCounter--;
            if (bracketCounter === 0) {
              bracketComplete = true;
            }
          }
        } else {
          if (
            ["add", "multiply", "open-bracket"].includes(this.state.type[i])
          ) {
            if (this.state.type[i + 1] !== "open-bracket" || containsExponent) {
              this.state.val.splice(i + 1, 0, "(");
              this.state.type.splice(i + 1, 0, "open-bracket");
              this.updateCursor(1);
              this.updateState(")", "close-bracket");
            }
            return;
          }
        }
      }
      if (this.state.type[i] !== "open-bracket" || containsExponent) {
        this.state.val.splice(i, 0, "(");
        this.state.type.splice(i, 0, "open-bracket");
        this.updateCursor(1);
        this.updateState(")", "close-bracket");
      }
    }
  },
  variable: function () {
    let previous = this.state.val[this.state.val.length - 1];
    if (this.table.page > 0) {
      const keys = Object.keys(this.variables).slice(0, 1);
      Object.keys(this.variables)
        .slice(4)
        .forEach((el) => {
          keys.push(el);
        });
      console.log(keys);
      if (!previous) {
        this.variableIterator = 0;
        this.updateState(keys[this.variableIterator], "var");
        this.updateDisplay();
      } else if (previous in this.variables) {
        this.variableIterator = (this.variableIterator + 1) % keys.length;
        this.state.val[this.state.val.length - 1] = keys[this.variableIterator];
        this.updateDisplay();
      } else {
        this.variableIterator = 0;
        this.updateState(keys[this.variableIterator], "var");
        this.updateDisplay();
      }
    } else {
      if (!previous) {
        this.variableIterator = 0;
        this.updateState(
          Object.keys(this.variables)[this.variableIterator],
          "var"
        );
        this.updateDisplay();
      } else if (previous in this.variables) {
        this.variableIterator =
          (this.variableIterator + 1) % Object.keys(this.variables).length;
        this.state.val[this.state.val.length - 1] = Object.keys(this.variables)[
          this.variableIterator
        ];
        this.updateDisplay();
      } else {
        this.variableIterator = 0;
        this.updateState(
          Object.keys(this.variables)[this.variableIterator],
          "var"
        );
        this.updateDisplay();
      }
    }
  },
  enter: function () {
    if (this.table.page === 1) {
      this.setupTableParameters();
      return;
    }
    if (this.table.page === 2) {
      if (this.table.selectedLine === 0) {
        this.tableStepParameter();
        return;
      }
      if (this.table.selectedLine === 1) {
        this.tableXparameter();
        return;
      }
      if (this.table.selectedLine === 2) {
        if (this.table.option && this.cursor.x === 1) {
          this.table.option = false;
          this.updateDisplay();
          return;
        } else if (this.table.option && this.cursor.x === 0) {
          this.table.selectedLine = 3;
          this.table.okLine.innerHTML = "<span class='selected'>OK</span>";
          this.updateDisplay();
          return;
        } else if (!this.table.option && this.cursor.x === 1) {
          this.table.selectedLine = 3;
          this.table.okLine.innerHTML = "<span class='selected'>OK</span>";
          this.updateDisplay();
          return;
        } else {
          this.table.option = true;
          this.updateDisplay();
          return;
        }
      }
      if (this.table.selectedLine === 3) {
        this.table.page = 3;
        this.showTable();
        this.updateDisplay();
        return;
      }
    }
    if (this.cursor.y !== 0) {
      if ((inOut = (this.cursor.y - 1) % 2 === 0)) {
        this.state.val.push(
          this.history[Math.floor((this.cursor.y - 1) / 2)].out
        );
        this.state.type.push("number");
      } else {
        this.history[Math.floor((this.cursor.y - 1) / 2)].in.val.forEach(
          (el) => {
            this.state.val.push(el);
          }
        );
        this.history[Math.floor((this.cursor.y - 1) / 2)].in.type.forEach(
          (el) => {
            this.state.type.push(el);
          }
        );
      }
      this.cursor.y = 0;
      this.cursor.x = this.state.val.length;
      this.updateDisplay();
    } else {
      try {
        const inputWidth =
          document.querySelector(".current .input").offsetWidth;
        this.updateDisplay(true);

        this.currentLine.classList.remove("current");
        const lineOutput = document.createElement("div");
        lineOutput.classList.add("output");
        const parsedState = parser(this.state);
        console.log(parsedState);
        const result = solver(parsedState.val, parsedState.type);
        console.log(result);
        lineOutput.innerHTML = result;
        this.currentLine.appendChild(lineOutput);
        // console.log(
        //   lineOutput.offsetWidth + inputWidth,
        //   this.currentLine.offsetWidth
        // );
        if (
          !(lineOutput.offsetWidth + inputWidth < this.currentLine.offsetWidth)
        ) {
          lineOutput.classList.add("overflow");
        }

        this.history.unshift({
          in: this.state,
          out: result,
          lineIn: this.lineInput,
          lineOut: lineOutput,
        });
        console.log(this.history);
        this.currentLine = document.createElement("div");
        this.currentLine.classList.add("line");
        this.currentLine.classList.add("current");
        this.lineInput = document.createElement("div");
        this.lineInput.classList.add("input");
        this.lineInput.innerHTML = "";
        this.currentLine.appendChild(this.lineInput);
        this.displayBuffer.appendChild(this.currentLine);
        this.state = { val: [], type: [] };
        this.cursor.x = 0;
        this.updateDisplay();
      } catch (err) {
        this.saveState = this.displayBuffer.innerHTML;
        this.displayBuffer.innerHTML = `<div class='error'>${err}</div>`;
        this.isError = true;
        console.log(err);
      }
    }
  },
  delete: function () {
    if (this.cursor.x >= this.state.val.length) {
      this.state.val.pop();
      this.state.type.pop();
      this.updateDisplay();
    } else {
      this.state.val.splice(this.cursor.x, 1);
      this.state.type.splice(this.cursor.x, 1);
      this.updateDisplay();
    }
  },
  clear: function () {
    console.log(this.lineInput.innerHTML.length);
    if (this.isError === true) {
      console.log(this.saveState);
      this.displayBuffer.innerHTML = this.saveState;
      this.updateDisplay();
      this.isError = false;
    } else if (this.lineInput.innerHTML.length !== 0) {
      this.lineInput.innerHTML = "";
      this.state = { val: [], type: [] };
    } else {
      this.displayBuffer.innerHTML = "";
      this.updateDisplay();
      this.displayBuffer.appendChild(this.currentLine);
    }
  },
  inputDisplaySetup: function (noCursor) {
    let parsed = Array.from(this.state.val);
    let exponentiating = false;
    let exponentCounter = 0;
    for (let i = 0; i < parsed.length; i++) {
      if (parsed[i] === "(") {
        if (exponentiating) {
          parsed[i] = "<sup>";
          exponentCounter++;
        }
        lastIncrement = i;
      }
      if (parsed[i] === ")") {
        if (exponentiating) {
          parsed[i] = "</sup>";
          exponentCounter--;
        }
        if (exponentCounter === 0) exponentiating = false;
      }
      if (parsed[i] === "^") {
        exponentiating = true;
        parsed[i] = "";
      }
      if (parsed[i] === "frac-top") {
        parsed[i] = "<span class='frac'><span class='inside'>";
      }
      if (parsed[i] === "frac-bot") {
        parsed[i] =
          "</span><span class='inside symbol'>/</span><span class='inside bottom'>";
      }
      if (parsed[i] === "frac-end") {
        parsed[i] = "</span></span>";
      }
      if (i === this.cursor.x && noCursor === false && this.cursor.y === 0) {
        if (this.state.type[i] === "placeholder") {
          parsed[i] = `<span class='cursor'>\u232a</span>`;
        } else {
          parsed[i] = `<span class='cursor'>${parsed[i]}</span>`;
        }
      }
    }
    return parsed;
  },
  cursorSetup: function (parsed, noCursor) {
    if (this.table.page > 0) return parsed;
    const previousCurosr = document.querySelector(".cursor");
    if (previousCurosr) {
      previousCurosr.classList.remove("cursor");
    }
    if (this.cursor.y === 0) {
      if (this.cursor.x > parsed.length - 1 && noCursor === false) {
        parsed.push("<span class='cursor-lead'>|</span>");
      }
    } else {
      console.log(this.cursor.y);
      const histRow = Math.floor((this.cursor.y - 1) / 2);
      const histPart = (this.cursor.y - 1) % 2 === 0 ? "lineOut" : "lineIn";
      console.log(histRow, histPart);
      this.history[histRow][histPart].classList.add("cursor");
    }
    return parsed;
  },
  updateDisplay: function (noCursor = false) {
    let parsed = this.cursorSetup(this.inputDisplaySetup(noCursor), noCursor);
    console.log(parsed, this.state.val);
    if (this.table.page === 1) {
      this.functionLine.innerHTML = this.table.functionBase + parsed.join("");
    } else if (this.table.page === 2) {
      if (this.table.selectedLine < 2) {
        const currentLine = document.querySelector(".current");
        const base =
          this.table.selectedLine === 0
            ? this.table.startBase
            : this.table.stepBase;
        currentLine.innerHTML = base + parsed.join("");
      }
      if (this.table.selectedLine === 2) {
        if (this.table.option) {
          console.log(this.cursor.x);
          if (this.cursor.x === 1 && this.table.selectedLine === 2) {
            this.table.optionLine.innerHTML =
              "<span class='selected option'>Auto</span><span class='cursor option'>Ask-x</span>";
          } else {
            this.table.optionLine.innerHTML =
              "<span class='selected option'>Auto</span><span class='option'>Ask-x</span>";
          }
        } else {
          console.log(this.cursor.x);
          if (this.cursor.x === 0 && this.table.selectedLine === 2) {
            this.table.optionLine.innerHTML =
              "<span class='cursor option'>Auto</span><span class='selected option'>Ask-x</span>";
          } else {
            this.table.optionLine.innerHTML =
              "<span class='option'>Auto</span><span class='selected option'>Ask-x</span>";
          }
        }
      } else {
        if (this.table.option) {
          this.table.optionLine.innerHTML =
            "<span class='selected option'>Auto</span><span class='option'>Ask-x</span>";
        } else {
          this.table.optionLine.innerHTML =
            "<span class='option'>Auto</span><span class='selected option'>Ask-x</span>";
        }
      }
    } else if (this.table.page === 3) {
      const tableRows = document.querySelectorAll(".table");
      const prevCursor = document.querySelector(".cursor");
      if (prevCursor) prevCursor.classList.remove("cursor");
      tableRows[4 - this.cursor.y].children[this.cursor.x].classList.add(
        "cursor"
      );
      const currentSelection = document.querySelector(".selection");
      currentSelection.innerHTML =
        this.cursor.x === 0
          ? "x=" +
            tableRows[4 - this.cursor.y].children[this.cursor.x].innerHTML
          : "y=" +
            tableRows[4 - this.cursor.y].children[this.cursor.x].innerHTML;
    }
    this.lineInput.innerHTML = parsed.join("");
  },
  frac: function () {
    this.updateState(" ", "placeholder");
    this.updateState("frac-top", "frac");
    this.updateState("\u25A1", "placeholder");
    this.updateState("frac-bot", "frac");
    this.updateState("\u25a1", "placeholder");
    this.updateState("frac-end", "frac");
    this.updateCursor(-3);
    this.updateDisplay();
    console.log("fraccing");
  },
  setupTableFunction: function () {
    this.table.page = 1;
    this.saveState = this.state;
    this.state = { val: [], type: [] };
    this.displayBuffer.innerHTML = "";
    tableBox = document.createElement("div");
    tableBox.classList.add("table-setup");
    this.functionLine = document.createElement("div");
    this.functionLine.classList.add("line");
    this.functionLine.classList.add("current");
    tableBox.appendChild(this.functionLine);
    this.displayBuffer.appendChild(tableBox);
    this.updateDisplay();
  },
  setupTableParameters: function () {
    this.table.page = 2;
    this.table.function = this.state;
    this.state = { val: [], type: [] };
    this.displayBuffer.innerHTML = "";
    tableBox = document.createElement("div");
    tableBox.classList.add("table-setup");
    this.table.startLine = document.createElement("div");
    this.table.startLine.classList.add("line", "start", "current");
    this.table.startLine.innerHTML = this.table.startBase;
    this.table.stepLine = document.createElement("div");
    this.table.stepLine.classList.add("line", "step");
    this.table.stepLine.innerHTML = this.table.stepBase;
    this.table.optionLine = document.createElement("div");
    this.table.optionLine.classList.add("line", "tabs");
    this.table.optionLine.innerHTML =
      "<span class='selected option'>Auto</span><span class='option'>Ask-x</span>";
    this.table.okLine = document.createElement("div");
    this.table.okLine.classList.add("line", "ok");
    this.table.okLine.innerHTML = "<span>OK</span>";
    tableBox.appendChild(this.table.startLine);
    tableBox.appendChild(this.table.stepLine);
    tableBox.appendChild(this.table.optionLine);
    tableBox.appendChild(this.table.okLine);
    this.displayBuffer.appendChild(tableBox);
    this.updateDisplay();
  },
  tableStepParameter: function () {
    if (this.table.selectedLine === 0) {
      this.table.selectedLine = 1;
      if (this.state.val.length === 0) {
        this.state = { val: [this.table.start], type: ["number"] };
      }
      const parsedState = parser(this.state);
      this.table.start = solver(parsedState.val, parsedState.type);
      this.table.startLine.innerHTML = this.table.startBase + this.table.start;
      this.table.startLine.classList.remove("current");
      this.table.stepLine.classList.add("current");
      this.state = { val: [this.table.step], type: ["number"] };
      this.updateDisplay();
    } else {
      this.table.selectedLine = 1;
      this.table.okLine.classList.remove("current");
      this.table.stepLine.classList.add("current");
      this.updateDisplay();
    }
  },
  tableStartParameter: function () {
    if (this.table.selectedLine === 1) {
      this.table.selectedLine = 0;
      const parsedState = parser(this.state);
      console.log(parsedState);
      this.table.step = solver(parsedState.val, parsedState.type);
      this.table.stepLine.innerHTML = this.table.stepBase + this.table.step;
      this.table.stepLine.classList.remove("current");
      this.table.startLine.classList.add("current");
      this.state = { val: [this.table.start], type: ["number"] };
      this.updateDisplay();
    } else {
      this.updateDisplay();
    }
  },
  tableXparameter: function () {
    this.cursor.x = 0;
    if (this.table.selectedLine === 1)
      this.table.stepLine.innerHTML = this.table.stepBase + this.table.step;
    this.table.stepLine.classList.remove("current");
    this.table.optionLine.classList.add("current");
    this.table.selectedLine = 2;
    this.updateDisplay();
  },
  showTable: function () {
    this.cursor.x = 0;
    this.cursor.y = 3;
    const results = this.updateTable();
    this.displayBuffer.innerHTML = "";
    const headerRow = document.createElement("div");
    headerRow.innerHTML =
      "<span class='iter'>x</span><span class='result'>y</span>";
    headerRow.classList.add("table", "header");
    this.displayBuffer.appendChild(headerRow);
    results.forEach((el) => {
      const dataRow = document.createElement("div");
      dataRow.innerHTML = `<span class='iter'>${el[0]}</span><span class='result'>${el[1]}</span>`;
      dataRow.classList.add("table", "data");
      this.displayBuffer.appendChild(dataRow);
    });
    const currentSelection = document.createElement('div')
    currentSelection.classList.add("table", "selection")
    this.displayBuffer.appendChild(currentSelection)

  },
  updateTable: function () {
    if ((this.table.option = true)) {
      const storedX = this.variables.x;
      let results = [];
      for (let i = 0; i < 3; i++) {
        // the form of this.base + (i + this.table.startCounter) * this.step
        const x = `${
          Number(this.table.start) +
          (i + this.table.startCounter) * Number(this.table.step)
        }`;
        console.log(x, this.table.start, this.table.step, i);
        this.variables.x = x;
        const parsedFunction = parser(this.table.function);
        results[i] = [x, solver(parsedFunction.val, parsedFunction.type)];
      }
      this.variables.x = storedX;
      return results;
    }
  },
  left: function () {
    if (this.cursor.x > 0) {
      this.updateCursor(-1);
      this.updateDisplay();
    }
  },
  right: function () {
    if (this.table.page === 2 && this.table.selectedLine === 2) {
      if (this.cursor.x < 1) {
        this.updateCursor(1);
        this.updateDisplay();
      }
    } else if (this.table.page === 3) {
      this.cursor.x >= 1 ? (this.cursor.x = 1) : this.cursor.x++;
      this.updateDisplay();
    } else if (this.cursor.x <= this.state.val.length - 1) {
      this.updateCursor(1);
      this.updateDisplay();
    }
  },
  up: function () {
    if (this.table.page === 2) {
      if (this.table.selectedLine === 1) {
        this.tableStartParameter();
        return;
      }
      if (this.table.selectedLine === 2) {
        this.tableStepParameter();
        return;
      }
      if (this.table.selectedLine === 3) {
        this.table.selectedLine = 2;
        this.table.okLine.innerHTML = "<span>OK</span>";
        this.updateDisplay();
        return;
      }
    } else if (this.table.page === 3) {
      this.cursor.y >= 3 ? (this.cursor.y = 3) : this.cursor.y++;
      this.updateDisplay();
    } else {
      this.cursor.y >= 2 * this.history.length
        ? (this.cursor.y = 2 * this.history.length)
        : this.cursor.y++;
    }
    this.updateDisplay();
  },
  down: function () {
    if (this.table.page === 2) {
      if (this.table.selectedLine === 0) {
        this.tableStepParameter();
        return;
      }
      if (this.table.selectedLine === 1) {
        this.tableXparameter();
        return;
      }
      if (this.table.selectedLine === 2) {
        this.table.selectedLine = 3;
        this.table.okLine.innerHTML = "<span class='selected'>OK</span>";
        this.updateDisplay();
        return;
      }
    } else if (this.table.page === 3) {
      this.cursor.y <= 2 ? (this.cursor.y = 1) : this.cursor.y--;
      this.updateDisplay();
    } else {
      this.cursor.y <= 1 ? (this.cursor.y = 0) : this.cursor.y--;
      this.updateDisplay();
    }
  },
  add: function (a, b) {
    return Number(a) + Number(b);
  },
  subtract: function (a, b) {
    return Number(a) - Number(b);
  },
  negate: function (a) {
    return Number(-a);
  },
  multiply: function (a, b) {
    return Number(a) * Number(b);
  },
  divide: function (a, b) {
    return Number(a) / Number(b);
  },
  exponentiate: function (a, b) {
    return Math.pow(Number(a), Number(b));
  },
  sin: function (a) {
    if (this.options["angle"] === "deg") a = (a * Math.PI) / 180;
    return Math.sin(a);
  },
  cos: function (a) {
    if (this.options["angle"] === "deg") a = (a * Math.PI) / 180;
    return Math.cos(a);
  },
  tan: function (a) {
    if (this.options["angle"] === "deg") a = (a * Math.PI) / 180;
    return Math.tan(a);
  },
  ln: function (a) {
    return Math.log(a);
  },
  log: function (a) {
    return Math.log10(a);
  },
};
