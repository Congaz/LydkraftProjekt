const selectTemplate = document.querySelector("#selectTemplate");
const inputUl = document.querySelector('#inpAttributes');
const createBtn = document.querySelector("#createBtn");
//----------------------------------------------------------------------------------------------------------------

selectTemplate.addEventListener("change", handleOnchangeTemplate); // select drop down bar
selectTemplate.addEventListener("change", getSelectedItemName); // itemOverview

//----------------------------------------------------------------------------------------------------------------

function handleOnchangeTemplate(e) {
    //console.log('e.target.value ' + e.target.value); // generisk eller forstærker....
    const types = JSON.parse(document.querySelector("#" + e.target.value).getAttribute("inp"));
    //console.log("TYPES " + JSON.stringify(types));
    const typeObjects = [];
    for (let i = 0; i < types.length; i += 2) {
        typeObjects.push({id: types[i], type: types[i + 1]});
    }
    //console.log('typeObject '+ typeObjects);
    createInputs(types);
}

//[{id:,type:}]
function createInputs(types) {
    inputUl.innerHTML = " ";
    types.forEach(t => {
        //console.log("inputUL.JSON.stringify(t) " + JSON.stringify(t))
        inputUl.innerHTML += `<li>
                                 <label> ${t.name} </label> 
                                 <input id= ${t.name} type = ${t.type === 'string' ? 'text' : 'number'}>  
                              </li>`
    })
}
//-------------------------------------------------------------------------------------------------------------
// when a user click creat button
createBtn.addEventListener("click", showItemOverView);

function getSelectedItemName(e){
    const selectedItem = e.target.value;
    showItemOverView(selectedItem);
}

function showItemOverView(selectedItem){
    const listItemOverView = document.querySelector("#listItemOverview");
    const itemName = document.querySelector("#name");
    const itemValue = itemName.value;

    listItemOverView.innerHTML = '';
    listItemOverView.innerHTML = ` <li>
                                       ${selectedItem}  :  ${itemValue} 
                                   </li>`
}

//---------------------------------------------------------------------------------------------
// to make a item overview
function collectData() {
    const data = Array.from(document.querySelectorAll("input"))
        .reduce((acc, cur) => {
            acc[cur.id] = cur.value;
            return acc;
        }, {});
    //console.log("collected data :  >>" + data)
    return data;
}

// a new window to show an item overview
createBtn.onclick = handleCreate;

function handleCreate() {
    const data = collectData();
    console.log("collected data: >>" + data)

    // handle promise return data!!!!!!!
    post(data)
        .then(data => window.location.href = '/products')// ***redirect this given page as long as the post success
        .catch(e => console.log(e + "post template failed!")) // or give an error message
}

async function post(data) {
    const response = await fetch('http://localhost:7666/products', {
        method: "POST",
        headers: {"content-type": 'application/json'},
        body: JSON.stringify(data)
    })

    if (!response.ok) {
        throw new Error("Post failed!");
    }
}





