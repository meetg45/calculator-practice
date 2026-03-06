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
  } else if (e.target.classList.contains("factorial")) {
    appendValue(e.target.innerText);
  } else if (e.target.classList.contains("mod")) {
    appendValue(e.target.innerText);
  } else if (e.target.classList.contains("trigo")) {
    appendValue(e.target.innerText);
  } else if (e.target.classList.contains("sqrt")) {
    appendValue("sqrt");
  } else if (e.target.classList.contains("pi")) {
    appendValue("pi");
  } else if (e.target.classList.contains("x2")) {
    appendValue("^2");
  } else if (e.target.classList.contains("xy")) {
    appendValue("^");
  } else if (e.target.classList.contains("10x")) {
    appendValue("10^(");
  } 
  displayinput.scrollLeft = displayinput.scrollWidth;
}

function appendValue(value) {
  const operator = "+-*/%^";
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
  let displayValue = expression.replaceAll("sqrt", "√").replaceAll("pi", "π").replaceAll("^", "^");

  displayinput.value = displayValue;
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
    } else {
      while (
        stack.length > 0 &&
        precedence(stack[stack.length - 1]) > precedence(tokens[i])
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
    op === "cos"
  ) {
    return 4;
  }
  return 0;
}

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
  return stack[0];
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

const FUNCTION_MAP = {
  sin: (x) => Math.sin((x * Math.PI) / 180),
  cos: (x) => Math.cos((x * Math.PI) / 180),
  tan: (x) => Math.tan((x * Math.PI) / 180),
  log: (x) => Math.log10(x),
  ln: (x) => Math.log(x),
  sqrt: (x) => Math.sqrt(x),
  abs: (x) => Math.abs(x),
};
