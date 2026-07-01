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
  const keypadValues = document.querySelectorAll
  (".calculator__key--num, .calculator__key--operator");
  /** @type {NodeListOf<HTMLElement>} */
  const keypadActions = document.querySelectorAll(".calculator__key--action");

  // Nodes
  /** @type {HTMLElement | null} */
  const mainDisplayText = document.querySelector('[data-result="main"]');
  



  // keys Functionality

  keypadValues.forEach(element => {
    element.addEventListener("click", () => {
      
      if (mainDisplayText) mainDisplayText.textContent += element.dataset.key;
      if (mainOutputDiv && mainOutputDiv.style.display === "none") mainOutputDiv.style.display = "block";

    });
  });


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
    if (!input || input?.length <= 2) return;
    
    const result = calculateResult(input);
    alert(result);
  }

  function getInput() {
    if (!mainDisplayText?.textContent) return;
    
    const allowedValues = /^[0-9×÷+.\-]+$/;

    // TODO: Return error when 2 operators displayed together
    if (!allowedValues.test(mainDisplayText.textContent)) {
      mainDisplayText.textContent = "Expression not allowed";
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

      } else if (nextDivision < nextProduct) {

        result = doOperation("quotient", input[nextDivision - 1], input[nextDivision + 1]);
        input.splice(nextDivision - 1, 3, String(result));
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


    }

    // TODO: Add Addition and subtraction logic
    // TODO: Display the "result" value at the display
    // TODO: Add logic for the result history 

    return input[0];
  }

  /** @param {string} operationToDo 
   * @param {string} firstValue
   * @param {string} secondValue 
  */
  function doOperation(operationToDo, firstValue, secondValue) {
    
    switch(operationToDo) {
      case "addition": 
        return String((Number(firstValue)) + (Number(secondValue)));
      case "subtraction": 
        return String((Number(firstValue)) - (Number(secondValue)));
      case "product": 
        return String((Number(firstValue)) * (Number(secondValue)));
      case "quotient": 
        return String((Number(firstValue)) / (Number(secondValue)));
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
    outputDivs.forEach((element) => element.style.display = "none");
  }

  function cleanMainOutput() {
    if (mainDisplayText && mainOutputDiv) {
      mainOutputDiv.style.display = "none";
      mainDisplayText.textContent = "";
    }
  }

  function deleteLastChar() {
    if (mainDisplayText && mainDisplayText.textContent !== "") {
      mainDisplayText.textContent = mainDisplayText.textContent.slice(0, -1);
    }
  }
  
  
  // TODO: when add an operation and result to the oldOutputs, apply a for loop;
  // to check if the [i] element constains a value. If not, add the values 
  // and display it
  
  cleanDisplay();
  

})();
