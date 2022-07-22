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
    this.lineInput = document.createElement("span")
    this.lineInput.classList.add("input")
    this.currentLine.appendChild(this.lineInput)
    this.displayBuffer.appendChild(this.currentLine);
  },
  btnPres: function (display, raw) {
    this.currentLine = document.querySelector(".line.current")
    this.rawBuffer += raw;
    const currentDisplay = this.lineInput.innerHTML;
    this.lineInput.innerHTML = currentDisplay + display;
  },
  solve: function () {
    this.currentLine.classList.remove("current")
    const lineOutput = document.createElement("span")
    lineOutput.classList.add("output")
    console.log(parser(this.rawBuffer))
    const result = solver(parser(this.rawBuffer));
    console.log(result)
    lineOutput.innerHTML = result;
    this.currentLine.appendChild(lineOutput)
    this.history.push({display: this.currentLine, raw: this.rawBuffer})
    this.currentLine = document.createElement("div")
    this.currentLine.classList.add("line");
    this.currentLine.classList.add("current");
    this.lineInput = document.createElement("span")
    this.lineInput.classList.add("input")
    this.currentLine.appendChild(this.lineInput)
    this.displayBuffer.appendChild(this.currentLine)
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
