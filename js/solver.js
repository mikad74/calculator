function checkSolvingOrder(parsedEquation) {
  let operations = {
    containsBracket: { truth: false, firstLocation: 0 },
    containsFunction: { truth: false, firstLocation: 0 },
    containsVariable: { truth: false, firstLocation: 0 },
    containsExponentiation: { truth: false, firstLocation: 0 },
    containsMultiplication: { truth: false, firstLocation: 0 },
    containsNegation: { truth: false, firstLocation: 0 },
    containsStoreVar: { truth: false, firstLocation: 0 },
  };
  for (let i = 0; i < parsedEquation.length; i++) {
    if (parsedEquation[i].constructor === Array) continue;
    let parseType = getParseType(parsedEquation[i]);
    if (parseType === "variable" && !parsedEquation[i].length === 1) {
      parseType = "function";
    }
    switch (parseType) {
      case "open-bracket" || "close-bracket":
        if (operations.containsBracket.truth === false) {
          operations.containsBracket.truth = true;
          operations.containsBracket.firstLocation = i;
        }
        break;
      case "function":
        if (operations.containsFunction.truth === false) {
          operations.containsFunction.truth = true;
          operations.containsFunction.firstLocation = i;
        }
        break;
      case "variable":
        if (operations.containsVariable.truth === false) {
          operations.containsVariable.truth = true;
          operations.containsVariable.firstLocation = i;
        }
        break;
      case "multiplication-operator":
        if (operations.containsMultiplication.truth === false) {
          operations.containsMultiplication.truth = true;
          operations.containsMultiplication.firstLocation = i;
        }
        break;
      case "exponentiation-operator":
        if (operations.containsExponentiation.truth === false) {
          operations.containsExponentiation.truth = true;
          operations.containsExponentiation.firstLocation = i;
        }
        break;
      case "negation-operator":
        if (operations.containsNegation.truth === false) {
          operations.containsNegation.truth = true;
          operations.containsNegation.firstLocation = i;
        }
        break;
      case "store-var":
        if (operations.containsStoreVar.truth === false) {
          operations.containsStoreVar.truth = true;
          operations.containsStoreVar.firstLocation = i;
        }
        break;
    }
  }
  return operations;
}

function solver(parsedEquation) {
  const operations = checkSolvingOrder(parsedEquation);
  // console.log(operations, parsedEquation);
  if (parsedEquation.length === 1 && operations.containsVariable.truth === false) return parsedEquation[0];
  if (operations.containsStoreVar.truth === true) {
    parsedEquationLength = parsedEquation.length;
    const finalParseType = getParseType(parsedEquation[parsedEquationLength - 1]);
    console.log(finalParseType);
    if (
      operations.containsStoreVar.firstLocation !== parsedEquationLength - 2 ||
      finalParseType !== "variable"
    ) {
      throw "syntax error";
    }
    result = solver(parsedEquation.slice(0, parsedEquationLength - 2));
    console.log(result, parsedEquation[parsedEquationLength - 1]);
    calculator.variables[parsedEquation[parsedEquationLength - 1]] = result;
    return result;
  }
  if (operations.containsBracket.truth === true) {
    let openBracketCounter = 0;
    for (
      let i = operations.containsBracket.firstLocation + 1;
      i < parsedEquation.length;
      i++
    ) {
      if (parsedEquation[i] === "(") openBracketCounter++;
      // console.log(openBracketCounter, parsedEquation[i], i);
      if (parsedEquation[i] === ")") {
        if (openBracketCounter === 0) {
          const evaluatedResult = solver(
            parsedEquation.slice(
              operations.containsBracket.firstLocation + 1,
              i
            )
          );
          parsedEquation.splice(
            operations.containsBracket.firstLocation,
            i - operations.containsBracket.firstLocation + 1,
            evaluatedResult
          );
          parsedEquation = solver(parsedEquation);
          return parsedEquation;
        }
        openBracketCounter--;
        // continue;
      }
      if (i > 100) break;
    }
    const evaluatedResult = solver(
      parsedEquation.slice(operations.containsBracket.firstLocation + 1)
    );
    parsedEquation.splice(
      operations.containsBracket.firstLocation,
      parsedEquation.length - operations.containsBracket.firstLocation + 1,
      evaluatedResult
    );
    parsedEquation = solver(parsedEquation);
    return parsedEquation;
  }
  if (operations.containsVariable.truth === true) {
    const index = operations.containsVariable.firstLocation;
    const evaluatedResult = `${calculator.variables[parsedEquation[index]]}`;
    // console.log(evaluatedResult);
    parsedEquation.splice(index, 1, evaluatedResult);
    parsedEquation = solver(parsedEquation);
    return parsedEquation;
  }
  if (operations.containsFunction.truth === true) {
    const index = operations.containsFunction.firstLocation;
    const evaluatedResult = `${calculator[
      symbols.getKeyByValue(parsedEquation[index])
    ](parsedEquation[index + 1])}`;
    parsedEquation.splice(index, 2, evaluatedResult);
    parsedEquation = solver(parsedEquation);
    return parsedEquation;
  }
  if (operations.containsExponentiation.truth === true) {
    const index = operations.containsExponentiation.firstLocation;
    const evaluatedResult = `${calculator[
      symbols.getKeyByValue(parsedEquation[index])
    ](parsedEquation[index - 1], parsedEquation[index + 1])}`;
    parsedEquation.splice(
      operations.containsExponentiation.firstLocation - 1,
      3,
      evaluatedResult
    );
    parsedEquation = solver(parsedEquation);
    return parsedEquation;
  }
  if (operations.containsNegation.truth === true) {
    const index = operations.containsNegation.firstLocation;
    if (
      !["number", "function", "open-bracket"].includes(
        getParseType(parsedEquation[index + 1])
      )
    ) {
      parsedEquation.splice(
        index + 1,
        parsedEquation.length - (index + 1),
        solver(parsedEquation.slice(index + 1))
      );
    }
    const evaluatedResult =
      parsedEquation[index].length % 2 === 0
        ? parsedEquation[index + 1]
        : calculator[symbols.getKeyByValue(parsedEquation[index])](
            parsedEquation[index + 1]
          );
    // const evaluatedResult = `${
    //   calculator[symbols.getKeyByValue(parsedEquation[index])](parsedEquation[index + 1])
    // }`;
    parsedEquation.splice(
      operations.containsNegation.firstLocation,
      2,
      `${evaluatedResult}`
    );
    parsedEquation = solver(parsedEquation);
    return parsedEquation;
  }
  if (operations.containsMultiplication.truth === true) {
    const index = operations.containsMultiplication.firstLocation;
    const evaluatedResult = `${calculator[
      symbols.getKeyByValue(parsedEquation[index])
    ](parsedEquation[index - 1], parsedEquation[index + 1])}`;
    parsedEquation.splice(
      operations.containsMultiplication.firstLocation - 1,
      3,
      evaluatedResult
    );
    parsedEquation = solver(parsedEquation);
    return parsedEquation;
  }
  // addition
  {
    const evaluatedResult = `${calculator[
      symbols.getKeyByValue(parsedEquation[1])
    ](parsedEquation[0], parsedEquation[2])}`;
    parsedEquation.splice(0, 3, evaluatedResult);
    parsedEquation = solver(parsedEquation);
    return parsedEquation;
  }
}
