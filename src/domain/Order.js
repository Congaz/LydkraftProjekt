import {Component} from "./component/Component.js";
import {Item} from "./component/Item.js";

export class Order {
    #id;
    #name;
    #timestamp;
    #dateStart;
    #dateEnd;
    #userId;

    #items =[];

    //#kundeId;


    constructor(name, timestampCreated, userId, dateStart = null, dateEnd = null, id = "") {
        if (typeof (id) !== "string") throw new TypeError("String expected.");
        if (typeof (name) !== "string") throw new TypeError("String expected.");
        if (typeof (timestampCreated) !== "number") throw new TypeError("Number expected.");
        if (dateStart !== null && typeof (dateStart) !== "number") throw new TypeError("Number expected.");
        if (dateEnd !== null && typeof (dateEnd) !== "number") throw new TypeError("Number expected.");
        if (typeof (userId) !== "string") throw new TypeError("String expected.");


        this.#id = id;
        this.#name = name;
        this.#timestamp = timestampCreated;
        this.#dateStart = dateStart;
        this.#dateEnd = dateEnd;
        this.#userId = userId;

    }
    toString(){
        let txt = "";
        for (let item of this.#items) txt += item.toString() + "\n";
        return "\n" + txt;
    }

    get id() {
        return this.#id;
    }

    getItems(){
        return this.#items;
    }

    addItem(itm) {
      //  if (!itm instanceof Item) throw new TypeError("Type item expected.");
        if (itm instanceof Item === false) throw new TypeError("Type item expected.");
        this.#items.push(itm);
    }

    removeItem(itm) {
        if (!itm instanceof Item) throw new TypeError("Type item expected.");
        let index = this.#items.indexOf(itm);
        if (index !== -1) this.#items.slice(index, 1);
    }




    //TODO udregnPris

}