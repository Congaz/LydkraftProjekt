async function getInventoryData(searchId, recursive = false) {
    if (typeof (searchId) !== "string") throw new TypeError("String expected.");
    if (typeof (recursive) !== "boolean") throw new TypeError("Boolean expected.");

    let url = 'http://localhost:7666/inventoryData';
    url += '?searchId=' + encodeURIComponent(searchId);
    url += '&recursive=' + encodeURIComponent(recursive.toString());

    const rsp = await fetch(url, {
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
            'Content-Type': 'application/json'
        }
    });

    // mode: 'cors' | 'no-cors' |  *cors, same-origin
    // cache: 'no-cache' | *default | no-cache | reload | force-cache | only-if-cached
    // credentials: 'same-origin'

    if (!rsp.ok) {
        throw new Error(rsp.status.toString());
    }

    return rsp.json();
}

getInventoryData("all", true)
    .then((data) => parseData(data));


function parseData(components) {
    for (let cmp of components) {
        switch (cmp.className.toLowerCase()) {
            case "group":
                console.log("Group");
                // Check if group contains sub-components
                if (Array.isArray(cmp.components)) {
                    parseData(cmp.components);
                }
                break;
            case "item":
                console.log("Item");
                break;
            default:
                throw new ReferenceError("Unknown class name: " + cmp.className);
        }
    }
}



