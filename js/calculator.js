// Heart of the calculator. This file deals with everything regarding the calculator itself

const calculator = {
  displayBuffer: undefined,
  currentLine: undefined,
  lineInput: undefined,
  saveState: undefined,
  state: { val: [], type: [] },
  cursor: 0,
  history: [{ in: 0, out: 0 }],
  variables: {
    "x": 0,
    "y": 0,
    "z": 0,
    "t": 0,
    "a": 0,
    "b": 0,
    "c": 0,
  },
  constants: {
    "\u03c0": Math.PI,
  },
  options: {
    angle: "rad",
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
  btnPres: function (raw, type, operator = false, enclose = false) {
    this.currentLine = document.querySelector(".line.current");
    if (operator) {
      if (this.state.length === 0) {
        this.state.val.push("Ans");
        this.state.val.push("number");
      }
    }

    console.log(type);
    switch (type) {
      case "negate":
        if (
          ["number", "func", "close-bracket", "const","var"].includes(
            this.state.type[this.state.type.length - 1]
          )
        ) {
          this.state.val.push("*");
          this.state.type.push("multiply");
        }
        this.state.val.push(raw);
        this.state.type.push(type);
        break;

      case "func":
        if (
          ["number", "close-bracket", "const", "var"].includes(
            this.state.type[this.state.type.length - 1]
          )
        ) {
          this.state.val.push("*");
          this.state.type.push("multiply");
        }
        this.state.val.push(raw);
        this.state.type.push(type);
        this.state.val.push("(");
        this.state.type.push("open-bracket");
        break;

      case "square": // TODO: Recursion
        this.state.val.push("^");
        this.state.type.push("exp");
        this.state.val.push("(");
        this.state.type.push("open-bracket");
        this.state.val.push("2");
        this.state.type.push("number");
        this.state.val.push(")");
        this.state.type.push("close-bracket");
        break;
      case "invert": // TODO: Recursion
        this.state.val.push("^");
        this.state.type.push("exp");
        this.state.val.push("(");
        this.state.type.push("open-bracket");
        this.state.val.push("-1");
        this.state.type.push("number");
        this.state.val.push(")");
        this.state.type.push("close-bracket");
        break;
      case "exp":
        this.state.val.push("^");
        this.state.type.push("exp");
        this.state.val.push("(");
        this.state.type.push("open-bracket");
        break;
      case "open-bracket":
        if (
          ["number", "close-bracket", "const", "var"].includes(
            this.state.type[this.state.type.length - 1]
          )
        ) {
          this.state.val.push("*");
          this.state.type.push("multiply");
        }
        this.state.val.push(raw);
        this.state.type.push(type);
        break;
      case "const":
        if (
          ["number", "close-bracket", "const", "var"].includes(
            this.state.type[this.state.type.length - 1]
          )
        ) {
          this.state.val.push("*");
          this.state.type.push("multiply");
        }
        this.state.val.push(raw);
        this.state.type.push(type);
        break;
      case "number":
        if (
          ["close-bracket", "const", "var"].includes(
            this.state.type[this.state.type.length - 1]
          )
        ) {
          this.state.val.push("*");
          this.state.type.push("multiply");
        }
        this.state.val.push(raw);
        this.state.type.push(type);
        break;

      default:
        this.state.val.push(raw);
        this.state.type.push(type);
        break;
    }

    this.updateDisplay(this.state);
    // console.log(this.state.val, this.state.type);
    // if (operator) {
    //   if (this.state.length === 0) {
    //     this.state += this.history[this.history.length - 1].out;
    //   }
    // }
    // if (enclose === true) {
    //   let parsed = parser(this.state);
    //   // console.log(parsed);
    //   let closeBrackets = 0;
    //   let parseStart = 0;
    //   for (let i = parsed.length - 1; i >= 0; i--) {
    //     if (parsed[i] === ")") {
    //       closeBrackets++;
    //     }
    //     if (parsed[i] === "(") {
    //       closeBrackets--;
    //       if (closeBrackets === 0) {
    //         parseStart = i;
    //         break;
    //       }
    //     }
    //     if (i === 0) parseStart = parsed.length - 1;
    //   }
    //   enclosedRaw = `(${parsed.slice(parseStart).join("")}${raw})`;
    //   this.state = parsed.slice(0, parseStart).join("") + enclosedRaw;
    //   this.updateDisplay();
    // } else {
    //   this.state += raw;
    //   this.updateDisplay();
    // }
  },
  variable: function () {
    let previous = this.state.val[this.state.val.length - 1];
    if (!previous) {
      this.variableIterator = 0;
      this.state.val.push(Object.keys(this.variables)[this.variableIterator]);
      this.state.type.push("var")
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
      if (
        ["number", "close-bracket", "const"].includes(
          this.state.type[this.state.type.length - 1]
        )
      ) {
        this.state.val.push("*");
        this.state.type.push("multiply");
      }
      this.state.val.push(Object.keys(this.variables)[this.variableIterator]);
      this.state.type.push("var")
      this.updateDisplay();
    }
  },
  solve: function () {
    // try {
    const inputWidth = document.querySelector(".current .input").offsetWidth;
    this.currentLine.classList.remove("current");
    const lineOutput = document.createElement("div");
    lineOutput.classList.add("output");
    const parsedState = parser(this.state);
    console.log(parsedState);
    const result = solver(parsedState.val, parsedState.type);
    lineOutput.innerHTML = result;
    this.currentLine.appendChild(lineOutput);
    // console.log(
    //   lineOutput.offsetWidth + inputWidth,
    //   this.currentLine.offsetWidth
    // );
    if (!(lineOutput.offsetWidth + inputWidth < this.currentLine.offsetWidth)) {
      lineOutput.classList.add("overflow");
    }

    this.history.push({ in: this.state, out: result });
    this.currentLine = document.createElement("div");
    this.currentLine.classList.add("line");
    this.currentLine.classList.add("current");
    this.lineInput = document.createElement("div");
    this.lineInput.classList.add("input");
    this.currentLine.appendChild(this.lineInput);
    this.displayBuffer.appendChild(this.currentLine);
    this.state = { val: [], type: [] };
    // console.log(this.history);
    // } catch (err) {
    // this.saveState = this.displayBuffer;
    // this.displayBuffer.innerHTML = `<div class='error'>${err}</div>`;
    // console.log(err);
    // }
  },
  updateDisplay: function () {
    this.lineInput.innerHTML = this.state.val.join("");
  },
  //   console.log(parsed)
  //   let openBracketCounter = 0;
  //   let lastIncrement = 0;
  //   let exponentiating = false;
  //   let exponentCounter = 0;
  //   for (let i = 0; i < parsed.length; i++) {
  //     if (parsed[i] === "(") {
  //       openBracketCounter++;
  //       if (exponentiating) {
  //         parsed[i] = "<sup>";
  //         exponentCounter ++;
  //       }
  //       lastIncrement = i;
  //     }
  //     console.log(exponentCounter, exponentiating, i)
  //     if (parsed[i] === ")") {
  //       if (exponentiating && openBracketCounter === exponentCounter) {
  //         parsed[i] = "</sup>";
  //         exponentCounter --
  //       }
  //       if (exponentCounter === 0) exponentiating = false;
  //       openBracketCounter--;
  //       // else if (lastIncrement === i - 2) {
  //       //   // remove the brackets
  //       //   parsed[i] = "";
  //       //   parsed[i - 2] = "";
  //       // }
  //     }
  //     if (parsed[i] === "^") {
  //       exponentiating = true;
  //       parsed[i] = ""
  //     }
  //   }
  //   console.log(parsed)
  //   this.lineInput.innerHTML = parsed.join("");
  // },
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
  ln: function (a) {},
};
