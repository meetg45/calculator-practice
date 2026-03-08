const displayinput = document.querySelector(".display-area input");
const displaybtn = document.querySelectorAll(".buttons-area");
const FUNCTIONS = ["sin", "cos", "tan", "log", "ln", "sqrt", "abs"];
const CONSTANTS = {
  pi: Math.PI,
  e: Math.E,
};
displaybtn.forEach((a) => {
  a.addEventListener("click", handleButtonClick);
});

let expression = "";
let lastAnswer = "";
let isResult = false;
let isDeg = true;
let historyList = [];

function handleButtonClick(e) {
  if (e.target.classList.contains("number")) {
    appendValue(e.target.innerText);
  } else if (e.target.classList.contains("operator")) {
    appendValue(e.target.innerText);
  } else if (e.target.classList.contains("openBracket")) {
    appendValue("(");
  } else if (e.target.classList.contains("closeBracket")) {
    appendValue(")");
  } else if (e.target.classList.contains("clear")) {
    clearDisplay();
  } else if (e.target.classList.contains("backspace")) {
    backspace();
  } else if (e.target.classList.contains("equal")) {
    calculate();
  } else if (e.target.classList.contains("factorial")) {
    appendValue(e.target.innerText);
  } else if (e.target.classList.contains("mod")) {
    appendValue(e.target.innerText);
  } else if (e.target.classList.contains("trigo")) {
    appendValue(e.target.innerText + "(");
  } else if (e.target.classList.contains("inverse")) {
    if (expression !== "") {
      expression = "1/(" + expression + ")";
      updateDisplay();
    }
  } else if (e.target.classList.contains("sqrt")) {
    appendValue("sqrt(");
  } else if (e.target.classList.contains("pi")) {
    appendValue("pi");
  } else if (e.target.classList.contains("x2")) {
    if (expression !== "") {
      appendValue("^2");
    }
  } else if (e.target.classList.contains("xy")) {
    if (expression !== "") {
      appendValue("^");
    }
  } else if (e.target.classList.contains("10x")) {
    appendValue("10^");
  } else if (e.target.classList.contains("log")) {
    appendValue("log(");
  } else if (e.target.classList.contains("ln")) {
    appendValue("ln(");
  } else if (e.target.classList.contains("euler")) {
    appendValue(e.target.innerText);
  } else if (e.target.classList.contains("ANS")) {
    if (lastAnswer !== "") {
      if (isResult === true) {
        expression = "";
        isResult = false;
      }
      appendValue(lastAnswer);
    }
  } else if (e.target.classList.contains("deg")) {
    isDeg = !isDeg;
    e.target.innerHTML = isDeg ? "DEG <sub>RAD</sub>" : "RAD <sub>DEG</sub>";
    document.getElementById("modeLabel").textContent = isDeg ? "DEG" : "RAD";
  }
  displayinput.scrollLeft = displayinput.scrollWidth;
}

function appendValue(value) {
  const operator = "+-*/%^";
  const lastChar = expression.slice(-1);
  const secondLastChar = expression.slice(-2, -1);

  if (value === "00" || value === "0") {
    if (
      expression === "" ||
      (lastChar === "0" && operator.includes(secondLastChar)) ||
      (lastChar === "0" && expression.length === 1)
    ) {
      return;
    }
  }
  if (isResult) {
    if (!isNaN(value) && value !== " ") {
      expression = "";
    }
    isResult = false;
  } 

  if (value == "(") {
    if (
      (lastChar && (!isNaN(lastChar) || lastChar === ")")) ||
      (lastChar === "i" && secondLastChar === "p")
    ) {
      if (lastChar === "2" && secondLastChar === "^") {
        return;
      } else {
        expression += "*(";
      }
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
      if (value === "-" && lastChar !== "-") {
        expression += value;
      } else {
        if (operator.includes(secondLastChar)) {
          expression = expression.slice(0, -2) + value;
        } else {
          expression = expression.slice(0, -1) + value;
        }
      }
    } else {
      expression += value;
    }
  } else {
    // auto * before functions
    if (
      FUNCTIONS.some((f) => value.startsWith(f)) &&
      expression !== "" &&
      (!isNaN(lastChar) || lastChar === ")")
    ) {
      expression += "*";
    }
    // auto * before pi
    if (
      value === "pi" &&
      expression !== "" &&
      (!isNaN(lastChar) || lastChar === ")")
    ) {
      expression += "*";
    }
    // auto * before e
    if (
      value === "e" &&
      expression !== "" &&
      (!isNaN(lastChar) || lastChar === ")")
    ) {
      expression += "*";
    }
    // auto * after pi when number pressed
    if (!isNaN(value) && lastChar === "i" && secondLastChar === "p") {
      expression += "*";
    }
    // auto * after e when number pressed ✅
    if (!isNaN(value) && lastChar === "e") {
      expression += "*";
    }
    if (
      value === "10^" &&
      expression !== "" &&
      (!isNaN(lastChar) || lastChar === ")")
    ) {
      expression += "*";
    }

    if (!isNaN(value) && value !== " " && lastChar === ")") {
      expression += "*";
    }
    expression += value;
  }
  updateDisplay();
}

function updateDisplay() {
  let displayValue = expression
    .replaceAll("sqrt", "√")
    .replaceAll("pi", "π")
    .replaceAll("^", "^");

  displayinput.value = displayValue;
}

function clearDisplay() {
  expression = "";
  updateDisplay();
}

function backspace() {
  if (expression.endsWith("sqrt")) {
    expression = expression.slice(0, -4);
  } else if (expression.endsWith("sin")) {
    expression = expression.slice(0, -3);
  } else if (expression.endsWith("cos")) {
    expression = expression.slice(0, -3);
  } else if (expression.endsWith("tan")) {
    expression = expression.slice(0, -3);
  } else if (expression.endsWith("log")) {
    expression = expression.slice(0, -3);
  } else if (expression.endsWith("abs")) {
    expression = expression.slice(0, -3);
  } else if (expression.endsWith("ln")) {
    expression = expression.slice(0, -2);
  } else if (expression.endsWith("pi")) {
    expression = expression.slice(0, -2);
  } else {
    expression = expression.slice(0, -1);
  }
  updateDisplay();
}

function calculate() {
  try {
    if (
      expression === "" ||
      (!/\d/.test(expression) &&
        !expression.includes("pi") &&
        !expression.includes("e"))
    ) {
      return;
    }
    const originalExpr = expression;
    const openCount = (expression.match(/\(/g) || []).length;
    const closeCount = (expression.match(/\)/g) || []).length;

    if (closeCount > openCount) {
      throw new Error("Mismatched parentheses");
    }

    for (let i = 0; i < openCount - closeCount; i++) {
      expression += ")";
    }

    const tokens = tokenize(expression);
    console.log(tokens);
    const postfix = infixToPostfix(tokens);
    console.log(postfix);
    const result = evaluatePostfix(postfix);
    console.log(result);

    if (result === Infinity || isNaN(result)) {
      expression = "Error";
      updateDisplay();
      return;
    }
    expression = result.toString();
    lastAnswer = expression;
    isResult = true;
    addToHistory(originalExpr, result);
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
    let foundFunction = false;

    for (const func of FUNCTIONS) {
      if (expression.slice(i, i + func.length) == func) {
        myToken.push(func);
        i += func.length - 1;
        foundFunction = true;
        break;
      }
    }
    if (foundFunction) {
      continue;
    }
    let foundConstant = false;

    for (const key in CONSTANTS) {
      if (expression.slice(i, i + key.length) === key) {
        myToken.push(key);
        i += key.length - 1;
        foundConstant = true;
        break;
      }
    }
    if (foundConstant) {
      continue;
    }
    // if (expression.slice(i, i + 2) === "pi") {
    //   myToken.push("pi");
    //   i += 1;
    //   continue;
    // }

    // if (expression[i] === "e") {
    //   myToken.push("e");
    //   continue;
    // }

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
    } else if ("+-*/!%^".includes(val)) {
      if (
        val == "-" &&
        (i == 0 || "+-*/(^%".includes(expression[i - 1])) &&
        !FUNCTIONS.includes(myToken[myToken.length - 1])
      ) {
        if (expression[i + 1] === "(") {
          myToken.push("0");
          myToken.push("-");
        } else {
          currentInput += val;
          hasDot = false;
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
    } else if (FUNCTIONS.includes(tokens[i])) {
      stack.push(tokens[i]);
    } else if (tokens[i] == ")") {
      while (stack.length && stack[stack.length - 1] !== "(") {
        output.push(stack.pop());
      }
      stack.pop();
      if (stack.length && FUNCTIONS.includes(stack[stack.length - 1])) {
        output.push(stack.pop());
      }
    } else if (!isNaN(tokens[i]) || CONSTANTS[tokens[i]] !== undefined) {
      output.push(tokens[i]);
    } else if (tokens[i] === "!") {
      output.push(tokens[i]);
    } else {
      while (
        stack.length > 0 &&
        precedence(stack[stack.length - 1]) > precedence(tokens[i]) &&
        tokens[i] !== "^"
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
  if (op == "*" || op == "/" || op == "%") {
    return 2;
  }
  if (op === "^") {
    return 3;
  }
  if (
    op === "!" ||
    op === "log" ||
    op === "ln" ||
    op === "sin" ||
    op === "tan" ||
    op === "cos" ||
    op === "sqrt" ||
    op === "abs"
  ) {
    return 4;
  }
  return 0;
}

const FUNCTION_MAP = {
  sin: (x) => Math.sin(isDeg ? (x * Math.PI) / 180 : x),
  cos: (x) => Math.cos(isDeg ? (x * Math.PI) / 180 : x),
  tan: (x) => {
    if (isDeg && x % 90 === 0 && (x / 90) % 2 !== 0) {
      return Infinity;
    }
    return Math.tan(isDeg ? (x * Math.PI) / 180 : x);
  },
  log: (x) => {
    if (x <= 0) {
      throw new Error("log of zero or negative undefined");
    }
    return Math.log10(x);
  },
  ln: (x) => {
    if (x <= 0) {
      throw new Error("ln of zero or negative undefined");
    }
    return Math.log(x);
  },
  sqrt: (x) => {
    if (x < 0) {
      throw new Error("sqrt of negative number undefined");
    }
    return Math.sqrt(x);
  },
  abs: (x) => Math.abs(x),
};

function evaluatePostfix(postfix) {
  const stack = [];

  for (let i = 0; i < postfix.length; i++) {
    const token = postfix[i];

    if (!isNaN(token)) {
      stack.push(parseFloat(token));
    } else if (token === "!") {
      stack.push(factorial(stack.pop()));
    } else if (token === "^") {
      const b = stack.pop();
      const a = stack.pop();
      stack.push(Math.pow(a, b));
    } else if (CONSTANTS[token] !== undefined) {
      stack.push(CONSTANTS[token]);
    } else if (FUNCTION_MAP[token]) {
      const a = stack.pop();
      stack.push(FUNCTION_MAP[token](a));
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
      } else if (token === "%") {
        result = a % b;
      }
      stack.push(result);
    }
  }
  if (stack.length !== 1) {
    throw new Error("Invalid expression");
  }
  return parseFloat(stack[0].toFixed(10));
}

function factorial(n) {
  if (!Number.isInteger(n)) {
    throw new Error("Factorial requires integer");
  }
  if (n < 0) {
    throw new Error("Factorial undefined for negative numbers");
  }
  if (n > 170) {
    throw new Error("Number too large for factorial");
  }
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

function addToHistory(expr, result) {
  historyList.unshift({ expr, result });
  renderHistory();
}

function renderHistory() {
  const historyContainer = document.querySelector(".history-list");
  historyContainer.innerHTML = "";

  historyList.forEach((item) => {
    const div = document.createElement("div");
    div.classList.add("history-item");
    div.innerHTML = `<span>${item.expr}</span> = <strong>${item.result}</strong>`;

    div.addEventListener("click", () => {
      expression = item.result.toString();
      isResult = true;
      updateDisplay();
    });
    historyContainer.appendChild(div);
  });
}

document.querySelector(".clear-history").addEventListener("click", () => {
  historyList = [];
  renderHistory();
});
