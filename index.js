// import {removeTask} from "./background";
const inputBar = document.querySelector("#input");
const newTaskButton = document.querySelector("#newTask");
const addTaskButton = document.querySelector("#addTask");
const taskList = document.querySelector("#taskList");
const timerSelect = document.querySelector("#timerSelect");
const yearSelect = document.querySelector("#yearSelect");
const monthSelect = document.querySelector("#monthSelect");
const daySelect = document.querySelector("#daySelect");
const hourSelect = document.querySelector("#hourSelect");
const minuteSelect = document.querySelector("#minuteSelect");
const notTimerSelectElements = document.querySelectorAll(".notTimerSelect");
let date = new Date();
const months = ["January", "February", "March", "April", "May", "June", "July", "August",
    "September", "October", "November", "December"];
const days = [31, (date.getFullYear() % 4) ? 28 : 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
export let tasks = [];
let keyList = [];
function fillSelect(parentNode, start, end, srcArr, initialText, defaultSelect) {
    if (srcArr != undefined) {
        start = 0;
        end = srcArr.length;
    }
    let newOption;
    if (initialText != undefined) {
        newOption = document.createElement("option");
        newOption.value = initialText;
        newOption.innerText = initialText;
        newOption.disabled = true;
        parentNode.append(newOption);
    }
    for (let i = start; i < end; i++) {
        newOption = document.createElement("option");
        newOption.value = newOption.innerText = (srcArr != undefined) ? srcArr[i] : String(i).padStart(2, '0');
        if (defaultSelect != undefined && i === defaultSelect)
            newOption.selected = true;
        parentNode.append(newOption);
    }
}
fillSelect(yearSelect, date.getFullYear(), date.getFullYear() + 5, undefined, "--YEARS--");
fillSelect(monthSelect, 0, 0, months, "--MONTHS--", date.getMonth());
fillSelect(daySelect, 1, days[date.getMonth()] + 1, undefined, "--DAYS--", date.getDate());
fillSelect(hourSelect, 0, 24, undefined, "--HOURS--", date.getHours());
fillSelect(minuteSelect, 0, 60, undefined, "--MINUTES--", date.getMinutes() + 1);
for (let i = 0; i < localStorage.length; i++) {
    let localStorageKey = localStorage.key(i);
    let newElement = document.createElement("div");
    let localStorageItem;
    if (localStorageKey === null)
        throw new Error(`localStorage.key(${i}) returned null`);
    keyList.push(localStorageKey);
    newElement.className = "taskElement";
    localStorageItem = localStorage.getItem(localStorageKey);
    if (localStorageItem === null)
        throw new Error(`localStorage.getItem(${localStorageKey}) returned null`);
    newElement.innerHTML = localStorageItem;
    tasks.push(newElement);
    taskList.append(newElement);
}
timerSelect.addEventListener("change", () => {
    if (timerSelect.value == "no")
        notTimerSelectElements.forEach((element) => element.style.display = "none");
    else
        notTimerSelectElements.forEach((element) => element.style.display = "initial");
});
yearSelect.addEventListener("change", () => {
    days[1] = (Number(yearSelect.value) % 4) ? 28 : 29;
    monthSelect.dispatchEvent(new Event("change"));
});
monthSelect.addEventListener("change", () => {
    let tmpDate = new Date(`01 ${monthSelect.value}`);
    daySelect.innerHTML = "";
    fillSelect(daySelect, 1, days[tmpDate.getMonth()] + 1, undefined, "--DAYS--", date.getDate());
});
newTaskButton.addEventListener("click", () => {
    inputBar.style.display = addTaskButton.style.display = timerSelect.style.display = "initial";
    newTaskButton.style.display = "none";
});
function createTask(text) {
    let date = new Date();
    let newTask = document.createElement("div");
    let newRow = document.createElement("div");
    let newDiv = document.createElement("div");
    let newSpan = document.createElement("span");
    let newRemoveButton = document.createElement("button");
    if (timerSelect.value == "yes") {
        let enteredTime = new Date(`${daySelect.value} ${monthSelect.value} ${yearSelect.value} ${hourSelect.value}:${minuteSelect.value}`);
        if (enteredTime.getTime() < (date.getTime() + 12e4)) //time must be at least 2 minutes from now
            throw new Error("Invalid Date entered, must be at least 2 minutes (in seconds) from now!");
        newSpan.textContent = `${daySelect.value} ${monthSelect.value} ${yearSelect.value} ${hourSelect.value}:${minuteSelect.value}`;
    }
    else
        newSpan.textContent = "";
    newTask.className = "taskElement";
    newRow.textContent = text;
    newSpan.className = "timeElements";
    newRemoveButton.className = "removeButton";
    newDiv.append(newSpan, newRemoveButton);
    newTask.append(newRow, newDiv);
    return newTask;
}
function addTask(task, precision) {
    taskList.append(task);
    tasks.push(task);
    let newItemKey = Math.floor(Math.random() * Math.pow(10, precision)).toString();
    keyList.push(newItemKey);
    localStorage.setItem(newItemKey, task.innerHTML);
}
addTaskButton.addEventListener("click", () => {
    if (inputBar.value === "")
        return;
    let newTask = createTask(inputBar.value);
    addTask(newTask, 8);
    inputBar.style.display = timerSelect.style.display = addTaskButton.style.display = "none";
    newTaskButton.style.display = "initial";
    inputBar.value = "";
    timerSelect.value = "no";
    notTimerSelectElements.forEach((element) => element.style.display = "none");
    yearSelect.value = String(date.getFullYear());
    monthSelect.value = months[date.getMonth()];
    daySelect.value = String(date.getDate()).padStart(2, '0');
    hourSelect.value = String(date.getHours()).padStart(2, '0');
    minuteSelect.value = String(date.getMinutes() + 1).padStart(2, '0');
    days[1] = (date.getFullYear() % 4) ? 28 : 29;
});
taskList.addEventListener("click", (event) => {
    var _a;
    let target = event.target;
    if (target.tagName === 'BUTTON')
        removeTask((_a = target.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement);
});
