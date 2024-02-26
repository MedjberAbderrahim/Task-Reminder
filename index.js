"use strict";
const inputBar = document.querySelector("#input");
const addButton = document.querySelector("#addButton");
const taskList = document.querySelector("#taskList");
if (inputBar === null)
    console.error("ERROR! inputBar is null");
if (addButton === null)
    console.error("ERROR! addButton is null");
if (inputBar === null)
    console.error("ERROR! taskList is null");
addButton === null || addButton === void 0 ? void 0 : addButton.addEventListener("click", () => {
    if (inputBar.value === "")
        return;
    let newTr = document.createElement("tr");
    let newTd = document.createElement("td");
    newTd.textContent = inputBar.value;
    inputBar.value = "";
    newTr.append(newTd);
    taskList.append(newTr);
});
