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
}

/*export*/ async function removeTask(taskElement: HTMLDivElement): Promise<void>{
    let indexOfElement = tasks.indexOf(taskElement)
    if(indexOfElement === -1)
        throw new Error("Element to be deleted not found in tasks array")
    
    let divElement = taskElement.children[1] as HTMLDivElement
    divElement.children[1].textContent = 'X'
    
    let textElement = taskElement.children[0] as HTMLDivElement
    textElement.style.textDecoration = "line-through"
    textElement.style.opacity = divElement.style.opacity = "40%"

    tasks.splice(indexOfElement, 1)

    await sleep(2000)

    localStorage.removeItem(keyList[indexOfElement])
    keyList.splice(indexOfElement, 1)
    taskElement.remove()
}

function checkTimers() {
    let date = new Date()
    
    for (let index = 0; index < tasks.length; index++){
        let spanElement = tasks[index].children[1].children[0] as HTMLSpanElement

        if(spanElement.textContent == "" || spanElement.textContent == null)
            continue

        if(Math.trunc(date.getTime() / 1000) >= Math.trunc(new Date(spanElement.textContent).getTime() / 1000) ){
            let notificationText = tasks[index].children[0].textContent
            let notif

            if(notificationText === null)
                throw new Error("Text for task is null");
            if(Notification.permission === "granted")
                notif = new Notification("Task reminder", {body: notificationText, image: "Images/icon.png"} )
            removeTask(tasks[index] as HTMLDivElement)
            
            
        }
    }
}

setInterval(checkTimers, 1000)