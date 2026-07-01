// @ts-check

( () => {

  // NodeLists
  /** @type {NodeListOf<HTMLElement>} */
  const outputDivs = document.querySelectorAll(".calculator__output");
  /** @type {HTMLElement | null} */
  const mainOutputDiv = document.querySelector(".calculator__output--main");
  /** @type {NodeListOf<HTMLElement>} */
  const operationSpans = document.querySelectorAll(".calculator__operations");
  /** @type {NodeListOf<HTMLElement>} */
  const resultSpans = document.querySelectorAll(".calculator__result");
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
  let lastOperations = "";
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

      if (mainDisplayText.textContent === "") return;

      if (!displayingResult) {
         mainDisplayText.textContent += element.dataset.key;
      } else {
        mainDisplayText.textContent = `${lastResult}${element.dataset.key}`;
        displayingResult = false;
      }

    });
  }));


  // Core functionalities

  keypadActions.forEach(element => {
    element.addEventListener("click", () => {
      switch (element.dataset.key) {
        case "del":
          deleteLastChar();
          break;
        case "ac":
          cleanDisplay();
          break;
        case "lol":
          alert(element.dataset.key);
          break;
        case "ans":
          alert(element.dataset.key);
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

    let input = getInput();
    if (!mainDisplayText || !input || input?.length <= 2) return;
    
    const result = calculateResult(input);
    if (result === "ERROR") {
      setResultNotAllowed();
      return;
    }

    mainDisplayText.textContent = result;

    lastResult = result;
    setDisplayingResultTrue();
  }

  function getInput() {
    if (!mainDisplayText?.textContent) return;
    
    const allowedValues = /^[0-9×÷+.\-]+$/;

    // TODO: Return error when 2 operators displayed together
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

      } else if (nextSubtraction < nextAddition) {

        result = doOperation("subtraction", input[nextSubtraction - 1], input[nextSubtraction + 1]);
        input.splice(nextSubtraction - 1, 3, String(result));
      }


      if (mainDisplayText && result === "ERROR") {
        return "ERROR";
      }
    }

    // TODO: Add Addition and subtraction logic
    // TODO: Display the "result" value at the display
    // TODO: Add logic for the result history 

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

    switch(operationToDo) {
      case "addition": 
        return String((Number(firstVal)) + (Number(secondVal)));
      case "subtraction": 
        return String((Number(firstVal)) - (Number(secondVal)));
      case "product": 
        return String((Number(firstVal)) * (Number(secondVal)));
      case "quotient": 
        if (secondVal === "0") return "ERROR";
        return String((Number(firstVal)) / (Number(secondVal)));
      default:
        return;
    }
  }

  /** @param {string} operation 
   * @param {string} result
  */
  function saveOperation(operation, result) {
    // TODO: Save the operation and the result, and display in the operations history
  }

  // Clen Functions
  function cleanDisplay() {
    cleanOutputs();
    cleanMainOutput();
  }

  function cleanOutputs() {

    operationSpans.forEach(element => element.textContent = "");
    outputDivs.forEach((element) => element.style.visibility = "hidden");
  }

  function cleanMainOutput() {
    if (mainDisplayText && mainOutputDiv) {
      mainOutputDiv.style.visibility = "hidden";
      mainDisplayText.textContent = "";
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
      mainDisplayText.style = "#ffffff";
      mainDisplayText.style.fontWeight = "400";
    }
  }
  
  
  // TODO: when add an operation and result to the oldOutputs, apply a for loop;
  // to check if the [i] element constains a value. If not, add the values 
  // and display it
  
  cleanDisplay();

})();
