// Heart of the calculator. This file deals with everything regarding the calculator itself

const calculator = {
  displayBuffer: undefined,
  currentLine: undefined,
  lineInput: undefined,
  functionLine: undefined,
  saveState: undefined,
  isError: false,
  state: { val: [], type: [] },
  tableFunction: { val: [], type: [] },
  cursor: 0,
  inFrac: 0,
  history: [{ in: 0, out: 0 }],
  variables: {
    x: 0,
    y: 0,
    z: 0,
    t: 0,
    a: 0,
    b: 0,
    c: 0,
  },
  tableVariables: {
    x: 0,
    a: 0,
    b: 0,
    c: 0,
  },
  constants: {
    "\u03c0": Math.PI,
  },
  menu: {
    table: false,
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
    if (this.options.insert || this.state.type[this.cursor] === "placeholder") {
      this.state.val[this.cursor] = " ";
      if (this.cursor >= this.state.val.length) {
        this.state.val.push(val);
        this.state.type.push(type);
      } else {
        this.state.val.splice(this.cursor, 0, val);
        this.state.type.splice(this.cursor, 0, type);
      }
    } else {
      if (this.cursor >= this.state.val.length) {
        this.state.val.push(val);
        this.state.type.push(type);
      } else {
        this.state.val.splice(this.cursor, 1, val);
        this.state.type.splice(this.cursor, 1, type);
      }
    }
    this.updateCursor(1);
  },
  updateCursor: function (val) {
    this.cursor += val;
    if (this.state.type[this.cursor] === "frac") {
      this.cursor += val / Math.abs(val);
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
    if (this.menu.table) {
      if (!previous) {
        this.variableIterator = 0;
        this.updateState(
          Object.keys(this.tableVariables)[this.variableIterator],
          "var"
        );
        this.updateDisplay();
      } else if (previous in this.variables) {
        this.variableIterator =
          (this.variableIterator + 1) % Object.keys(this.tableVariables).length;
        this.state.val[this.state.val.length - 1] = Object.keys(
          this.tableVariables
        )[this.variableIterator];
        this.updateDisplay();
      } else {
        this.variableIterator = 0;
        this.updateState(
          Object.keys(this.tableVariables)[this.variableIterator],
          "var"
        );
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
  solve: function () {
    if (this.menu.table) {
      this.setupTableParameters();
      return;
    }
    try {
      const inputWidth = document.querySelector(".current .input").offsetWidth;
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

      this.history.push({ in: this.state, out: result });
      this.currentLine = document.createElement("div");
      this.currentLine.classList.add("line");
      this.currentLine.classList.add("current");
      this.lineInput = document.createElement("div");
      this.lineInput.classList.add("input");
      this.lineInput.innerHTML = "";
      this.currentLine.appendChild(this.lineInput);
      this.displayBuffer.appendChild(this.currentLine);
      this.state = { val: [], type: [] };
      this.cursor = 0;
      this.updateDisplay();
    } catch (err) {
      this.saveState = this.displayBuffer.innerHTML;
      this.displayBuffer.innerHTML = `<div class='error'>${err}</div>`;
      this.isError = true;
      console.log(err);
    }
  },
  delete: function () {
    if (this.cursor >= this.state.val.length) {
      this.state.val.pop();
      this.state.type.pop();
      this.updateDisplay();
    } else {
      this.state.val.splice(this.cursor, 1);
      this.state.type.splice(this.cursor, 1);
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
  updateDisplay: function (noCursor = false) {
    let parsed = Array.from(this.state.val);
    let exponentiating = false;
    let exponentCounter = 0;
    console.log(noCursor);
    for (let i = 0; i < parsed.length; i++) {
      if (parsed[i] === "(") {
        if (exponentiating) {
          parsed[i] = "<sup>";
          exponentCounter++;
        }
        lastIncrement = i;
      }
      console.log(exponentCounter, exponentiating, i);
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
      if (i === this.cursor && noCursor === false) {
        if (this.state.type[i] === "placeholder") {
          parsed[i] = `<span class='cursor'>\u232a</span>`;
        } else {
          parsed[i] = `<span class='cursor'>${parsed[i]}</span>`;
        }
      }
    }
    console.log(parsed);
    if (this.cursor > parsed.length - 1 && noCursor === false) {
      parsed.push("<span class='cursor-lead'>|</span>");
    }
    console.log(parsed, this.state.val);
    // fractest = "<span class='frac'><span class='inside'>1</span><span class='inside symbol'>/</span><span class='inside bottom'>2</span></span>"
    if (this.menu.table) {
      const currentLine = document.querySelector(".current")
      console.log(currentLine)
      this.functionLine.innerHTML = "y=" + parsed.join("");
      return;
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
    this.menu.table = true;
    this.saveState = this.state;
    this.displayBuffer.innerHTML = "";
    tableBox = document.createElement("div");
    tableBox.classList.add("table");
    this.functionLine = document.createElement("div");
    this.functionLine.classList.add("line");
    this.functionLine.classList.add("current");
    tableBox.appendChild(this.functionLine);
    this.displayBuffer.appendChild(tableBox);
    this.updateDisplay();
  },
  setupTableParameters: function() {
    this.tableFunction = this.state
    this.state = { val: [], type: []}
    this.displayBuffer.innerHTML = "";
    tableBox = document.createElement("div");
    tableBox.classList.add("table");
    startLine = document.createElement('div')
    startLine.classList.add("line", "current")
    startLine.innerHTML = "Start="
    stepLine = document.createElement('div')
    stepLine.classList.add("line")
    stepLine.innerHTML = "Step="
    optionLine = document.createElement('div')
    optionLine.classList.add("line", "tabs")
    optionLine.innerHTML = "<span class='selected'>Auto</span><span>Ask-x</span>"
    okLine = document.createElement('div')
    okLine.classList.add("line", "ok")
    okLine.innerHTML = "OK"
    tableBox.appendChild(startLine);
    tableBox.appendChild(stepLine);
    tableBox.appendChild(optionLine);
    tableBox.appendChild(okLine);
    this.displayBuffer.appendChild(tableBox);
    this.updateDisplay();
  },
  left: function () {
    console.log(this.cursor);
    if (this.cursor > 0) {
      this.updateCursor(-1);
      this.updateDisplay();
    }
  },
  right: function () {
    console.log(this.cursor, this.state.val.length);
    if (this.cursor <= this.state.val.length - 1) {
      this.updateCursor(1);
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
