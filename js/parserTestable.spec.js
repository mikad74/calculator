const parser = require('./parserTestable')

test("can parse simple expressions", () => {
  expect(parser("95+12")).toEqual(["95", "+", "12"]);
});

test("can parse expressions with multiple operators", () => {
  expect(parser("95+12-13/4")).toEqual(["95", "+", "12", "-", "13", "/", "4"]);
});

test("can parse with brackets", () => {
  expect(parser("(12+15)/10")).toEqual(["(", "12", "+", "15", ")", "/", "10"]);
});

test("can parse functions without brackets", () => {
  expect(parser("ln15")).toEqual(["ln", "15"]);
});

test("can parse functions with brackets", () => {
  expect(parser("ln(15) + 12")).toEqual(["ln", "(", "15", ")", "+", "12"]);
});
