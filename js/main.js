// @ts-check

( () => {

  // Global Values;
  let resultsToDisplay = -1;
  let calculatorInput;

  // NodeLists
  /** @type {NodeListOf<HTMLElement>} */
  const outputDivs = document.querySelectorAll(".calculator__output");
  const operationSpans = document.querySelectorAll(".calculator__operations");
  const resultSpans = document.querySelectorAll(".calculator__result");
  const keypadValues = document.querySelectorAll
  (".calculator__key--num, .calculator__key--operator");
  const keypadActions = document.querySelectorAll(".calculator__key--action");

  // Nodes
  const mainDisplayText = document.querySelector('[data-result="main"]');
  
  // Core functionalities



  // keys Functionality

  keypadValues.forEach(element => {
    element.addEventListener("click", () => {
      
      if (mainDisplayText) mainDisplayText.textContent += element.dataset.key;

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
          calculateResult();
          break;
        default:
          break;
      }

    });
  });

  // Calculate Functions
  function calculateResult() {
    if (!mainDisplayText?.textContent) return;

    const allowedValues = /^[0-9×÷+.\-]+$/;

    if (!allowedValues.test(mainDisplayText.textContent)) {
      mainDisplayText.textContent = "Expression not allowed";
      return;
    }

    const operators = /([×÷+-])/;
    const values = mainDisplayText.textContent.split(operators);

    alert(values);

  }



  /** @param {string} operation 
   * @param {string} result
  */
  function saveOperation(operation, result) {

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
    if (mainDisplayText) mainDisplayText.textContent = "";
  }
  
  
  // TODO: when add an operation and result to the oldOutputs, apply a for loop;
  // to check if the [i] element constains a value. If not, add the values 
  // and display it
  
  cleanDisplay();
  

})();
