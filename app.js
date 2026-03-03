const displayinput = document.querySelector(".display-area input");
const displaybtn = document.querySelectorAll(".buttons-area");

displaybtn.forEach((a) => {
  a.addEventListener("click", handleButtonClick);
});

// let currentInput = "";
let expression = "";

function handleButtonClick(e) {
  if (e.target.classList.contains("number")) {
    appendValue(e.target.innerText);
  } else if (e.target.classList.contains("operator")) {
    appendValue(e.target.innerText);
  } else if (e.target.classList.contains("equal")) {
    try {
      const tokens = tokenize(expression);
      console.log(tokens);
    } catch (err) {
      displayinput.value = "Error";
    }
  }
  displayinput.scrollLeft = displayinput.scrollWidth;
}

function appendValue(value) {
  expression += value;
  updateDisplay();
}

function updateDisplay() {
  displayinput.value = expression;
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
      if (currentInput == "" || currentInput === "-") {
        currentInput = "0";
      }
      currentInput += val;
      hasDot = true;
    } else if ("+-*/".includes(val)) {
      // console.log(currentInput)
      if (val == "-" && (i == 0 || "+-*/".includes(expression[i - 1]))) {
        currentInput += val;
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

// function appendNumber(number) {
//   if(currentInput=="Error"){
//     currentInput="";
//   }
//   currentInput += number;
//   updateDisplay();
// }

// function appendOperator(op) {
//   if(operator==null){
//     previousInput=currentInput;
//     currentInput="";
//     operator = op;
//     updateDisplay();
//   }else{
//     compute();
//     operator = op;
//     previousInput=currentInput;
//     currentInput="";
//     updateDisplay();
//   }
// }

// function compute(){
//   if (previousInput === "" || currentInput === "" || operator === null) {
//     return ;
//   }
//   const prev = Number(previousInput);
//   const current = Number(currentInput);
//   if(operator=="+"){
//     currentInput=prev+current;
//   }else if(operator=="-"){
//     currentInput=prev-current;
//   }else if(operator=="*"){
//     currentInput=prev*current;
//   }else if(operator=="/"){
//     if (current === 0) {
//       currentInput = "Error";
//       previousInput = "";
//       operator = null;
//       updateDisplay();
//       return;
//     }
//     currentInput=prev/current;
//   }
//   previousInput="";
//   operator=null;
//   updateDisplay();
// }
