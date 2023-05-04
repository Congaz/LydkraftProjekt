import {Component} from "./Component.js";

export class Rack extends Component {
    #elm; // DOM elm.
    #items = []; // The items this rack encapsulates.

    constructor(data) {
        super(data);
    }

    getItems() {
        return this.#items;
    }

    addItem(itm) {
        if (!(itm instanceof Item)) throw new TypeError("Type Item exepcted.");
        this.#items.push(itm);
    }

    removeItem(itm) {
        if (!(itm instanceof Item)) throw new TypeError("Type Item exepcted.");
        let index = this.#items.indexOf(itm);
        if (index !== -1) this.#items.splice(index, 1);
    }



}