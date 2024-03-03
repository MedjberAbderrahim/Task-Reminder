"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const inputBar = document.querySelector("#input");
const newTaskButton = document.querySelector("#newTask");
const addTaskButton = document.querySelector("#addTask");
const taskList = document.querySelector("#taskList");
const timerSelect = document.querySelector("#timerSelect");
const hourSelect = document.querySelector("#hourSelect");
const minuteSelect = document.querySelector("#minuteSelect");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms)); // sleep function, similar to the one of C/C++
let tasks = [];
let keyList = [];
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
    if (timerSelect.value == "no") {
        hourSelect.style.display = "none";
        minuteSelect.style.display = "none";
    }
    else {
        hourSelect.style.display = "initial";
        minuteSelect.style.display = "initial";
    }
});
newTaskButton.addEventListener("click", () => {
    inputBar.style.display = "initial";
    newTaskButton.style.display = "none";
    addTaskButton.style.display = "initial";
    timerSelect.style.display = "initial";
});
function createTask(text) {
    let newTask = document.createElement("div");
    let newRow = document.createElement("div");
    let newDiv = document.createElement("div");
    let newSpan = document.createElement("span");
    let newRemoveButton = document.createElement("button");
    newTask.className = "taskElement";
    newRow.textContent = text;
    newSpan.className = "timeElements";
    if (timerSelect.value == "yes")
        newSpan.textContent = `${hourSelect.value}:${minuteSelect.value}`;
    else
        newSpan.textContent = "";
    newRemoveButton.className = "removeButton";
    newRemoveButton.setAttribute("onclick", "removeTask(this)");
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
    addTaskButton.style.display = "none";
    newTaskButton.style.display = "initial";
    inputBar.style.display = "none";
    inputBar.value = "";
    timerSelect.style.display = "none";
    timerSelect.value = "no";
    hourSelect.style.display = "none";
    hourSelect.value = "00";
    minuteSelect.style.display = "none";
    minuteSelect.value = "00";
});
function removeTask(taskElement) {
    return __awaiter(this, void 0, void 0, function* () {
        let divNode = taskElement.parentElement;
        let parentNode = divNode.parentElement;
        let rowNode = parentNode.children[0];
        let indexOfElement = tasks.indexOf(parentNode);
        taskElement.textContent = 'X';
        rowNode.style.textDecoration = "line-through";
        rowNode.style.opacity = "40%";
        divNode.style.opacity = "40%";
        tasks.splice(indexOfElement, 1);
        keyList.splice(indexOfElement, 1);
        yield sleep(2000);
        localStorage.removeItem(keyList[indexOfElement]);
        parentNode.remove();
    });
}
function checkTimers() {
    var _a, _b;
    let time = new Date();
    for (let index = 0; index < tasks.length; index++) {
        let spanElement = tasks[index].children[1].children[0];
        if (spanElement.textContent == "")
            continue;
        if (time.getHours() == Number((_a = spanElement.textContent) === null || _a === void 0 ? void 0 : _a.slice(0, 2)) && time.getMinutes() == Number((_b = spanElement.textContent) === null || _b === void 0 ? void 0 : _b.slice(-2))) {
            let alertText = tasks[index].children[0].textContent;
            removeTask(tasks[index].children[1].children[1]);
            alert(`Task is up!\n${alertText}`);
        }
    }
}
setInterval(checkTimers, 1000);
