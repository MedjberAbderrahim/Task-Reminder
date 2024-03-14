const inputBar = document.querySelector("#input") as HTMLInputElement
const newTaskButton = document.querySelector("#newTask") as HTMLButtonElement
const saveTaskButton = document.querySelector("#saveTask") as HTMLButtonElement
const taskList = document.querySelector("#taskList") as HTMLDivElement
const timerSelect = document.querySelector("#timerSelect") as HTMLSelectElement
const yearSelect = document.querySelector("#yearSelect") as HTMLSelectElement
const monthSelect = document.querySelector("#monthSelect") as HTMLSelectElement
const daySelect = document.querySelector("#daySelect") as HTMLSelectElement
const hourSelect = document.querySelector("#hourSelect") as HTMLSelectElement
const minuteSelect = document.querySelector("#minuteSelect") as HTMLSelectElement
const notTimerSelectElements = document.querySelectorAll(".notTimerSelect") as NodeListOf <HTMLSelectElement>
const notificationAudio = new Audio("Audio/NotificationSound.wav")
const hrElement = document.querySelector("hr") as HTMLHRElement

let date = new Date()

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

const days = [31, (date.getFullYear() % 4) ? 28: 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

let tasks: HTMLDivElement[] = []
let keyList: string[] = []

function fillSelect(parentNode: HTMLSelectElement, start: number, end: number, srcArr?: string[], initialText?: string, defaultSelect?: number): void {
    if(srcArr != undefined){
        start = 0
        end = srcArr.length
    }
    let newOption: HTMLOptionElement

    if(initialText != undefined){
        newOption = document.createElement("option")
        newOption.value = initialText
        newOption.innerText = initialText
        newOption.disabled = true
        parentNode.append(newOption)
    }

    for(let i = start; i < end; i++){
        newOption = document.createElement("option")
        newOption.value = newOption.innerText = (srcArr != undefined) ? srcArr[i]: String(i).padStart(2, '0')

        if(defaultSelect != undefined && i === defaultSelect)
            newOption.selected = true

        parentNode.append(newOption)
    }
}

fillSelect(yearSelect, date.getFullYear(), date.getFullYear() + 10, undefined, "--YEARS--")

fillSelect(monthSelect, 0, 0, months, "--MONTHS--", date.getMonth())

fillSelect(daySelect, 1, days[date.getMonth()] + 1, undefined, "--DAYS--", date.getDate())

fillSelect(hourSelect, 0, 24, undefined, "--HOURS--", date.getHours())

fillSelect(minuteSelect, 0, 60, undefined, "--MINUTES--", (date.getMinutes() + 3) % 60)

if(Notification.permission !== "granted")
    Notification.requestPermission().then( (response): void => {
        if(response !== "granted")
            console.error("Notification permissions not granted");
    })

chrome.storage.sync.get(null).then((response) => {
    for(let key in response){
        let newElement = document.createElement("div") as HTMLDivElement
        newElement.className = "taskElement"

        let data = response[key] as string
        if(data === null)
            throw new Error(`response[key] returned null`);

        newElement.innerHTML = data
        
        keyList.push(key)
        
        tasks.push(newElement)
        taskList.append(newElement)
    }
})

navigator.serviceWorker.controller?.postMessage( {action: "extensionOpened"} )

// when the user clicks elsewhere, already tried onunload and some others
window.onblur =  (): void => navigator.serviceWorker.controller?.postMessage( {action: "extensionClosed"} )

navigator.serviceWorker.addEventListener('message', event => {
    if(!event.data)
        throw new Error("event.data is null");
    
    if(!event.data.key)
        throw new Error("event.data.key is null");
    
    let targetPos = keyList.findIndex((key: string) => key === event.data.key)
    if(targetPos === -1)
        throw new Error(`Couldn't find element with key ${event.data.key}`);
    
    removeTask(tasks[targetPos])
});

timerSelect.addEventListener("change", (): void =>{
    if(timerSelect.value == "no")
        resetUI()
    else{
        hrElement.style.transform = "translateY(0)"
        taskList.style.transform = "translateY(0)"
        notTimerSelectElements.forEach((element) => {
            element.style.opacity = "1"
            element.style.visibility = "visible"
        })
    }
})

yearSelect.addEventListener("change", (): void => {
    days[1] = (Number(yearSelect.value) % 4) ? 28: 29
    monthSelect.dispatchEvent(new Event("change"));
})

monthSelect.addEventListener("change", (): void => {
    let tmpDate = new Date(`01 ${monthSelect.value}`)
    daySelect.innerHTML = ""
    fillSelect(daySelect, 1, days[tmpDate.getMonth()] + 1, undefined, "--DAYS--", date.getDate())
})

newTaskButton.addEventListener("click", (): void => {
    saveTaskButton.style.display = "initial"
    newTaskButton.style.display = "none"
    inputBar.style.opacity = timerSelect.style.opacity = "1"
    inputBar.style.visibility = timerSelect.style.visibility = "visible"
})

function createTask(text: string): HTMLDivElement {
    let date = new Date()
    let newTask = document.createElement("div") as HTMLDivElement
    let newRow = document.createElement("div") as HTMLDivElement
    let newDiv = document.createElement("div") as HTMLDivElement
    let newSpan = document.createElement("span") as HTMLSpanElement
    let newRemoveButton = document.createElement("button") as HTMLButtonElement

    if(timerSelect.value == "yes"){
        let enteredTime = new Date(`${daySelect.value} ${monthSelect.value} ${yearSelect.value} ${hourSelect.value}:${minuteSelect.value}`)
        if(enteredTime.getTime() < (date.getTime() + 12e4) ){
            alert("Invalid Date entered, must be at least 2 minutes (in seconds) from now!")
            throw new Error("Invalid Date entered, must be at least 2 minutes (in seconds) from now!")
        }
        newSpan.textContent = `${daySelect.value} ${monthSelect.value} ${yearSelect.value} ${hourSelect.value}:${minuteSelect.value}`
    }
    else
        newSpan.textContent = ""
    newTask.className = "taskElement"

    newRow.textContent = text

    newSpan.className = "timeElements"

    newRemoveButton.className = "removeButton"

    newDiv.append(newSpan, newRemoveButton)
    newTask.append(newRow, newDiv)

    return newTask
}

async function addTask(task: HTMLDivElement, precision: number): Promise<void> {
    taskList.append(task)
    tasks.push(task)

    let newItemKey: string = Math.floor( Math.random() * Math.pow(10, precision) ).toString()
    keyList.push(newItemKey)
    if(chrome.storage === undefined)
        throw new Error("chrome.storage undefined")

    else{
        let data: Record<string, string>  = {}
        data[newItemKey] = task.innerHTML
        await chrome.storage.sync.set(data)
    }
}

saveTaskButton.addEventListener("click", (): void => {
    if(inputBar.value)
        addTask(createTask(inputBar.value), 8)

    saveTaskButton.style.display = "none"
    newTaskButton.style.display = "initial"
    inputBar.style.opacity = timerSelect.style.opacity = "0"
    setTimeout(() => {
        inputBar.style.visibility = timerSelect.style.visibility = "hidden"
    }, 1000)

    inputBar.value = ""
    timerSelect.value = "no"
    resetUI()

    yearSelect.value = String(date.getFullYear())
    monthSelect.value = months[date.getMonth()]
    daySelect.value = String(date.getDate()).padStart(2, '0')
    hourSelect.value = String(date.getHours()).padStart(2, '0')

    days[1] = (date.getFullYear() % 4) ? 28: 29
})

function resetUI(): void {
    hrElement.style.transform = "translateY(-58px)"
    taskList.style.transform = "translateY(-58px)"
    notTimerSelectElements.forEach((element) => {
        element.style.transitionDuration = "500ms"
        element.style.opacity = "0"
        setTimeout(() => {
            element.style.visibility = "hidden"
        }, 1000)
    })
}

taskList.addEventListener("click", (event): void => {
    let target = event.target as HTMLElement
    if(target.tagName === 'BUTTON')
        removeTask(target.parentElement?.parentElement as HTMLDivElement)
})

async function removeTask(taskElement: HTMLDivElement): Promise<void>{
    let indexOfElement = tasks.indexOf(taskElement)
    if(indexOfElement === -1)
        throw new Error("Element to be deleted not found in tasks array")

    let divElement = taskElement.children[1] as HTMLDivElement
    divElement.children[1].textContent = 'X'

    let textElement = taskElement.children[0] as HTMLDivElement
    if(!textElement.textContent)
        throw new Error("Task's text is empty");

    textElement.style.textDecoration = "line-through"
    textElement.style.opacity = divElement.style.opacity = "40%"

    notificationAudio.play()

    let notif = new Notification("Task is up!", {body: textElement.textContent, icon: "Images/icon.png" })

    setTimeout((): void =>{
        notif.close()
    }, 4000)

    tasks.splice(indexOfElement, 1)
    await chrome.storage.sync.remove(keyList[indexOfElement])
    keyList.splice(indexOfElement, 1)

    setTimeout((): void => {
        taskElement.remove()
    }, 2000)
}
