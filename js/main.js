const setupButtons = function () {
  const buttonBox = document.querySelector(".buttonbox");
  const numberBox = document.createElement("div");
  numberBox.classList.add("numberbox");
  for (let i = 1; i < 10; i++) {
    const numButton = document.createElement("button");
    numButton.innerText = `${i}`;
    numButton.classList.add("num-btn");
    numButton.classList.add(`butn-${i}`);
    numberBox.appendChild(numButton);
  }
  const numButton = document.createElement("button");
  numButton.innerText = `0`;
  numButton.classList.add("num-btn");
  numButton.classList.add(`butn-0`);
  numberBox.appendChild(numButton);
  buttonBox.appendChild(numberBox);

  const operatorBox = document.createElement('div');
  operatorBox.classList.add("operatorbox");
  const addButton = document.createElement("button");
  addButton.classList.add("operator-btn");
  addButton.classList.add("add-btn");
  addButton.innerText = "+";
  const subtractButton = document.createElement("button");
  subtractButton.classList.add("operator-btn");
  subtractButton.classList.add("subtract-btn");
  subtractButton.innerText = "-";
  const multiplyButton = document.createElement("button");
  multiplyButton.classList.add("operator-btn");
  multiplyButton.classList.add("multiply-btn");
  multiplyButton.innerText = `\u0078`;
  const divideButton = document.createElement("button");
  divideButton.classList.add("operator-btn");
  divideButton.classList.add("divide-btn");
  divideButton.innerText = `\u2052`;
  operatorBox.appendChild(addButton);
  operatorBox.appendChild(subtractButton);
  operatorBox.appendChild(multiplyButton);
  operatorBox.appendChild(divideButton);
  buttonBox.appendChild(operatorBox);
};

setupButtons();
