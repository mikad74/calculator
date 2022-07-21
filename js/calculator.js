const calculator = {
  displayBuffer: undefined,
  rawBuffer: "",
  btnPres: function (display, raw) {
    this.rawBuffer += raw;
    const currentDisplay = this.displayBuffer.innerHTML;
    this.displayBuffer.innerHTML = currentDisplay + display;
    console.log(parser(this.rawBuffer));
  },
  solve: function () {
    console.log(this.rawBuffer);
    console.log(parser(this.rawBuffer));
    const result = solver(parser(this.rawBuffer));
    console.log(result);
    this.displayBuffer.innerHTML = result;
    this.rawBuffer = "";
  },
  "+": function (a, b) {
    return Number(a) + Number(b);
  },
  "-": function (a) {
    return Number(-a);
  },
  "*": function (a, b) {
    return Number(a) * Number(b);
  },
  "/": function (a, b) {
    return Number(a) / Number(b);
  },
  "^": function (a, b) {
    return Math.pow(Number(a), Number(b));
  },
};
