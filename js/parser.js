function getParseType(char) {
  if (char.match(/[.\d]/)) return "number";
  if (char.match(/[+]/)) return "addition-operator";
  if (char.match(/[-]/)) return "negation-operator";
  if (char.match(/[*/]/)) return "multiplication-operator";
  if (char.match(/[\^]/)) return "exponentiation-operator";
  if (char.match(/[()]/)) return "bracket";
  if (char.match(/[_]/)) return "evaluated-function";
  return "function";
}

function parser(str) {
  let parsedString = [];
  let workingString = str.replace(/\s/g,"");
  while (workingString.length >= 1) {
    let currentStringParse = "";
    const currentParseType = getParseType(workingString.slice(0, 1));
    let i = 0;
    while (currentParseType === getParseType(workingString.slice(i, i + 1)) && i < workingString.length){
      console.log(currentParseType)
      currentStringParse += workingString.slice(i, i + 1);
      i++
      if (i > 200) break;
    }
    workingString = workingString.slice(i);
    parsedString.push(currentStringParse);
  }
  return parsedString;
}

