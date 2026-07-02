// @ts-check

( () => {

  // NodeLists
  /** @type {HTMLElement | null} */
  const mainOutputDiv = document.querySelector(".calculator__output--main");
  /** @type {HTMLElement[]} */
  const outputDivs = Array.from(document.querySelectorAll(".calculator__output"));
  /** @type {HTMLElement[]} */
  const operationSpans = Array.from(document.querySelectorAll(".calculator__operations"));
  /** @type {HTMLElement[]} */
  const resultSpans = Array.from(document.querySelectorAll(".calculator__result"));
  /** @type {NodeListOf<HTMLElement>} */
  const keypadNumbers = document.querySelectorAll(".calculator__key--num");
  /** @type {NodeListOf<HTMLElement>} */
  const keypadOperators = document.querySelectorAll(".calculator__key--operator");
  /** @type {NodeListOf<HTMLElement>} */
  const keypadActions = document.querySelectorAll(".calculator__key--action");

  // Nodes
  /** @type {HTMLElement | null} */
  const mainDisplayText = document.querySelector('[data-result="main"]');
  
  // Global Variables
  let lastResult = "";
  /** @type {string[]} */
  let oldOperations = [];
  /** @type {string[]} */
  let oldResults = [];
  let displayingResult = false;



  // keys Functionality

  keypadNumbers.forEach(element => {
    element.addEventListener("click", () => {
      
      if (!mainOutputDiv || !mainDisplayText) return;
      if (displayingResult) {
        cleanMainOutput();
        setWhiteColorText();
      }

      if (mainOutputDiv.style.visibility === "hidden") {
        mainOutputDiv.style.visibility = "visible";
        displayingResult = false;
      } 

      setWhiteColorText();
      mainDisplayText.textContent += element.dataset.key;
    });
  });

  keypadOperators.forEach((element => {
    element.addEventListener("click", () => {

      if (!mainOutputDiv || !mainDisplayText) return;

      if (!isFinite(Number(mainDisplayText.textContent)) && displayingResult) {
        cleanMainOutput()
        setWhiteColorText();
        return;
      }

      if (mainDisplayText.textContent === "" && element.dataset.key !== "-") return;

      setWhiteColorText();
      const currentInput = mainDisplayText.textContent;
      const lastOperator = currentInput.slice(-1);

      if (["+", "-", "×", "÷"].includes(lastOperator)) {
        mainDisplayText.textContent = currentInput.slice(0, -1) + 
          element.dataset.key;
        return;
      }

      if (mainOutputDiv.style.visibility === "hidden") {
        mainOutputDiv.style.visibility = "visible";  
      }

      if (!displayingResult) {
        mainDisplayText.textContent += element.dataset.key;
        return;
      }

      mainDisplayText.textContent = `${lastResult}${element.dataset.key}`;
      displayingResult = false; 
      
    });
  }));


  // Core functionalities

  keypadActions.forEach(element => {
    element.addEventListener("click", () => {
      switch (element.dataset.key) {
        case "del":
          if (displayingResult) cleanMainOutput();
          else deleteLastChar();
          break;
        case "ac":
          cleanDisplay();
          break;
        case "ans":
          recoverLastResult();
          break;
        case "calculate":
          getResult();
          break;
        default:
          break;
      }

    });
  });

  // Calculate Functions
  function getResult() {

    let userInput = getInput();
    if (!mainDisplayText || !userInput || userInput?.length <= 2) return;
    
    const operations = userInput.join("");
    const result = calculateResult(userInput);
    if (result === "ERROR" || result === "NaN") {
      setResultNotAllowed();
      return;
    }

    mainDisplayText.textContent = result;
    setDisplayingResultTrue();

    lastResult = result;
    saveResultAtHistory(operations, result);
  }

  function getInput() {
    if (!mainDisplayText?.textContent) return;
    
    const allowedValues = /^[0-9×÷+.\-]+$/;

    if (!allowedValues.test(mainDisplayText.textContent)) {
      setResultNotAllowed();
      return;
    }

    // Split the displayed values with the operators as limiters.
    // Ex. "-21+40" becomes ["-21","+","40"] 
    const operators = /(?<=.)([×÷+-])/;
    return mainDisplayText.textContent.split(operators).filter(Boolean);   
  }

  /** @param {string[]} cleanInput  */
  function calculateResult(cleanInput) {

    let input = cleanInput;
    let result = "";

    while (input.includes("×") || input.includes("÷")) {
  
      let productIndex = input.indexOf("×");
      let divisionIndex = input.indexOf("÷");

      const nextProduct = productIndex !== -1 ? productIndex : Infinity;
      const nextDivision = divisionIndex !== -1 ? divisionIndex : Infinity;

      if (nextProduct < nextDivision) {
        result = doOperation("product", input[nextProduct - 1], input[nextProduct + 1]);
        input.splice(nextProduct - 1, 3, String(result));

      } else{

        result = doOperation("quotient", input[nextDivision - 1], input[nextDivision + 1]);
        input.splice(nextDivision - 1, 3, String(result));
      }


      if (mainDisplayText && result === "ERROR") {
        return "ERROR";
      }
    }

    while (input.includes("+") || input.includes("-")) {

      let additionIndex = input.indexOf("+");
      let subtractionIndex = input.indexOf("-");

      const nextAddition = additionIndex !== -1 ? additionIndex : Infinity;
      const nextSubtraction = subtractionIndex !== -1 ? subtractionIndex : Infinity;


      if (nextAddition < nextSubtraction) {
        result = doOperation("addition", input[nextAddition - 1], input[nextAddition + 1]);
        input.splice(nextAddition - 1, 3, String(result));

      } else {

        result = doOperation("subtraction", input[nextSubtraction - 1], input[nextSubtraction + 1]);
        input.splice(nextSubtraction - 1, 3, String(result));
      }


      if (mainDisplayText && result === "ERROR") {
        return "ERROR";
      }
    }

    return input[0];
  }

  /** @param {string} operationToDo 
   * @param {string} firstVal
   * @param {string} secondVal 
  */
  function doOperation(operationToDo, firstVal, secondVal) {

    if (firstVal.split(".").length > 2 || secondVal.split(".").length > 2){
      return "ERROR";
    }

    let num1 = Number(firstVal);
    let num2 = Number(secondVal);
    let result;

    switch(operationToDo) {
      case "addition": 
        result = num1 + num2;
        break;
      case "subtraction":  
        result = num1 - num2;
        break;
      case "product": 
        result = num1 * num2;
        break;
      case "quotient": 
        if (secondVal === "0") return "ERROR";
        result = num1 / num2;
        break;
      default:
        return "ERROR";
    }

    return String(Number(result.toFixed(10)))
  }

  /** @param {string} operation 
   * @param {string} result
  */
  function saveResultAtHistory(operation, result) {
    
    oldResults.push(result);
    oldOperations.push(operation);

    if (oldResults.length > resultSpans.length) {
      oldResults.shift();
    } 
    if (oldOperations.length > operationSpans.length) oldOperations.shift();

    outputDivs.forEach((element, index) => {
      if (!oldOperations[index] || !oldResults[index]) return;
      operationSpans[index].textContent = oldOperations[index];
      resultSpans[index].textContent = oldResults[index];
      element.style.visibility = "visible";
    })
  }

  function recoverLastResult() {
    if (!mainOutputDiv || !mainDisplayText || lastResult === "") return;

    mainDisplayText.textContent += lastResult;

  }

  // Clen Functions
  function cleanDisplay() {
    cleanOutputs();
    cleanMainOutput();
  }

  function cleanOutputs() {

    operationSpans.forEach(element => element.textContent = "");
    resultSpans.forEach(element => element.textContent = "");
    outputDivs.forEach((element) => element.style.visibility = "hidden");
    oldOperations.length = 0;
    oldResults.length = 0;
    displayingResult = false;
  }

  function cleanMainOutput() {
    if (mainDisplayText && mainOutputDiv) {
      mainOutputDiv.style.visibility = "hidden";
      mainDisplayText.textContent = "";
      displayingResult = false;
    }
  }

  function deleteLastChar() {

    if (mainDisplayText && mainDisplayText.textContent !== "") {
      mainDisplayText.textContent = mainDisplayText.textContent.slice(0, -1);
    }
  }

  function setDisplayingResultTrue() {
    displayingResult = true;
  }

  function setResultNotAllowed() {
    if (mainDisplayText) {
      mainDisplayText.textContent = "Expression not allowed";
      mainDisplayText.style.color = "#AB003C";
      mainDisplayText.style.fontWeight = "600";
      displayingResult = true;
    }
  }

  function setWhiteColorText() {

    if (mainDisplayText) {
      displayingResult = false;
      mainDisplayText.style.color = "#ffffff";
      mainDisplayText.style.fontWeight = "400";
    }
  }

  cleanDisplay();
})();
