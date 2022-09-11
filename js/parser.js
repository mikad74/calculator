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
  if (char.match(/[xyztabc\u2028]/)) return "variable";
  if (char.match(symbols.regEx("storeVar"))) return "store-var";
  if (char.match(symbols.regEx("pi"))) return "const";
  return "function";
}

function parser(str) {
  let parsedString = [];
  let workingString = str.replace(/[\s&&[^\u2028]]/g, "");
  let previousParseType = "";
  let j = 0;
  while (workingString.length >= 1) {
    let currentStringParse = "";
    let currentParseType = getParseType(workingString.slice(0, 1));
    if (workingString.length >= 2) {
      const nextParseType = getParseType(workingString.slice(1, 2));
      const thirdParseType = getParseType(workingString.slice(2, 3));
      console.log(currentParseType, nextParseType, workingString.slice(0,2))
      if (currentParseType === "variable") {
        if (nextParseType === "variable" && thirdParseType !== "function") {
          if (["number", "close-bracket"].includes(previousParseType))
            parsedString.push("*");
          parsedString.push(workingString.slice(0, 2));
          workingString = workingString.slice(2);
          previousParseType = currentParseType;
          continue;
        } else currentParseType = "function";
      }
    }
    console.log(currentParseType);
    switch (currentParseType) {
      case "subtract-operator":
        if (
          ["number", "function", "close-bracket", "const"].includes(
            previousParseType
          )
        ) {
          parsedString.push("+");
        }
        break;
      case "negation-operator":
        if (
          ["number", "function", "close-bracket", "const"].includes(
            previousParseType
          )
        ) {
          parsedString.push("*");
        }
        break;
      case "function":
        if (["number", "close-bracket", "const"].includes(previousParseType)) {
          parsedString.push("*");
        }
        break;
      case "open-bracket":
        if (["number", "close-bracket", "const"].includes(previousParseType)) {
          parsedString.push("*");
        }
        break;
      case "const":
        if (["number", "close-bracket", "const"].includes(previousParseType)) {
          parsedString.push("*");
        }
        break;
      case "number":
        if (["close-bracket", "const"].includes(previousParseType)) {
          parsedString.push("*");
        }
        break;
    }
    let i = 0;
    console.log(getParseType(workingString.slice(0,1)))
    while (
      (currentParseType === getParseType(workingString.slice(i, i + 1)) || i === 0) &&
      i < workingString.length
    ) {
      switch (currentParseType) {
        case "multiplication-operator":
          if (
            !["number", "close-bracket", "variable", "const"].includes(
              previousParseType
            ) ||
            i > 0
          ) {
            throw "Syntax Error";
          }
          break;
        case "addition-operator":
          if (
            !["number", "close-bracket", "variable", "const"].includes(
              previousParseType
            ) ||
            i > 0
          ) {
            throw "Syntax Error";
          }
          break;
      }
      currentStringParse +=
        currentParseType !== "subtract-operator"
          ? workingString.slice(i, i + 1)
          : symbols.negate;
      i++;
      if (currentParseType === "close-bracket") break;
      if (currentParseType === "open-bracket") break;
      if (i > 20) break;
    }
    j++;
    workingString = workingString.slice(i);
    parsedString.push(currentStringParse);
    previousParseType = currentParseType;
    if (j > 20) break;
  }
  // console.log(previousParseType);
  // if (previousParseType === "function") throw "Syntax Error";
  return parsedString;
}
