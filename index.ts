const inputBar = document.querySelector("#input") as HTMLInputElement
const newTaskButton = document.querySelector("#newTask") as HTMLButtonElement
const addTaskButton = document.querySelector("#addTask") as HTMLButtonElement
const taskList = document.querySelector("#taskList") as HTMLDivElement
const timerSelect = document.querySelector("#timerSelect") as HTMLSelectElement
const hourSelect = document.querySelector("#hourSelect") as HTMLSelectElement
const minuteSelect = document.querySelector("#minuteSelect") as HTMLSelectElement

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms)); // sleep function, similar to the one of C/C++

let tasks: HTMLElement[] = []
let keyList: string[] = []

for(let i = 0; i < localStorage.length; i++){
    let localStorageKey = localStorage.key(i)
    let newElement = document.createElement("div") as HTMLDivElement
    let localStorageItem: string | null

    if(localStorageKey === null)
        throw new Error(`localStorage.key(${i}) returned null`);
    
    keyList.push(localStorageKey);

    newElement.className = "taskElement"

    localStorageItem = localStorage.getItem(localStorageKey)
    if(localStorageItem === null)
        throw new Error(`localStorage.getItem(${localStorageKey}) returned null`);
        
    newElement.innerHTML = localStorageItem
    tasks.push(newElement)
    taskList.append(newElement)
}

timerSelect.addEventListener("change", (): void =>{
    if(timerSelect.value == "no"){
        hourSelect.style.display = "none"
        minuteSelect.style.display = "none"
    }
    else{
        hourSelect.style.display = "initial"
        minuteSelect.style.display = "initial"
    }
})

newTaskButton.addEventListener("click", (): void => {
    inputBar.style.display = "initial"
    newTaskButton.style.display = "none"
    addTaskButton.style.display = "initial"
    timerSelect.style.display = "initial"
})

function createTask(text: string): HTMLDivElement {
    let newTask = document.createElement("div") as HTMLDivElement
    let newRow = document.createElement("div") as HTMLDivElement
    let newDiv = document.createElement("div") as HTMLDivElement
    let newSpan = document.createElement("span") as HTMLSpanElement
    let newRemoveButton = document.createElement("button") as HTMLButtonElement

    newTask.className = "taskElement"

    newRow.textContent = text

    newSpan.className = "timeElements"

    if(timerSelect.value == "yes")
        newSpan.textContent = `${hourSelect.value}:${minuteSelect.value}`
    else
        newSpan.textContent = ""

    newRemoveButton.className = "removeButton"
    newRemoveButton.setAttribute("onclick", "removeTask(this)")

    newDiv.append(newSpan, newRemoveButton)

    newTask.append(newRow, newDiv)

    return newTask
}

function addTask(task: HTMLDivElement, precision: number): void {
    taskList.append(task)
    tasks.push(task)

    let newItemKey: string = Math.floor( Math.random() * Math.pow(10, precision) ).toString()
    keyList.push(newItemKey)
    localStorage.setItem(newItemKey, task.innerHTML)
}

addTaskButton.addEventListener("click", (): void => {
    if(inputBar.value === "")
        return

    let newTask = createTask(inputBar.value)
    addTask(newTask, 8)

    addTaskButton.style.display = "none"
    newTaskButton.style.display = "initial"

    inputBar.style.display = "none"
    inputBar.value = ""

    timerSelect.style.display = "none"
    timerSelect.value = "no"

    hourSelect.style.display = "none"
    hourSelect.value = "00"

    minuteSelect.style.display = "none"
    minuteSelect.value = "00"
})

async function removeTask(taskElement: HTMLButtonElement): Promise<void>{
    let divNode = taskElement.parentElement as HTMLDivElement
    let parentNode = divNode.parentElement as HTMLDivElement
    let rowNode = parentNode.children[0] as HTMLDivElement
    let indexOfElement = tasks.indexOf(parentNode)

    taskElement.textContent = 'X'

    rowNode.style.textDecoration = "line-through"
    rowNode.style.opacity = "40%"

    divNode.style.opacity = "40%"
    
    tasks.splice(indexOfElement, 1)
    keyList.splice(indexOfElement, 1)
    
    await sleep(2000)

    localStorage.removeItem(keyList[indexOfElement])
    parentNode.remove()
}

function checkTimers() {
    let time = new Date()

    for (let index = 0; index < tasks.length; index++){
        let spanElement = tasks[index].children[1].children[0] as HTMLSpanElement

        if(spanElement.textContent == "")
            continue

        if(time.getHours() == Number(spanElement.textContent?.slice(0, 2)) && time.getMinutes() == Number(spanElement.textContent?.slice(-2)) ){
            let alertText = tasks[index].children[0].textContent

            removeTask(tasks[index].children[1].children[1] as HTMLButtonElement)
            alert(`Task is up!\n${alertText}`)
        }
    }
}

setInterval(checkTimers, 1000)