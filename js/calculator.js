// Heart of the calculator. This file deals with everything regarding the calculator itself

const calculator = {
  displayBuffer: undefined,
  currentLine: undefined,
  lineInput: undefined,
  saveState: undefined,
  isError: false,
  state: { val: [], type: [] },
  cursor: 0,
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
    this.lineInput.innerHTML = "";
    this.currentLine.appendChild(this.lineInput);
    this.displayBuffer.appendChild(this.currentLine);
    this.updateDisplay();
  },
  btnPres: function (raw, type, operator = false, enclose = false) {
    this.currentLine = document.querySelector(".line.current");
    if (operator) {
      if (this.state.val.length === 0) {
        this.state.val.push("Ans");
        this.state.type.push("number");
      }
    }
    if (enclose) {
      this.encloser();
      // let firstEncounter = this.state.type[this.state.type.length - 1];
      // let bracketCounter = 0;
      // if (firstEncounter === "close-bracket") {
      //   bracketCounter++;
      // }
      // let i = 0;
      // console.log(this.state.type)
      // for (i = this.state.type.length - 2; i > 0; i--) {
      //   currentEncounter = this.state.type[i]; // TODO implement the recursive loop
      //   if (currentEncounter === "number" && firstEncounter === "number") {
      //     continue;
      //   } else if (firstEncounter === "close-bracket") {
      //     if (currentEncounter === "close-bracket") {
      //       bracketCounter++;
      //       continue;
      //     }
      //     if (currentEncounter === "open-bracket") {
      //       bracketCounter--;
      //       continue;
      //     }
      //     if (bracketCounter === 0) {
      //       console.log(i)
      //       if (currentEncounter === "func") {
      //         i--;
      //         break;
      //       }
      //       if (currentEncounter === "exp" || currentEncounter === "number") {
      //         continue;
      //       }
      //       else break;
      //     }
      //   } else {
      //     break;
      //   }
      // }
      // if (firstEncounter !== "number") {
      //   this.state.val.push(")");
      //   this.state.type.push("close-bracket");
      //   this.state.val.splice(i + 1, 0, "(");
      //   this.state.type.splice(i + 1, 0, "open-bracket");
      // }
    }

    console.log(type);
    switch (type) {
      case "negate":
        if (
          ["number", "func", "close-bracket", "const", "var"].includes(
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
      case "standard-form":
        this.state.val.push("*");
        this.state.type.push("multiply");
        this.state.val.push("10");
        this.state.type.push("number");
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
              this.state.val.push(")");
              this.state.type.push("close-bracket");
            }
            return;
          }
        }
      }
      if (this.state.type[i] !== "open-bracket" || containsExponent) {
        this.state.val.splice(i, 0, "(");
        this.state.type.splice(i, 0, "open-bracket");
        this.state.val.push(")");
        this.state.type.push("close-bracket");
      }
    }
  },
  variable: function () {
    let previous = this.state.val[this.state.val.length - 1];
    if (!previous) {
      this.variableIterator = 0;
      this.state.val.push(Object.keys(this.variables)[this.variableIterator]);
      this.state.type.push("var");
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
      this.state.type.push("var");
      this.updateDisplay();
    }
  },
  solve: function () {
    try {
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
      this.updateDisplay();
      this.state = { val: [" "], type: ["null"] };
    } catch (err) {
      this.saveState = this.displayBuffer.innerHTML;
      this.displayBuffer.innerHTML = `<div class='error'>${err}</div>`;
      this.isError = true;
      console.log(err);
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
      this.state = { val: [" "], type: ["null"] };
    } else {
      this.displayBuffer.innerHTML = "";
      this.updateDisplay();
      this.displayBuffer.appendChild(this.currentLine);
    }
  },
  updateDisplay: function () {
    let parsed = Array.from(this.state.val);
    let exponentiating = false;
    let exponentCounter = 0;
    for (let i = 0; i < parsed.length; i++) {
      if (i === this.cursor) {
        parsed[i] = `<span class='cursor'>${parsed[i]}</span>`;
      }
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
    }
    if (this.cursor > parsed.length - 1) {
      parsed.push("<span class='cursor-lead'>|</span>");
    }
    console.log(parsed, this.state.val);
    this.lineInput.innerHTML = parsed.join("") + "";
  },
  left: function () {
    console.log(this.cursor);
    if (this.cursor > 0) {
      this.cursor--;
      this.updateDisplay();
    }
  },
  right: function () {
    console.log(this.cursor, this.state.val.length)
    if (this.cursor <= this.state.val.length - 1) {
      this.cursor++;
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
