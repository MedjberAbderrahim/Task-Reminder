const selfe: ServiceWorkerGlobalScope = (self as unknown) as ServiceWorkerGlobalScope;

let extensionOpened: boolean = false
self.addEventListener("message", (event) => {
    if(!event.data)
        throw new Error("event.data is null");

    extensionOpened = (event.data.action === "extensionOpened")
})

async function background_removeTask(key: string): Promise<void>{
    chrome.storage.sync.remove(key)
}

function checkTimers() {
    let date = new Date()
    
    chrome.storage.sync.get(null).then( (response): void => {
        for(let key in response){
            if(!key)
                throw new Error(`key = ""`);

            if(!response[key])
                throw new Error(`reponse[key] = ""`);
            let time = response[key].split(`<span class="timeElements">`)[1].split(`</span>`)[0]

            if(!time)
                continue

            if(Math.trunc(date.getTime() / 1000) >= Math.trunc(new Date(time).getTime() / 1000) ){
                if(extensionOpened){
                    selfe.clients.matchAll().then(clients => {
                        clients.forEach(client => {
                          client.postMessage({ key: key });
                        });
                    });
                }
                else
                    background_removeTask(key)            
            }
        }
    })
}

setInterval(checkTimers, 1000)