const calculator = {
  displayBuffer: undefined,
  rawBuffer: "",
  btnPres: function (display, raw) {
    this.rawBuffer += raw;
    const currentDisplay = this.displayBuffer.innerHTML;
    this.displayBuffer.innerHTML = currentDisplay + display;
  },
  solve: function () {
    console.log(this.rawBuffer);
    console.log(parser(this.rawBuffer));
    const result = solver(parser(this.rawBuffer));
    console.log(result);
    this.displayBuffer.innerHTML = result;
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
