const calculator = {
  buffer: "",
  btnPres: function (btn) {
    console.log(btn);
    this.buffer += btn;
    display.innerText = this.buffer;
  },
  solve: function () {
    const result = solver(parser(this.buffer));
    console.log(result);
    display.innerText = result;
    this.buffer = "";
  },
  "+" : function (a, b) {
    return Number(a) + Number(b)
  },
  "-" : function (a, b) {
    return Number(a) - Number(b)
  },
  "*" : function (a, b) {
    return Number(a) * Number(b)
  },
  "/" : function (a, b) {
    return Number(a) / Number(b)
  },
};


