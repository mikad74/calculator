function isDigit(str) {
  return str.match(/[\d.]/) ? true : false;
}

function addImplicitMultiplication(type, output_arr) {
  switch (type) {
    case "negate":
      if (["number", "func", "close-bracket", "const", "var"].includes(type)) {
        this.output_arr.push("*");
        this.output_arr.push("multiply");
      }

    case "func":
      if (["number", "close-bracket", "const", "var"].includes(type)) {
        this.output_arr.push("*");
        this.output_arr.push("multiply");
      }
    case "open-bracket":
      if (["number", "close-bracket", "const", "var"].includes(type)) {
        this.output_arr.push("*");
        this.output_arr.push("multiply");
      }
    case "const":
      if (["number", "close-bracket", "const", "var"].includes(type)) {
        this.output_arr.push("*");
        this.output_arr.push("multiply");
      }
    case "number":
      if (["close-bracket", "const", "var"].includes(type)) {
        this.output_arr.push("*");
        this.output_arr.push("multiply");
      }
  }
}

function parser(obj) {
  console.log(obj);
  output_arr = { val: [], type: [] };
  obj.val.forEach((el, index) => {
    console.log(el, index);
    if (obj.type[index] === "placeholder") return;
    console.log(el, index);
    if (el === "frac-top") {
      output_arr.val.push("(");
      output_arr.type.push("open-bracket");
      return;
    } else if (el === "frac-bot") {
      output_arr.val.push(")");
      output_arr.type.push("close-bracket");
      output_arr.val.push("\u00f7");
      output_arr.type.push("multiply");
      output_arr.val.push("(");
      output_arr.type.push("open-bracket");
      return;
    } else if (el === "frac-end") {
      output_arr.val.push(")");
      output_arr.type.push("close-bracket");
      return;
    }
    if (output_arr.val.length === 0) {
      output_arr.val.push(el);
      output_arr.type.push(obj.type[index]);
    } else {
      if (isDigit(el) && isDigit(output_arr.val[output_arr.val.length - 1]))
        output_arr.val[output_arr.val.length - 1] += el;
      else {
        addImplicitMultiplication(obj[index], output_arr);
        output_arr.val.push(el);
        output_arr.type.push(obj.type[index]);
      }
    }
  });
  console.log(output_arr);
  return output_arr;
}
