function getParseType(char) {
  if (char.match(/\d/)) return "number";
  if (char.match(/[\+\-]/)) return "addition-operator";
  if (char.match(/[\*\/]/)) return "multiplication-operator";
  if (char.match(/[\(\)]/)) return "bracket";
  if (char.match(/[\_]/)) return "evaluated-function";
  return "function";
}

function checkSolvingOrder(parsedEquation) {
  let operations = {
    containsBracket: { truth: false, firstLocation: 0 },
    containsFunction: { truth: false, firstLocation: 0 },
    containsMultiplication: { truth: false, firstLocation: 0 },
  };
  for (let i = 0; i < parsedEquation.length; i++) {
    if (parsedEquation[i].constructor === Array) continue;
    const parseType = getParseType(parsedEquation[i]);
    switch (parseType) {
      case "bracket":
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
    }
  }
  return operations;
}

function solver(parsedEquation) {
  if (parsedEquation.length === 1) return parsedEquation[0];
  const operations = checkSolvingOrder(parsedEquation);
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
    const evaluatedResult = `_${
      parsedEquation[operations.containsFunction.firstLocation]
    } ${parsedEquation[operations.containsFunction.firstLocation + 1]}`;
    parsedEquation.splice(
      operations.containsFunction.firstLocation,
      2,
      evaluatedResult
    );
    parsedEquation = solver(parsedEquation);
    return parsedEquation;
  }
  if (operations.containsMultiplication.truth === true) {
    const evaluatedResult = `${
      calculator[parsedEquation[1]](parsedEquation[0], parsedEquation[2])
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
      calculator[parsedEquation[1]](parsedEquation[0], parsedEquation[2])
    }`;
    parsedEquation.splice(0, 3, evaluatedResult);
    parsedEquation = solver(parsedEquation);
    return parsedEquation;
  }
}


console.log(solver(["(", "12", "-", "15", ")", "*", "(", "5", "+", "3", ")"]));
