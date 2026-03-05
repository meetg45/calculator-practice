const displayinput = document.querySelector(".display-area input");
const displaybtn = document.querySelectorAll(".buttons-area");

displaybtn.forEach((a) => {
  a.addEventListener("click", handleButtonClick);
});

let expression = "";

function handleButtonClick(e) {
  if (e.target.classList.contains("number")) {
    appendValue(e.target.innerText);
  } else if (e.target.classList.contains("operator")) {
    appendValue(e.target.innerText);
  } else if (e.target.classList.contains("clear")) {
    clearDisplay();
  } else if (e.target.classList.contains("backspace")) {
    backspace();
  } else if (e.target.classList.contains("equal")) {
    calculate();
  }
  displayinput.scrollLeft = displayinput.scrollWidth;
}

function appendValue(value) {
  const operator = "+-*/";
  const lastChar = expression.slice(-1);

  if (value == "(") {
    if (lastChar && (!isNaN(lastChar) || lastChar === ")")) {
      expression += "*(";
    } else {
      expression += "(";
    }
  } else if (operator.includes(value)) {
    if (expression === "") {
      if (value === "-") {
        expression += value;
        updateDisplay();
      }
      return;
    }
    if (operator.includes(lastChar)) {
      if (value === "-") {
        expression += value;
      } else {
        expression = lastChar + value;
      }
    } else {
      expression += value;
    }
  } else {
    expression += value;
  }
  updateDisplay();
}

function updateDisplay() {
  displayinput.value = expression;
}

function clearDisplay() {
  expression = "";
  updateDisplay();
}

function backspace() {
  expression = expression.slice(0, -1);
  updateDisplay();
}

function calculate() {
  try {
    const tokens = tokenize(expression);
    console.log(tokens);
    const postfix = infixToPostfix(tokens);
    console.log(postfix);
    const result = evaluatePostfix(postfix);
    console.log(result);

    expression = result.toString();
    updateDisplay();
  } catch (err) {
    expression = "Error";
    updateDisplay();
  }
}

function tokenize(expression) {
  let myToken = [];
  let currentInput = "";
  let hasDot = false;
  for (let i = 0; i < expression.length; i++) {
    let val = expression[i];

    if (!isNaN(val)) {
      currentInput += val;
    } else if (val == ".") {
      if (hasDot) {
        throw new Error("Invalid Number format");
      }
      if (currentInput === "") {
        currentInput = "0";
      } else if (currentInput === "-") {
        currentInput = "-0";
      }
      currentInput += val;
      hasDot = true;
    } else if ("+-*/".includes(val)) {
      // console.log(currentInput)
      if (val == "-" && (i == 0 || "+-*/(".includes(expression[i - 1]))) {
        if (expression[i + 1] === "(") {
          myToken.push("0");
          myToken.push("-");
        } else {
          currentInput += val;
        }
      } else {
        if (currentInput !== "") {
          if (currentInput.endsWith(".")) {
            currentInput += "0";
          }
          myToken.push(currentInput);
          currentInput = "";
          hasDot = false;
        }
        myToken.push(val);
      }
    } else if ("()".includes(val)) {
      if (currentInput !== "") {
        if (currentInput.endsWith(".")) {
          currentInput += "0";
        }
        myToken.push(currentInput);
        currentInput = "";
        hasDot = false;
      }
      myToken.push(val);
    }
  }
  if (currentInput !== "") {
    if (currentInput.endsWith(".")) {
      currentInput += "0";
    }
    myToken.push(currentInput);
  }
  return myToken;
}

function infixToPostfix(tokens) {
  const output = [];
  const stack = [];

  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i] == "(") {
      stack.push(tokens[i]);
    } else if (tokens[i] == ")") {
      while (stack.length && stack[stack.length - 1] !== "(") {
        output.push(stack.pop());
      }
      stack.pop();
    } else if (!isNaN(tokens[i])) {
      output.push(tokens[i]);
    } else {
      while (
        stack.length > 0 &&
        precedence(stack[stack.length - 1]) >= precedence(tokens[i])
      ) {
        output.push(stack.pop());
      }
      stack.push(tokens[i]);
    }
  }
  while (stack.length > 0) {
    output.push(stack.pop());
  }

  return output;
}

function precedence(op) {
  if (op == "+" || op == "-") {
    return 1;
  }
  if (op == "*" || op == "/") {
    return 2;
  }
  return 0;
}

function evaluatePostfix(postfix) {
  const stack = [];

  for (let i = 0; i < postfix.length; i++) {
    const token = postfix[i];

    if (!isNaN(token)) {
      stack.push(parseFloat(token));
    } else {
      const b = stack.pop();
      const a = stack.pop();
      let result;

      if (token === "+") {
        result = a + b;
      } else if (token === "-") {
        result = a - b;
      } else if (token === "*") {
        result = a * b;
      } else if (token === "/") {
        if (b === 0) throw new Error("Division by zero");
        result = a / b;
      }
      stack.push(result);
    }
  }
  if (stack.length !== 1) {
    throw new Error("Invalid expression");
  }
  return stack[0];
}
