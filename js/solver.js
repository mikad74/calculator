function getParseType(char) {
  if (char.match(/\d/)) return "number";
  if (char.match(/[\+\-]/)) return "addition-operator";
  if (char.match(/[\*\/]/)) return "multiplication-operator";
  if (char.match(/[\(\)]/)) return "bracket";
  if (char.match(/[\_]/)) return "evaluated-function";
  return "function";
}

function solver(parsedEquation) {
  console.log(parsedEquation);
  if (parsedEquation.length === 1) return parsedEquation[0];
  let containsBracket = { truth: false, firstLocation: 0 };
  let containsFunction = { truth: false, firstLocation: 0 };
  let containsMultiplication = { truth: false, firstLocation: 0 };
  for (let i = 0; i < parsedEquation.length; i++) {
    if (parsedEquation[i].constructor === Array) continue;
    const parseType = getParseType(parsedEquation[i]);
    // console.log(i, parsedEquation[i], parseType);
    switch (parseType) {
      case "bracket":
        if (containsBracket.truth === false) {
          containsBracket.truth = true;
          containsBracket.firstLocation = i;
        }
        break;
      case "function":
        if (containsFunction.truth === false) {
          containsFunction.truth = true;
          containsFunction.firstLocation = i;
        }
        break;
      case "multiplication-operator":
        if (containsMultiplication.truth === false) {
          containsMultiplication.truth = true;
          containsMultiplication.firstLocation = i;
        }
        break;
    }
  }
  // console.log(containsBracket, containsFunction, containsMultiplication);
  if (containsBracket.truth === true) {
    for (
      let i = parsedEquation.length - 1;
      i > containsBracket.firstLocation;
      i--
    ) {
      if (parsedEquation[i] === ")") {
        const evaluatedResult = solver(
          parsedEquation.slice(containsBracket.firstLocation + 1, i)
        );
        parsedEquation.splice(
          containsBracket.firstLocation,
          i - containsBracket.firstLocation + 1,
          evaluatedResult
        );
        parsedEquation = solver(parsedEquation);
        return parsedEquation
      }
    }
    const evaluatedResult = solver(
      parsedEquation.slice(containsBracket.firstLocation + 1)
    );
    parsedEquation.splice(
      containsBracket.firstLocation,
      parsedEquation.length - containsBracket.firstLocation + 1,
      evaluatedResult
    );
    parsedEquation = solver(parsedEquation);
    return parsedEquation
  } else if (containsFunction.truth === true) {
    const evaluatedResult = `_${
      parsedEquation[containsFunction.firstLocation]
    } ${parsedEquation[containsFunction.firstLocation + 1]}`;
    parsedEquation.splice(containsFunction.firstLocation, 2, evaluatedResult);
    parsedEquation = solver(parsedEquation);
    return parsedEquation
  } else if (containsMultiplication.truth === true) {
    const evaluatedResult = `${
      parsedEquation[containsMultiplication.firstLocation - 1]
    } ${parsedEquation[containsMultiplication.firstLocation]} ${
      parsedEquation[containsMultiplication.firstLocation + 1]
    }`;
    parsedEquation.splice(
      containsMultiplication.firstLocation - 1,
      3,
      evaluatedResult
    );
    parsedEquation = solver(parsedEquation)
    return parsedEquation

  } else {
    const evaluatedResult = `${parsedEquation[0]} ${parsedEquation[1]} ${parsedEquation[2]}`;
    parsedEquation.splice(0, 3, evaluatedResult);
    parsedEquation = solver(parsedEquation)
    return parsedEquation
  }
}

// console.log(solver(["ln", "(", "15", "*", "3", ")", "+", "12"]));
// console.log(solver(["ln", "(", "15", "*", "3"]))
