// @ts-check

( () => {

  // Global Values;
  let resultsToDisplay = -1;
  let calculatorInput;

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
  
  // Core functionalities



  // keys Functionality

  keypadValues.forEach(element => {
    element.addEventListener("click", () => {
      
      if (mainDisplayText) mainDisplayText.textContent += element.dataset.key;
      if (mainOutputDiv && mainOutputDiv.style.display === "none") mainOutputDiv.style.display = "block";

    });
  });

  keypadActions.forEach(element => {
    element.addEventListener("click", () => {
      switch (element.dataset.key) {
        case "del":
          alert(element.dataset.key);
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

    while (input.length > 1) {

      const productIndex = input.indexOf("×");
      const divisionIndex = input.indexOf("÷");

      if (productIndex !== -1 || divisionIndex !== -1) { 

        const nextProduct = productIndex !== -1 ? productIndex : Infinity;
        const nextDivision = divisionIndex !== -1 ? divisionIndex : Infinity;
      
        if (nextProduct <= nextDivision) {

          alert(divisionIndex);
          alert(productIndex);
          result = obtainProduct(input[nextProduct - 1], input[nextProduct + 1]);
          input.splice(nextProduct - 1, 3, String(result));

        } else if (nextDivision < nextProduct) {

          alert("huh");
          result = obtainQuotient(input[nextDivision - 1], input[nextDivision + 1]);
          input.splice(divisionIndex - 1, 3, String(result));
        }
      }
    }

    // TODO: Add Addition and subtraction logic
    // TODO: Display the "result" value at the display
    // TODO: Add logic for the result history 

    return input[0];
  }

  /** @param {string} firstValue
   * @param {string} secondValue 
  */
  function obtainProduct(firstValue, secondValue) {
    return String((Number(firstValue)) * (Number(secondValue)));
  }

  /** @param {string} firstValue
   * @param {string} secondValue 
  */
  function obtainQuotient(firstValue, secondValue) {
    return String((Number(firstValue)) / (Number(secondValue)));
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
  
  
  // TODO: when add an operation and result to the oldOutputs, apply a for loop;
  // to check if the [i] element constains a value. If not, add the values 
  // and display it
  
  cleanDisplay();
  

})();
