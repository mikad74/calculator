// Script that defines all symbols used in the program.

const symbols = {
  rewrite: "\u21d4",
  add: "+",
  subtract: "\u2012",
  multiply: "*",
  divide: "\u00f7",
  exponentiate: "^",
  negate: "\u2011",
  decimal: ".",
  openBracket: "(",
  closeBracket: ")",
  storeVar: "\u2192",
  pi: "\u03c0",
  sin: "sin",
  cos: "cos",
  tan: "tan",
  ln: "ln",

  regEx: function (property) {
    let re = new RegExp("\\" + this[property]);
    return re;
  },

  getKeyByValue: function(value) {
    return Object.keys(this).find(key => this[key] === value)
  }
};


