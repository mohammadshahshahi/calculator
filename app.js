(() => {
  const display = document.querySelector("#display");
  const previous = document.querySelector("#previous");
  const message = document.querySelector("#message");
  let current = "0";
  let stored = null;
  let operator = null;
  let replace = false;

  const render = () => { display.textContent = current; };
  const clear = () => { current = "0"; stored = null; operator = null; replace = false; previous.textContent = ""; message.textContent = ""; render(); };
  const inputNumber = (digit) => {
    message.textContent = "";
    if (replace) { current = digit; replace = false; }
    else if (current === "0") current = digit;
    else if (current.length < 16) current += digit;
    render();
  };
  const chooseOperator = (next) => {
    message.textContent = "";
    if (operator && !replace) calculate();
    stored = Number(current);
    operator = next;
    replace = true;
    previous.textContent = String(stored) + " " + operator;
  };
  const calculate = () => {
    if (operator === null || stored === null) return;
    const a = stored, b = Number(current);
    let result;
    if (operator === "+") result = a + b;
    if (operator === "−") result = a - b;
    if (operator === "×") result = a * b;
    if (operator === "÷") {
      if (b === 0) { message.textContent = "تقسیم بر صفر امکان‌پذیر نیست."; current = "خطا"; stored = null; operator = null; replace = true; render(); previous.textContent = ""; return; }
      result = a / b;
    }
    if (!Number.isFinite(result)) { current = "خطا"; message.textContent = "نتیجه قابل محاسبه نیست."; }
    else current = String(Number(result.toPrecision(12)));
    previous.textContent = a + " " + operator + " " + b + " =";
    stored = null; operator = null; replace = true; render();
  };
  document.querySelector(".keys").addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    if (button.dataset.number !== undefined) inputNumber(button.dataset.number);
    if (button.dataset.operator) chooseOperator(button.dataset.operator);
    switch (button.dataset.action) {
      case "clear": clear(); break;
      case "delete": current = current.length > 1 ? current.slice(0, -1) : "0"; render(); break;
      case "decimal": if (replace) { current = "0."; replace = false; } else if (!current.includes(".")) current += "."; render(); break;
      case "sign": if (current !== "0" && current !== "خطا") current = String(-Number(current)); render(); break;
      case "equals": calculate(); break;
    }
  });
  document.addEventListener("keydown", (event) => {
    if (/^[0-9]$/.test(event.key)) inputNumber(event.key);
    else if (event.key === ".") document.querySelector('[data-action="decimal"]').click();
    else if (event.key === "Enter" || event.key === "=") { event.preventDefault(); calculate(); }
    else if (event.key === "Backspace") document.querySelector('[data-action="delete"]').click();
    else if (event.key === "Escape") clear();
    else if (event.key === "+") chooseOperator("+");
    else if (event.key === "-") chooseOperator("−");
    else if (event.key === "*") chooseOperator("×");
    else if (event.key === "/") { event.preventDefault(); chooseOperator("÷"); }
  });
  render();
})();
