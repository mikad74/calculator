// Heart of the calculator. This file deals with everything regarding the calculator itself

const calculator = {
  displayBuffer: undefined,
  currentLine: undefined,
  lineInput: undefined,
  rawBuffer: "",
  history: [],
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
  btnPres: function (raw, enclose = false) {
    this.currentLine = document.querySelector(".line.current");
    if (enclose === true) {
      parsed = parser(this.rawBuffer);
      console.log(parsed);
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
      enclosedRaw = `(${parsed.slice(parseStart).join("")}${raw})`
      console.log(parseStart);
      console.log(parsed, enclosedRaw);
      console.log(parsed.slice(0, parseStart).join('') + enclosedRaw);
      this.rawBuffer = parsed.slice(0, parseStart).join("") + enclosedRaw;
      const currentDisplay = this.lineInput.innerHTML;
      this.lineInput.innerHTML = currentDisplay + raw;
    } else {
      this.rawBuffer += raw;
      const currentDisplay = this.lineInput.innerHTML;
      this.lineInput.innerHTML = currentDisplay + raw;
    }
  },
  solve: function () {
    const inputWidth = document.querySelector(".current .input").offsetWidth;
    this.currentLine.classList.remove("current");
    const lineOutput = document.createElement("div");
    lineOutput.classList.add("output");
    const result = solver(parser(this.rawBuffer));
    lineOutput.innerHTML = result;
    this.currentLine.appendChild(lineOutput);
    console.log(
      lineOutput.offsetWidth + inputWidth,
      this.currentLine.offsetWidth
    );
    if (!(lineOutput.offsetWidth + inputWidth < this.currentLine.offsetWidth)) {
      lineOutput.classList.add("overflow");
    }

    this.history.push({ display: this.currentLine, raw: this.rawBuffer });
    this.currentLine = document.createElement("div");
    this.currentLine.classList.add("line");
    this.currentLine.classList.add("current");
    this.lineInput = document.createElement("div");
    this.lineInput.classList.add("input");
    this.currentLine.appendChild(this.lineInput);
    this.displayBuffer.appendChild(this.currentLine);
    // this.history.push(this.displayBuffer.innerHTML)
    this.rawBuffer = "";
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
