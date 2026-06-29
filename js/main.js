// @ts-check

( () => {

  // Global Values;
  let resultsToDisplay = -1;

  // NodeLists
  /** @type {NodeListOf<HTMLElement>} */
  const outputDivs = document.querySelectorAll(".calculator__output");
  const operationSpans = document.querySelectorAll(".calculator__operations");
  const equalSigns = document.querySelectorAll('[data-symbol="equal"]');

  // Nodes
  const mainDisplayText = document.querySelector('[data-result="main"]');
  
  

  // Clen Functions
  function cleanDisplay() {
    cleanOutputs();
    cleanMainOutput();
  }

  function cleanOutputs() {

    operationSpans.forEach(element => element.textContent = "");
    equalSigns.forEach(element => element.textContent = "");
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
