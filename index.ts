const inputBar = document.querySelector("#input") as HTMLInputElement
const addButton = document.querySelector("#addButton")
const taskList = document.querySelector("#taskList") as HTMLTableElement

let tasks: string[] = []

if(inputBar === null)
    console.error("ERROR! inputBar is null");

if(addButton === null)
    console.error("ERROR! addButton is null");

if(inputBar === null)
    console.error("ERROR! taskList is null");

addButton?.addEventListener("click", (): void => {
    if(inputBar.value === "")
        return

    let newTr = document.createElement("tr")
    
    let newTd = document.createElement("td")
    newTd.textContent = inputBar.value
    tasks.push(inputBar.value)

    let newHr = document.createElement("hr")

    inputBar.value = ""

    newTd.append(newHr)
    newTr.append(newTd)
    taskList.append(newTr)
})