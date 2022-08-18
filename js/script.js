let calculator = {
    displayText: 0,
    secondText: [],//This array should aways follow this order(* == optional): [number, operator("+" or "-" or "x" or "÷"), *number2, *"="].
    lastResult: 0,

    sum() {
        let res = parseFloat(this.secondText[0]) + parseFloat(calculator.displayText);
        this.lastResult;
        return  res;
    },

    subtract() {
        let res = (this.secondText[0]) - calculator.displayText;
        this.lastResult = res;
        return res;
    },

    multiplicate() {
        let res = (this.secondText[0]) * calculator.displayText;
        this.lastResult = res; 
        return res;
    },

    divide() {
        let res = (this.secondText[0]) / calculator.displayText;
        res = res.toString();
        res = res.split("");
        
        //This while round the number to have at max 12 characters.
        while (res.length > 12) {
            if (parseFloat(res[res.length - 1]) >= 5) {
                res[res.length -2] = parseFloat(res[res.length -2]) +  1;
            }
                res.pop();
        }

        res = res.join("");
        return res;
    },

    updateScreen(screenObj, secondScreenObj) {
        if (!this.displayText) {
            this.displayText = 0;
        }

        screenObj.innerText = this.displayText;
        secondScreenObj.innerText = this.secondText ? this.secondText.join(" ") : "";
        
    }
};

//Get the <p>'s used to show the information for the user
let mainP = document.getElementById("visor-text"); //Main numbers
let secondP = document.getElementById("visor-mini"); //Operation and numbers above the main numbers

//Functions _________________________________________________________________
let addNumber = (obj) => {
    if (calculator.displayText.length >= 12) {
        console.log("Max length of string reached.")
        return
    }
    else {
        //Clean "secondP" after an operation was completed.
        if (calculator.secondText.length >= 4) {
            calculator.secondText = [];
        }

        if (!calculator.displayText || calculator.displayText == "0") {
            calculator.displayText = obj.innerText;
        } else {
            calculator.displayText += obj.innerText;
        }
        
        calculator.updateScreen(mainP, secondP)

        console.log(`"${obj.innerText}" added to string`)    
    }
}

let addOperator = function(obj) {     
    //Verify  if the function is not been called after other "addOperation()" or a "calculateResult()". 
    if (calculator.displayText.toString() != "") {
        //Verify if "calculator"already have an operator.
        if (calculator.secondText.length == 2) {
            let res = subCalculate(calculator.secondText[1]);
            calculator.secondText[0] = res;
        }
        else {
            calculator.secondText[0] = calculator.displayText;
        }
    }
    //Being called after "calculateResult()".
    else if (calculator.secondText.length == 4) {
        calculator.secondText = [calculator.lastResult];
        calculator.displayText = calculator.lastResult;
    }
    //Being called after other "addOperator()".
    else {
        calculator.displayText = calculator.secondText[0];
    }
    
    calculator.secondText[1] = obj.innerText;
    calculator.updateScreen(mainP, secondP)
    calculator.displayText = "";
    console.log(`Operator "${obj.innerText}" added.`)
}

let clearCalculator = () => {
    calculator.displayText = 0;
    calculator.secondText = [];
    calculator.updateScreen(mainP, secondP)
    console.clear()
    console.log(`Calculator was reset.\nLast result: ${calculator.lastResult}.`)
}

let clearElement = function() {
    if (calculator.displayText == 0) {
        clearCalculator()
        return
    }

    calculator.displayText = 0;
    calculator.updateScreen(mainP, secondP);
    console.log("Main element was cleared.")
}

let popLastChar = function() {
    let text = calculator.displayText.toString()
    text = text.split("");
    let nRemoved = text.pop();
    calculator.displayText = text.join("");
    calculator.updateScreen(mainP, secondP);
    console.log(`"${nRemoved}" popped.`)
}

let invertNumber = function() {
    calculator.displayText *= -1;
    calculator.updateScreen(mainP, secondP)
    console.log("Number inverted.")
}

let makeDecimal = function() {
    let text = calculator.displayText.toString();

    //Verify if the number is a decimal
    if  (text.indexOf(".") == -1) {
        if (calculator.displayText == 0) { 
            calculator.displayText = "0."
        }
        else { 
            calculator.displayText += '.';
        }

        calculator.updateScreen(mainP, secondP)
        console.log("Number is a decimal now.")
    } 
    else{
        console.log("Number already is a decimal.")
    }
}

//Need to comment this cases
let calculateResult = function() {
    try {
        //This switch verify principly if the "calculator" have: an operator(case 0  and 2), an equal sign on last index (case 4).
        switch (calculator.secondText.length) {
            //"Calculator not have an operator"
            case 0: {
                calculator.secondText[0] = calculator.displayText;
                calculator.secondText[1] = "=";
                break;
            }
    
            case 2: {
                //Not have an operator itself ("=" in the place).
                if (calculator.secondText[1] == "="){
                    if (calculator.displayText) {
                        calculator.secondText[0] = calculator.displayText
                    }

                    calculator.displayText = calculator.secondText[0];
                }
                else {
                    //After an "addOperator()".
                    if (calculator.displayText.toString() == "") {
                        calculator.displayText = calculator.secondText[0];
                        calculator.secondText[2] = calculator.secondText[0];
                
                        console.log(calculator)
                
                        calculator.secondText[3] = "=";
                
                        let res = subCalculate(calculator.secondText[1]);
                        calculator.displayText = res;
                    }
                    //Normal case.
                    else {
                        let res = subCalculate(calculator.secondText[1])
    
                        calculator.secondText[2] = calculator.displayText;
                        calculator.secondText[3] = "="
    
                        calculator.displayText = res;
                    }
                }
                break;
            }
    
            case 4: {
                //After other "calculateResult()"
                if (calculator.displayText == "") {
                    calculator.secondText[0] = mainP.innerText;
                    calculator.displayText = calculator.secondText[2];
                    let res = subCalculate(calculator.secondText[1]);

                    calculator.displayText = res;
                }
                break;
            }

            default: {
                throw new Error("Something went wrong to recognize the length of: calculator.seconText")
            }
        }

        calculator.updateScreen(mainP, secondP)
        calculator.displayText = "";
        console.log("Operation executed with success.")
    }

    catch {clearCalculator()}
}

//This function recognize what operation the object "calculator" is supposed to do and return the value of this operation
let subCalculate = (operator) => {
    try {
        let res;
        switch (operator) {
            case "+": {res = calculator.sum(); break}
            case "-": {res = calculator.subtract(); break;}
            case "x": {res = calculator.multiplicate(); break;}
            case "÷": {res = calculator.divide(); break;}
            default: {
                throw new Error("Operator ou range to perform a math operation");
            }
        }
        return res;
    }
    catch {clearCalculator()}
}
//___________________________________________________________________________

//Get the <button>'s to interact
let numbersBtn = document.getElementsByName("number-btn");
let operationBtn = document.getElementsByName("op-btn");
let clearBtn = document.getElementById("clear-btn");
let clearElementBtn = document.getElementById("clear-element-btn");
let backspaceBtn = document.getElementById("bksp-btn");
let invertBtn = document.getElementById("invert-btn");
let decimalBtn = document.getElementById("decimal-btn");
let equalBtn = document.getElementById("eq-btn");

numbersBtn.forEach(button => {
    button.addEventListener("click", function() {
        addNumber(this)
    });
});

operationBtn.forEach(button => {
    button.addEventListener("click", function() {
        addOperator(this)
    });
});

clearBtn.addEventListener("click", clearCalculator);
clearElementBtn.addEventListener("click", clearElement);
backspaceBtn.addEventListener("click", popLastChar);
invertBtn.addEventListener("click", invertNumber);
decimalBtn.addEventListener("click", makeDecimal);
equalBtn.addEventListener("click", calculateResult);

//__________________________________________________________________________

//Key listeners
window.addEventListener("keydown", function(e) {
    switch (e.key) {
        case "Backspace": {popLastChar(); break;}
        case "Control": {clearElement(); break;}
        case "Shift": {invertNumber(); break;}
        case "c": {clearCalculator(); break;}
        case ".": {makeDecimal(); break;}
        case "Enter": {calculateResult(); break;}

        default: {
            //Either addNumber and addOperator expect an object with "innerText" attribute.
            if (!isNaN(e.key)) {
                addNumber(obj = {innerText: e.key})
            } 
            else {
                let param = undefined;

                if (e.key == "*") {param = "x"}
                else if (e.key == "/") {param = "÷"}
                else if (e.key == "-" || e.key == "+") {param = e.key};

                if (param) {addOperator(obj = {innerText: param})}
            }
        }
    }
})
