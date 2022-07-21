function getParseType(char) {
  if (char.match(/[\d]/) || char.match(symbols.regEx("decimal")))
    return "number";
  if (char.match(symbols.regEx("add"))) return "addition-operator";
  if (char.match(symbols.regEx("subtract"))) return "subtract-operator";
  if (char.match(symbols.regEx("negate"))) return "negation-operator";
  if (
    char.match(symbols.regEx("divide")) ||
    char.match(symbols.regEx("multiply"))
  )
    return "multiplication-operator";
  if (char.match(symbols.regEx("exponentiate")))
    return "exponentiation-operator";
  if (char.match(symbols.regEx("openBracket"))) return "open-bracket";
  if (char.match(symbols.regEx("closeBracket"))) return "close-bracket";
  return "function";
}

function parser(str) {
  let parsedString = [];
  let workingString = str.replace(/\s/g, "");
  let previousParseType = "";
  while (workingString.length >= 1) {
    let currentStringParse = "";
    const currentParseType = getParseType(workingString.slice(0, 1));
    switch (currentParseType) {
      case "subtract-operator":
        if (
          ["number", "function", "close-bracket"].includes(previousParseType)
        ) {
          parsedString.push("+");
        }
        break;
      case "negation-operator":
        if (
          ["number", "function", "close-bracket"].includes(previousParseType)
        ) {
          parsedString.push("*");
        }
        break;
      case "function":
        if (["number", "close-bracket"].includes(previousParseType)) {
          parsedString.push("*");
        }
        break;
      case "open-bracket":
        if (["number", "close-bracket"].includes(previousParseType)) {
          parsedString.push("*");
        }
        break;
    }
    let i = 0;
    while (
      currentParseType === getParseType(workingString.slice(i, i + 1)) &&
      i < workingString.length
    ) {
      switch(currentParseType) {
      case "multiplication-operator":
        if (
          !["number", "close-bracket"].includes(previousParseType)
            || i > 0
        ) {
          throw "Syntax Error"
        }
        break;
      case "addition-operator":
        if (
          !["number", "close-bracket"].includes(previousParseType)
            || i > 0
        ) {
          throw "Syntax Error"
        }
        break;
      }
      // console.log(currentParseType)
      currentStringParse += workingString.slice(i, i + 1);
      i++;
      if (i > 200) break;
    }
    console.log(currentParseType, previousParseType, parsedString);
    workingString = workingString.slice(i);
    parsedString.push(currentStringParse);
    previousParseType = currentParseType;
  }
  if (previousParseType === "function") throw "Syntax Error"
  return parsedString;
}
