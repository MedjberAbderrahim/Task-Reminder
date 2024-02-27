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
const addButton = document.querySelector("#addButton");
const taskList = document.querySelector("#taskList");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms)); // sleep function, similar to the one of C/C++
let tasks = [];
if (inputBar === null)
    throw new Error("ERROR! inputBar is null");
if (addButton === null)
    throw new Error("ERROR! addButton is null");
if (taskList === null)
    throw new Error("ERROR! taskList is null");
addButton === null || addButton === void 0 ? void 0 : addButton.addEventListener("click", () => {
    if (inputBar.value === "")
        return;
    let newTask = document.createElement("div");
    newTask.className = "taskElement";
    let newRow = document.createElement("div");
    newRow.textContent = inputBar.value;
    let newRemoveButton = document.createElement("button");
    newRemoveButton.className = "removeButton";
    newRemoveButton.setAttribute("onclick", "removeTask(this)");
    newTask.append(newRow, newRemoveButton);
    taskList.append(newTask);
    tasks.push(newTask);
    inputBar.value = "";
});
function removeTask(taskElement) {
    return __awaiter(this, void 0, void 0, function* () {
        let parentNode = taskElement.parentElement;
        if (parentNode === null)
            throw new Error(`${taskElement}.parentNode is null`);
        taskElement.textContent = 'X';
        let rowNode = parentNode.children[0];
        rowNode.style.textDecoration = "line-through";
        rowNode.style.opacity = "40%";
        taskElement.style.opacity = "40%";
        yield sleep(2000);
        tasks.splice(tasks.indexOf(parentNode), 1);
        parentNode.remove();
    });
}
