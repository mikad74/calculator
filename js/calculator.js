// Heart of the calculator. This file deals with everything regarding the calculator itself

const calculator = {
  displayBuffer: undefined,
  currentLine: undefined,
  lineInput: undefined,
  saveState: undefined,
  rawBuffer: "",
  history: [{ in: 0, out: 0 }],
  variables: {
    "x\u2028": 0,
    "y\u2028": 0,
    "z\u2028": 0,
    "t\u2028": 0,
    "a\u2028": 0,
    "b\u2028": 0,
    "c\u2028": 0,
  },
  variableIterator: 0,
  setupDisplay: function () {
    this.displayBuffer = document.querySelector(".display");
    this.currentLine = document.createElement("div");
    this.currentLine.classList.add("line");
    this.currentLine.classList.add("current");
    this.lineInput = document.createElement("div");
    this.lineInput.classList.add("input");
    this.currentLine.appendChild(this.lineInput);
    this.displayBuffer.appendChild(this.currentLine);
  },
  btnPres: function (raw, operator = false, enclose = false) {
    this.currentLine = document.querySelector(".line.current");
    if (operator) {
      if (this.rawBuffer.length === 0) {
        this.rawBuffer += this.history[this.history.length - 1].out;
      }
    }
    if (enclose === true) {
      let parsed = parser(this.rawBuffer);
      // console.log(parsed);
      let closeBrackets = 0;
      let parseStart = 0;
      for (let i = parsed.length - 1; i >= 0; i--) {
        if (parsed[i] === ")") {
          closeBrackets++;
        }
        if (parsed[i] === "(") {
          closeBrackets--;
          if (closeBrackets === 0) {
            parseStart = i;
            break;
          }
        }
        if (i === 0) parseStart = parsed.length - 1;
      }
      enclosedRaw = `(${parsed.slice(parseStart).join("")}${raw})`;
      this.rawBuffer = parsed.slice(0, parseStart).join("") + enclosedRaw;
      this.updateDisplay();
    } else {
      this.rawBuffer += raw;
      this.updateDisplay();
    }
  },
  variable: function () {
    let previous = this.rawBuffer.slice(-2);
    if (previous.length === 0) {
      this.variableIterator = 0;
      this.rawBuffer += Object.keys(this.variables)[this.variableIterator];
      this.updateDisplay();
    } else if (previous in this.variables) {
      this.variableIterator =
        (this.variableIterator + 1) % Object.keys(this.variables).length;
      this.rawBuffer =
        this.rawBuffer.slice(0, -2) +
        Object.keys(this.variables)[this.variableIterator];
      this.updateDisplay();
    } else {
      this.variableIterator = 0;
      this.rawBuffer += Object.keys(this.variables)[this.variableIterator];
      this.updateDisplay();
    }
  },
  solve: function () {
    try {
      const inputWidth = document.querySelector(".current .input").offsetWidth;
      this.currentLine.classList.remove("current");
      const lineOutput = document.createElement("div");
      lineOutput.classList.add("output");
      const result = solver(parser(this.rawBuffer));
      lineOutput.innerHTML = result;
      this.currentLine.appendChild(lineOutput);
      // console.log(
      //   lineOutput.offsetWidth + inputWidth,
      //   this.currentLine.offsetWidth
      // );
      if (!(lineOutput.offsetWidth + inputWidth < this.currentLine.offsetWidth)) {
        lineOutput.classList.add("overflow");
      }

      this.history.push({ in: this.rawBuffer, out: result });
      this.currentLine = document.createElement("div");
      this.currentLine.classList.add("line");
      this.currentLine.classList.add("current");
      this.lineInput = document.createElement("div");
      this.lineInput.classList.add("input");
      this.currentLine.appendChild(this.lineInput);
      this.displayBuffer.appendChild(this.currentLine);
      this.rawBuffer = "";
      // console.log(this.history);
    }
    catch(err) {
      this.saveState = this.displayBuffer;
      this.displayBuffer.innerHTML = `<div class='error'>${err}</div>`
      console.log("syntax error")

    }
  },
  updateDisplay: function () {
    let parsed = parser(this.rawBuffer);
    let openBracketCounter = 0;
    let lastIncrement = 0;
    let exponentiating = false;
    let exponentCounter = 0;
    for (let i = 0; i <= parsed.length; i++) {
      if (parsed[i] === "(") {
        if (exponentiating) {
          parsed[i] = "<sup>";
          exponentCounter = openBracketCounter;
        }
        openBracketCounter++;
        lastIncrement = i;
      }
      if (parsed[i] === ")") {
        openBracketCounter--;
        if (exponentiating && openBracketCounter === exponentCounter) {
          parsed[i] = "</sup>";
          exponentiating = false;
        }
        // else if (lastIncrement === i - 2) {
        //   // remove the brackets
        //   parsed[i] = "";
        //   parsed[i - 2] = "";
        // }
      }
      if (parsed[i] === "^") {
        exponentiating = true;
      }
    }
    this.lineInput.innerHTML = parsed.join("");
  },
  add: function (a, b) {
    return Number(a) + Number(b);
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
};
