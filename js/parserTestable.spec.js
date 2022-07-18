import  parser from './parserTestable'

test("can parse simple expressions", () => {
  expect(parser("95+12")).toBe(["95", "+", "12"]);
});

test("can parse expressions with multiple operators", () => {
  expect(parser("95+12-13/4")).toBe(["95", "+", "12", "-", "13", "/", "4"]);
});

test("can parse with brackets", () => {
  expect(parsers("(12+15)/10")).toBe(["(", "12", "+", "15", ")", "/", "10"]);
});

test("can parse functions without brackets", () => {
  expect(parser("ln15")).toBe(["ln", "15"]);
});

test("can parse functions with brackets", () => {
  expect(parser("ln(15) + 12")).toBe(["ln", "(", "15", ")", "+", "12"]);
});
