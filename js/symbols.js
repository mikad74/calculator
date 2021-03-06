const symbols = {
  add: "+",
  subtract: "\u2012",
  multiply: "*",
  divide: "\u00f7",
  exponentiate: "^",
  negate: "\u2011",
  decimal: ".",
  openBracket: "(",
  closeBracket: ")",

  regEx: function (property) {
    let re = new RegExp("\\" + this[property]);
    return re;
  },

  getKeyByValue: function(value) {
    return Object.keys(this).find(key => this[key] === value)
  }
};


