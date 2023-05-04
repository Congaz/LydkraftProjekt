function createLabel(str) {
    let l = document.createElement('label')
    l.setAttribute("class", "lineLabel");
    l.innerText = str;
    return l;
}


function createButton(butName, className) {
    let bt = document.createElement('button');
    bt.setAttribute("class", className)
    bt.innerText = butName
    return bt;
}

function createHead() {
    let orderLine = document.createElement('div');
    let na = createLabel("Navn");
    let an = createLabel("Antal");
    let pr = createLabel("Pris");

    orderLine.append(na);
    orderLine.append(an);
    orderLine.append(pr);

    return orderLine;
}

function createOrderLine(navn, antal, pris, id) {
    let orderLine = document.createElement('div');
    orderLine.setAttribute("class", "orderline");
    let na = createLabel(navn);
    let an = createLabel(antal);
    let pr = createLabel(pris);
    let addbut = createButton("+", "addBut");
    let removebut = createButton("-", "removeBut");
    let deletebut = createButton("X", "deleteBut");


    // eventListeners
    addbut.addEventListener("click", ()=> {
        orderLine.children[1].innerHTML = Number(orderLine.children[1].innerHTML) + 1;
        calculateTotal()
    })

    removebut.addEventListener("click", ()=> {
        if ( Number(orderLine.children[1].innerHTML) > 0) {
            orderLine.children[1].innerHTML = Number(orderLine.children[1].innerHTML) - 1;
            calculateTotal();
        }
    })

    deletebut.addEventListener("click", () => {
        orderLine.remove();
        calculateTotal();
    })

    orderLine.append(na);
    orderLine.append(an);
    orderLine.append(pr);
    orderLine.append(addbut);
    orderLine.append(removebut);
    orderLine.append(deletebut);

    orderLine.id = id;
    return orderLine;
}

function calculateTotal() {
    let childLineDiv = document.querySelector("#lineDiv").childNodes
    let totalsum = 0;
    for (let i = 1; i < childLineDiv.length; i++) {
        let pris = Number(childLineDiv[i].children[2].innerHTML)
        let antal = Number(childLineDiv[i].children[1].innerHTML)

        totalsum += ( pris*antal );
    }

    document.querySelector(".total").value = totalsum;
}


function toObjs() {
    let childLineDiv = document.querySelector("#lineDiv").childNodes
    let objs = []
    for (let i = 1; i < childLineDiv.length; i++) {
        let obj = {navn:childLineDiv[i].children[0].innerHTML, antal:childLineDiv[i].children[1].innerHTML, pris:childLineDiv[i].children[2].innerHTML};
        objs.push(obj);
    }

    return objs;
}

export class Order {
    #orderDiv;
    #lineDiv;
    #listeTotalPris
    #tilbudsPris

    constructor() {
        this.createOrderDiv();
        this.createHead();
    }

    createOrderLineObj(obj) {
        let ol = createOrderLine(obj.navn, obj.antal, obj.pris);
        this.addline(ol);
    }

    createOrderLine(antal,obj) {
        let ol = createOrderLine(obj.name, antal, obj.price, obj.id);
        this.addline(ol);
        calculateTotal();
    }

    createHead() {
        let head = createHead();
        this.addline(head);
    }

    addline( orderline) {
        if ( !this.contains(orderline.id) ) {
            this.#lineDiv.append(orderline);
        }
    }

    contains(id) {
        for (const line of this.#lineDiv.children) {
            if ( line.id === id ) {
                return true
            }
        }
        return false;
    }

    createOrderDiv() {
        //remove old
        let elm = document.querySelector('#Total');
        if (elm != null) {
            elm.remove();
        }
        // create new
        this.#orderDiv = document.createElement('div');
        this.#orderDiv.setAttribute("id", "orderDiv");

        this.#lineDiv = document.createElement('div');
        this.#lineDiv.setAttribute("id", "lineDiv");
        this.#orderDiv.append(this.#lineDiv);

        let prisDiv = document.createElement('div');
        prisDiv.setAttribute("id", "prisDiv");

        let tolabel = document.createElement("label");
        tolabel.innerText = "Total:";
        tolabel.className = "totalLabels";

        this.#listeTotalPris = document.createElement('input');
        this.#listeTotalPris.setAttribute("class",'ordreIndputs, total')


        let tilabel = document.createElement("label");
        tilabel.innerText = "Tilbud:";
        tilabel.className = "totalLabels";

        this.#tilbudsPris = document.createElement('input');
        this.#tilbudsPris.setAttribute("class",'ordreIndputs, tilbud')

        let createBut =  createButton("Create","createBut");
        createBut.addEventListener('click' ,()=> {
            console.log( toObjs());
        })

        // ----------------------------
        // let totalParentElm = prisDiv;
        let totalParentElm = document.getElementById("footer");
        totalParentElm.append(tolabel);
        totalParentElm.append(this.#listeTotalPris);
        totalParentElm.append(tilabel);
        totalParentElm.append(this.#tilbudsPris);
        totalParentElm.append(createBut);
        // -----------------------------

        this.#orderDiv.append(prisDiv);
    }

    show() {
        let mainDiv = document.querySelector("#main")
        mainDiv.append(this.#orderDiv);
    }
}


/*
let orderClass = new Order();
orderClass.createOrderLine({navn:"Forstærker",pris:100 ,antal:1 });
orderClass.createOrderLine({navn:"Lampe",pris:1000 ,antal:1 });
orderClass.createOrderLine({navn:"Tæppe",pris:10 ,antal:1 });


orderClass.show();
calculateTotal();
*/

// console.log( toObjs() );
