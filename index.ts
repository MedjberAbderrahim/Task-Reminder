const inputBar = document.querySelector("#input") as HTMLInputElement
const addButton = document.querySelector("#addButton") as HTMLButtonElement
const taskList = document.querySelector("#taskList") as HTMLDivElement

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms)); // sleep function, similar to the one of C/C++

let tasks: HTMLElement[] = []

if(inputBar === null)
    throw new Error("ERROR! inputBar is null");

if(addButton === null)
    throw new Error("ERROR! addButton is null");

if(taskList === null)
    throw new Error("ERROR! taskList is null");

addButton?.addEventListener("click", (): void => {
    if(inputBar.value === "")
        return
    
    let newTask = document.createElement("div") as HTMLDivElement
    newTask.className = "taskElement"
    
    let newRow = document.createElement("div") as HTMLDivElement
    newRow.textContent = inputBar.value 

    let newRemoveButton = document.createElement("button") as HTMLButtonElement
    newRemoveButton.className = "removeButton"
    newRemoveButton.setAttribute("onclick", "removeTask(this)")

    newTask.append(newRow, newRemoveButton)
    taskList.append(newTask)

    tasks.push(newTask)
    
    inputBar.value = ""
})

async function removeTask(taskElement: HTMLElement): Promise<void>{
    let parentNode = taskElement.parentElement
    if(parentNode === null)
        throw new Error(`${taskElement}.parentNode is null`);

    taskElement.textContent = 'X'

    let rowNode: HTMLElement = parentNode.children[0] as HTMLDivElement
    rowNode.style.textDecoration = "line-through"
    rowNode.style.opacity = "40%"

    taskElement.style.opacity = "40%"

    await sleep(2000)

    tasks.splice(tasks.indexOf(parentNode), 1)
    parentNode.remove()
}