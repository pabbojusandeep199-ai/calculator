const screen = document.getElementById("screen");
const historyBox = document.getElementById("history");
const buttons = document.querySelectorAll(".buttons button");
const themeBtn = document.getElementById("themeBtn");

let expression = "";
let resultShown = false;

function updateScreen(value = expression) {
  screen.textContent = value || "0";
}

function cleanExpression(exp) {
  return exp
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/−/g, "-")
    .replace(/%/g, "/100");
}

function calculate() {
  try {
    if (expression.trim() === "") return;

    let finalExpression = cleanExpression(expression);
    let result = Function(`"use strict"; return (${finalExpression})`)();

    if (!isFinite(result)) {
      screen.textContent = "Error";
      return;
    }

    result = Number(result.toFixed(10));

    historyBox.textContent = expression + " =";
    screen.textContent = result;
    expression = result.toString();
    resultShown = true;
  } catch {
    screen.textContent = "Invalid";
  }
}

function handleInput(value) {
  if (value === "AC") {
    expression = "";
    historyBox.textContent = "";
    updateScreen();
    return;
  }

  if (value === "DEL") {
    expression = expression.slice(0, -1);
    updateScreen();
    return;
  }

  if (value === "=") {
    calculate();
    return;
  }

  if (resultShown && !isNaN(value)) {
    expression = "";
    historyBox.textContent = "";
  }

  resultShown = false;

  const lastChar = expression.slice(-1);
  const operators = ["+", "−", "×", "÷", "%"];

  if (operators.includes(value) && operators.includes(lastChar)) {
    expression = expression.slice(0, -1) + value;
  } else {
    expression += value;
  }

  updateScreen();
}

buttons.forEach(button => {
  button.addEventListener("click", () => {
    handleInput(button.textContent);
  });
});

document.addEventListener("keydown", (e) => {
  const key = e.key;

  if (!isNaN(key)) handleInput(key);
  if (key === ".") handleInput(".");
  if (key === "+") handleInput("+");
  if (key === "-") handleInput("−");
  if (key === "*") handleInput("×");
  if (key === "/") handleInput("÷");
  if (key === "%") handleInput("%");
  if (key === "Enter") handleInput("=");
  if (key === "Backspace") handleInput("DEL");
  if (key === "Escape") handleInput("AC");
});

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");
  themeBtn.textContent = document.body.classList.contains("light") ? "☀️" : "🌙";
});
