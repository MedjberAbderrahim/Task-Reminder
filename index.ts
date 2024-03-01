const inputBar = document.querySelector("#input") as HTMLInputElement
const newTaskButton = document.querySelector("#newTask") as HTMLButtonElement
const addTaskButton = document.querySelector("#addTask") as HTMLButtonElement
const taskList = document.querySelector("#taskList") as HTMLDivElement
const timerSelect = document.querySelector("#timerSelect") as HTMLSelectElement
const hourSelect = document.querySelector("#hourSelect") as HTMLSelectElement
const minuteSelect = document.querySelector("#minuteSelect") as HTMLSelectElement

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms)); // sleep function, similar to the one of C/C++

let tasks: HTMLElement[] = []

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

addTaskButton.addEventListener("click", (): void => {
    if(inputBar.value === "")
        return

    let newTask = createTask(inputBar.value)

    taskList.append(newTask)
    tasks.push(newTask)

    inputBar.value = ""

    addTaskButton.style.display = "none"
    inputBar.style.display = "none"
    newTaskButton.style.display = "initial"
    timerSelect.style.display = "none"
    hourSelect.style.display = "none"
    minuteSelect.style.display = "none"
    timerSelect.value = "no"
})

async function removeTask(taskElement: HTMLButtonElement): Promise<void>{
    let divNode = taskElement.parentElement as HTMLDivElement
    let parentNode = divNode.parentElement as HTMLDivElement
    let rowNode: HTMLElement = parentNode.children[0] as HTMLDivElement

    taskElement.textContent = 'X'

    rowNode.style.textDecoration = "line-through"
    rowNode.style.opacity = "40%"

    divNode.style.opacity = "40%"

    await sleep(2000)

    tasks.splice(tasks.indexOf(parentNode), 1)
    parentNode.remove()
}

function checkTimers() {
    let time = new Date()

    for (const index in tasks){
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