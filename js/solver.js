function checkSolvingOrder(parsedEquation) {
  let operations = {
    containsBracket: { truth: false, firstLocation: 0 },
    containsFunction: { truth: false, firstLocation: 0 },
    containsExponentiation: { truth: false, firstLocation: 0 },
    containsMultiplication: { truth: false, firstLocation: 0 },
    containsNegation: { truth: false, firstLocation: 0 },
  };
  for (let i = 0; i < parsedEquation.length; i++) {
    if (parsedEquation[i].constructor === Array) continue;
    const parseType = getParseType(parsedEquation[i]);
    console.log(parseType)
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
    }
  }
  return operations;
}

function solver(parsedEquation) {
  if (parsedEquation.length === 1) return parsedEquation[0];
  const operations = checkSolvingOrder(parsedEquation);
  console.log(operations, parsedEquation)
  if (operations.containsBracket.truth === true) {
    let openBracketCounter = 0;
    for (
      let i = operations.containsBracket.firstLocation + 1;
      parsedEquation.length;
      i++
    ) {
      if (parsedEquation[i] === "(") openBracketCounter++;
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
        continue;
      }
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
  if (operations.containsFunction.truth === true) {
    const index = operations.containsFunction.firstLocation
    const evaluatedResult = `${
      calculator[symbols.getKeyByValue(parsedEquation[index])](parsedEquation[index + 1])
    }`;
    parsedEquation.splice(
      operations.containsFunction.firstLocation,
      2,
      evaluatedResult
    );
    parsedEquation = solver(parsedEquation);
    return parsedEquation;
  }
  if (operations.containsExponentiation.truth === true) {
    const index = operations.containsMultiplication.firstLocation
    const evaluatedResult = `${
      calculator[symbols.getKeyByValue(parsedEquation[index])](parsedEquation[index - 1], parsedEquation[index + 1])
    }`;
    parsedEquation.splice(
      operations.containsExponentiation.firstLocation - 1,
      3,
      evaluatedResult
    );
    parsedEquation = solver(parsedEquation);
    return parsedEquation;
  }
  if (operations.containsNegation.truth === true) {
    const index = operations.containsNegation.firstLocation
    console.log(parsedEquation)
    console.log(parsedEquation[index])
    console.log(parsedEquation[index + 1])
    console.log(parsedEquation[index].length % 2)
    console.log(getParseType(parsedEquation[index + 1]))
    if (!["number", "function", "open-bracket"].includes(getParseType(parsedEquation[index + 1]))) {
      parsedEquation.splice(
        index + 1,
        parsedEquation.length - (index + 1),
        solver(parsedEquation.slice(index + 1))
      )
    }
    console.log(parsedEquation)
    console.log(parsedEquation[index])
    const evaluatedResult = parsedEquation[index].length % 2 === 0 ? parsedEquation[index + 1] : calculator[symbols.getKeyByValue(parsedEquation[index])](parsedEquation[index + 1])
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
    const index = operations.containsMultiplication.firstLocation
    const evaluatedResult = `${
      calculator[symbols.getKeyByValue(parsedEquation[index])](parsedEquation[index-1], parsedEquation[index + 1])
    }`;
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
    const evaluatedResult = `${
      calculator[symbols.getKeyByValue(parsedEquation[1])](parsedEquation[0], parsedEquation[2])
    }`;
    parsedEquation.splice(0, 3, evaluatedResult);
    parsedEquation = solver(parsedEquation);
    return parsedEquation;
  }
}

