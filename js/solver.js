function checkSolvingOrder(types) {
  let operations = {
    containsBracket: { truth: false, firstLocation: 0 },
    containsFunction: { truth: false, firstLocation: 0 },
    containsVariable: { truth: false, firstLocation: 0 },
    containsExponentiation: { truth: false, firstLocation: 0 },
    containsMultiplication: { truth: false, firstLocation: 0 },
    containsNegation: { truth: false, firstLocation: 0 },
    containsStoreVar: { truth: false, firstLocation: 0 },
    containsConst: { truth: false, firstLocation: 0 },
  };
  types.forEach((type, i) => {
    switch (type) {
      case "const":
        if (operations.containsConst.truth === false) {
          operations.containsConst.truth = true;
          operations.containsConst.firstLocation = i;
        }
        break;
      case "open-bracket":
        if (operations.containsBracket.truth === false) {
          operations.containsBracket.truth = true;
          operations.containsBracket.firstLocation = i;
        }
        break;
      case "func":
        if (operations.containsFunction.truth === false) {
          operations.containsFunction.truth = true;
          operations.containsFunction.firstLocation = i;
        }
        break;
      case "var":
        if (operations.containsVariable.truth === false) {
          operations.containsVariable.truth = true;
          operations.containsVariable.firstLocation = i;
        }
        break;
      case "multiply":
        if (operations.containsMultiplication.truth === false) {
          operations.containsMultiplication.truth = true;
          operations.containsMultiplication.firstLocation = i;
        }
        break;
      case "exp":
        if (operations.containsExponentiation.truth === false) {
          operations.containsExponentiation.truth = true;
          operations.containsExponentiation.firstLocation = i;
        }
        break;
      case "negate":
        if (operations.containsNegation.truth === false) {
          operations.containsNegation.truth = true;
          operations.containsNegation.firstLocation = i;
        }
        break;
      case "sto":
        if (operations.containsStoreVar.truth === false) {
          operations.containsStoreVar.truth = true;
          operations.containsStoreVar.firstLocation = i;
        }
        break;
    }
  });
  return operations;
}

function solver(equation, types) {
  console.log(equation, types);
  const operations = checkSolvingOrder(types);
  console.log(operations)

  if (operations.containsConst.truth === true) {
    equation[operations.containsConst.firstLocation] = `${
      calculator.constants[equation[operations.containsConst.firstLocation]]
    }`;
  }
  if (equation.length === 1 && operations.containsVariable.truth === false)
    return equation[0];
  if (operations.containsConst.truth === true) {
  }
  if (operations.containsStoreVar.truth === true) {
    equationLength = equation.length;
    const finalParseType = types[equationLength - 1];
    console.log(finalParseType)

    if (
      operations.containsStoreVar.firstLocation !== equationLength - 2 ||
      finalParseType !== "var"
    ) {
      throw "syntax error";
    }
    result = solver(
      equation.slice(0, equationLength - 2),
      types.slice(0, equationLength - 2)
    );

    calculator.variables[equation[equationLength - 1]] = result;
    return result;
  }
  if (operations.containsBracket.truth === true) {
    let openBracketCounter = 0;
    for (
      let i = operations.containsBracket.firstLocation + 1;
      i < equation.length;
      i++
    ) {
      if (equation[i] === "(") openBracketCounter++;
      if (equation[i] === ")") {
        if (openBracketCounter === 0) {
          const evaluatedResult = solver(
            equation.slice(operations.containsBracket.firstLocation + 1, i),
            types.slice(operations.containsBracket.firstLocation + 1, i)
          );
          equation.splice(
            operations.containsBracket.firstLocation,
            i - operations.containsBracket.firstLocation + 1,
            evaluatedResult
          );
          types.splice(
            operations.containsBracket.firstLocation,
            i - operations.containsBracket.firstLocation + 1,
            evaluatedResult
          );
          equation = solver(equation, types);
          return equation;
        }
        openBracketCounter--;
        // continue;
      }
      if (i > 100) break;
    }
    const evaluatedResult = solver(
      equation.slice(operations.containsBracket.firstLocation + 1),
      types.slice(operations.containsBracket.firstLocation + 1)
    );
    equation.splice(
      operations.containsBracket.firstLocation,
      equation.length - operations.containsBracket.firstLocation + 1,
      evaluatedResult
    );
    types.splice(
      operations.containsBracket.firstLocation,
      equation.length - operations.containsBracket.firstLocation + 1,
      evaluatedResult
    );
    equation = solver(equation, types);
    return equation;
  }
  if (operations.containsVariable.truth === true) {
    const index = operations.containsVariable.firstLocation;
    const evaluatedResult = `${calculator.variables[equation[index]]}`;
    equation.splice(index, 1, evaluatedResult);
    types.splice(index, 1, evaluatedResult);
    equation = solver(equation, types);
    return equation;
  }
  if (operations.containsFunction.truth === true) {
    const index = operations.containsFunction.firstLocation;
    const evaluatedResult = `${calculator[
      symbols.getKeyByValue(equation[index])
    ](equation[index + 1])}`;
    equation.splice(index, 2, evaluatedResult);
    types.splice(index, 2, evaluatedResult);
    equation = solver(equation, types);
    return equation;
  }
  if (operations.containsExponentiation.truth === true) {
    const index = operations.containsExponentiation.firstLocation;
    const evaluatedResult = `${calculator[
      symbols.getKeyByValue(equation[index])
    ](equation[index - 1], equation[index + 1])}`;
    equation.splice(
      operations.containsExponentiation.firstLocation - 1,
      3,
      evaluatedResult
    );
    types.splice(
      operations.containsExponentiation.firstLocation - 1,
      3,
      evaluatedResult
    );
    equation = solver(equation, types);
    return equation;
  }
  if (operations.containsNegation.truth === true) {
    const index = operations.containsNegation.firstLocation;
    if (
      !["number", "function", "open-bracket"].includes(
        types[index + 1]
      )
    ) {
      equation.splice(
        index + 1,
        equation.length - (index + 1),
        solver(equation.slice(index + 1), types.slice(index + 1))
      );
      types.splice(
        index + 1,
        equation.length - (index + 1),
        solver(equation.slice(index + 1), types.slice(index + 1))
      );
    }
    const evaluatedResult =
      equation[index].length % 2 === 0
        ? equation[index + 1]
        : calculator[symbols.getKeyByValue(equation[index])](
            equation[index + 1]
          );
    // const evaluatedResult = `${
    //   calculator[symbols.getKeyByValue(equation[index])](equation[index + 1])
    // }`;
    equation.splice(
      operations.containsNegation.firstLocation,
      2,
      `${evaluatedResult}`
    );
    types.splice(
      operations.containsNegation.firstLocation,
      2,
      `${evaluatedResult}`
    );
    equation = solver(equation, types);
    return equation;
  }
  if (operations.containsMultiplication.truth === true) {
    const index = operations.containsMultiplication.firstLocation;
    const evaluatedResult = `${calculator[
      symbols.getKeyByValue(equation[index])
    ](equation[index - 1], equation[index + 1])}`;
    equation.splice(
      operations.containsMultiplication.firstLocation - 1,
      3,
      evaluatedResult
    );
    types.splice(
      operations.containsMultiplication.firstLocation - 1,
      3,
      evaluatedResult
    );
    equation = solver(equation, types);
    return equation;
  }
  // addition
  const evaluatedResult = `${calculator[symbols.getKeyByValue(equation[1])](
    equation[0],
    equation[2]
  )}`;
  equation.splice(0, 3, evaluatedResult);
  types.splice(0, 3, evaluatedResult);
  equation = solver(equation, types);
  return equation;
}
