function getParseType(char) {
  if (char.match(/\d/)) return "number";
  if (char.match(/[\+\-\*\/]/)) return "operator";
  if (char.match(/[\(\)]/)) return "bracket";
  return "function";
}

function parser(str) {
  let parsedString = [];
  let workingString = str.replace(/\s/g,"");
  while (workingString.length >= 1) {
    let currentStringParse = "";
    const currentParseType = getParseType(workingString.slice(0, 1));
    let i = 0;
    while (currentParseType === getParseType(workingString.slice(i, i + 1))) {
      currentStringParse += workingString.slice(i, i + 1);
      i++
    }
    workingString = workingString.slice(i);
    parsedString.push(currentStringParse);
  }
  return parsedString;
}

module.exports = parser;
