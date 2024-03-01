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
addTaskButton.addEventListener("click", () => {
    if (inputBar.value === "")
        return;
    let newTask = createTask(inputBar.value);
    taskList.append(newTask);
    tasks.push(newTask);
    inputBar.value = "";
    addTaskButton.style.display = "none";
    inputBar.style.display = "none";
    newTaskButton.style.display = "initial";
    timerSelect.style.display = "none";
    hourSelect.style.display = "none";
    minuteSelect.style.display = "none";
    timerSelect.value = "no";
});
function removeTask(taskElement) {
    return __awaiter(this, void 0, void 0, function* () {
        let divNode = taskElement.parentElement;
        let parentNode = divNode.parentElement;
        let rowNode = parentNode.children[0];
        taskElement.textContent = 'X';
        rowNode.style.textDecoration = "line-through";
        rowNode.style.opacity = "40%";
        divNode.style.opacity = "40%";
        yield sleep(2000);
        tasks.splice(tasks.indexOf(parentNode), 1);
        parentNode.remove();
    });
}
function checkTimers() {
    var _a, _b;
    let time = new Date();
    for (const index in tasks) {
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
