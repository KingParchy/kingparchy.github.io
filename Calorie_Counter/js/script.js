// Get the DOM elements
const calorieCounter = document.getElementById("calorie-counter");
const budgetNumberInput = document.getElementById("budget");
const entryDropdown = document.getElementById("entry-dropdown");
const addEntryButton = document.getElementById("add-entry");
const clearButton = document.getElementById("clear");
const output = document.getElementById("output");
let isError = false;

// Function to remove unwanted characters from input string
function cleanInputString(str) {
    const regex = /[+-\s]/g;
    return str.replace(regex, "");
}

// Function to check for invalid input
function isInvalidInput(str) {
    const regex = /\d+e\d+/i;
    return str.match(regex);
}

// Function to add a new entry to the form
function addEntry() {
    const targetInputContainer = document.querySelector(
        `#${entryDropdown.value} .input-container`
    );
    const entryNumber =
        targetInputContainer.querySelectorAll('input[type="text"]').length + 1;
    const HTMLString = `
    <label for="${entryDropdown.value}-${entryNumber}-name">Entry ${entryNumber} Name</label>
    <input type="text" placeholder="Name" id="${entryDropdown.value}-${entryNumber}-name"></input>
    <label for="${entryDropdown.value}-${entryNumber}-calories">Entry ${entryNumber} Calories</label>
    <input type="number" min="0" placeholder="Calories" id="${entryDropdown.value}-${entryNumber}-calories"></input>`;
    targetInputContainer.insertAdjacentHTML("beforeend", HTMLString);
}

// Function to calculate the total calories and display the result
function calculateCalories(e) {
    e.preventDefault();
    isError = false;

    const breakfastNumberInputs = document.querySelectorAll(
        `#breakfast input[type=number]`
    );
    const lunchNumberInputs = document.querySelectorAll(
        `#lunch input[type=number]`
    );
    const dinnerNumberInputs = document.querySelectorAll(
        `#dinner input[type=number]`
    );
    const snacksNumberInputs = document.querySelectorAll(
        `#snacks input[type=number]`
    );
    const exerciseNumberInputs = document.querySelectorAll(
        `#exercise input[type=number]`
    );

    const breakfastCalories = getCaloriesFromInputs(breakfastNumberInputs);
    const lunchCalories = getCaloriesFromInputs(lunchNumberInputs);
    const dinnerCalories = getCaloriesFromInputs(dinnerNumberInputs);
    const snacksCalories = getCaloriesFromInputs(snacksNumberInputs);
    const exerciseCalories = getCaloriesFromInputs(exerciseNumberInputs);
    const budgetCalories = getCaloriesFromInputs([budgetNumberInput]);

    if (isError) {
        return;
    }

    const consumedCalories =
        breakfastCalories + lunchCalories + dinnerCalories + snacksCalories;
    const remainingCalories =
        budgetCalories - consumedCalories + exerciseCalories;
    const surplusOrDeficit = remainingCalories < 0 ? "Surplus" : "Deficit";
    output.innerHTML = `<span class="${surplusOrDeficit.toLowerCase()}">${Math.abs(
        remainingCalories
    )} Calorie ${surplusOrDeficit}</span>
    <hr>
    <p>${budgetCalories} Calories Budgeted</p>
    <p>${consumedCalories} Calories Consumed</p>
    <p>${exerciseCalories} Calories Burned</p>    
    `;

    output.classList.remove("hide");
}

// Function to get the total calories from an array of input elements
function getCaloriesFromInputs(list) {
    let calories = 0;

    for (let i = 0; i < list.length; i++) {
        const currVal = cleanInputString(list[i].value);
        const invalidInputMatch = isInvalidInput(currVal);
        if (invalidInputMatch) {
            alert(`Invalid Input: ${invalidInputMatch[0]}`);
            isError = true;
            return null;
        }
        calories += Number(currVal);
    }
    return calories;
}

// Function to clear all input fields and reset the output
function clearForm() {
    const inputContainers = Array.from(
        document.querySelectorAll(".input-container")
    );

    for (let i = 0; i < inputContainers.length; i++) {
        inputContainers[i].innerHTML = "";
    }

    budgetNumberInput.value = "";
    output.innerText = "";
    output.classList.add("hide");
}

// Add event listeners to the add entry button, the form submission, and the clear button
addEntryButton.addEventListener("click", addEntry);
calorieCounter.addEventListener("submit", calculateCalories);
clearButton.addEventListener("click", clearForm);
