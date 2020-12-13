var calculator;
if (typeof window != "undefined") {
  window.onload = function () {
    var resultField = document.getElementById("calc-result");
    // Initialize Calculator with tag for output
    calculator = new Calculator(resultField);
    calculator.update();
  };
}
// Calculator with basic operation: addition, subtraction, multiplication and division.
// Also it support clear entry and clear all functions and separate sign digit
function Calculator(resultField) {
  // reference to node for output results and displaying edited value
  this.resultField = resultField;
  // currently edited digit value
  this.editableValue = "";
  // stored second input value for repeating operation on consecutive pressing '='
  this.secondValue = 0;
  // Flag indicating that need input second value
  this.waitForSecontValue = true;
  // stored previously edited value or results of calculation
  this.accumulator = "";
  // chosen operation
  this.operation = "";
  // chosen previous operation
  this.lastOperationWasEqual = false;
  // supported operations
  this.methods = {
    "+": function (x, y) {
      return x + y;
    },
    "-": function (x, y) {
      return x - y;
    },
    "×": function (x, y) {
      return x * y;
    },
    "÷": function (x, y) {
      return x / y;
    }
  };
  this.evaluate = function () {
    var firstValue = parseFloat(this.accumulator);
    if (this.editableValue.length > 0) {
      this.secondValue = parseFloat(this.editableValue);
      this.waitForSecontValue = false;
    }
    if (this.methods.hasOwnProperty(this.operation)) {
      var result = this.methods[this.operation](firstValue, this.secondValue);
      // Prepare to next operation
      this.accumulator = result.toString();
      this.editableValue = "";
      this.resultField.innerText = result.toString();
    } else {
      throw new Error('Invalid operation: ' + this.operation);
    }
  };
  this.update = function () {
    if (this.editableValue.length === 0) {
      // Output result can't be empty
      this.resultField.innerText = "0";
    } else {
      this.resultField.innerText = this.editableValue;
    }
  };
  this.appendDigit = function (digit) {
    // value can contain only one dot symbol
    if (digit === "." && this.editableValue.indexOf(".") !== -1) {
      return;
    }
    // No leading zeros
    if (digit === "0" && (this.editableValue === "0"
      || this.editableValue === "-0")) {
      return;
    }
    // Limit value length to 24 digits
    if (this.editableValue.length >= 24 && !(digit === "+/-" && this.editableValue.startsWith("-"))) {
      return;
    }
    // Negate result number if don't wait for second value input
    if (digit === "+/-" && this.editableValue.length === 0
      && this.lastOperationWasEqual) {
      this.editableValue = this.accumulator;
    }
    // if sign or dot buttons pressed before any digit then add 0 digit
    if (this.editableValue.length === 0
      && (digit === "+/-" || digit === '.')) {
      this.editableValue = "0";
    }
    if (digit === "+/-") {
      // Negation
      if (this.editableValue.startsWith("-")) {
        this.editableValue = this.editableValue.substr(1);
      } else {
        this.editableValue = "-" + this.editableValue;
      }
    } else if (digit !== "." && (this.editableValue === "0"
      || this.editableValue === "-0")) {
      // Replace zero value to first non zero digit
      this.editableValue = this.editableValue.replace("0", digit);
    } else {
      this.editableValue += digit;
    }
    this.update();
  };
  this.cleanEntry = function () {
    this.editableValue = "0";
    this.update();
  };
  this.cleanAll = function () {
    this.editableValue = "0";
    this.accumulator = "";
    this.operation = "";
    this.update();
  };
  this.chooseOperation = function (operation) {
    if (this.editableValue.length === 0 && this.accumulator.length === 0) {
      this.accumulator = "0";
    } else if (this.editableValue.length > 0
      && (this.operation.length === 0 || this.lastOperationWasEqual)) {
      this.accumulator = this.editableValue;
      this.editableValue = "";
      if (operation === "=" && this.lastOperationWasEqual && this.operation.length > 0) {
        this.evaluate();
      }
    } else if (this.editableValue.length > 0 && this.operation.length > 0) {
      // Any operation should evaluate result if values exits in accumulator,
      // editableValue and operation buffer non empty.
      this.evaluate();
    } else if (operation === "=" && this.operation.length > 0
      && !this.waitForSecontValue && this.lastOperationWasEqual) {
      // If it's consecutive pressing to equal then perform evaluation with
      // previously entered second value
      this.evaluate();
    }
    if (operation !== "=") {
      this.operation = operation;
    }
    if (operation !== "=" && this.lastOperationWasEqual) {
      this.waitForSecontValue = true;
    }
    if (operation === "=") {
      this.lastOperationWasEqual = true;
    } else {
      this.lastOperationWasEqual = false;
    }
  };
}
