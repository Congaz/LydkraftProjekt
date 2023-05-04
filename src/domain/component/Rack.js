import {Component} from "./Component.js";
import {Item} from "./Item.js";

export class Rack extends Component {
    #price = 0;
    #items = [];

    constructor(name = "", id = "") {
        super(name, id);
        super.className = this.constructor.name;
    }

    toString() {
        let txt = "--- Rack ---\n";
        txt += super.toString() + "\n";
        txt += "Price: " + this.#price + "\n";
        txt += "Number of items: " + this.#items.length;
        return txt;
    }

    /**
     * Transforms instance of this class to JSON object.
     * Invoked when calling JSON.stringfy() on an instance of this class.
     * Note:
     * When calling JSON.stringify() on return value of this method,
     * the toJSON() method of instances of Items will automatically be invoked.
     * @return {*}
     */
    toJSON() {
        // Add properties of super class to JSON version of this instance.
        return Object.assign(super.toJSON(), {
            price: this.#price,
            items: this.#items
        });
    }

    get price() {
        return this.#price;
    }

    set price(value) {
        if (typeof (value) !== "number") throw new TypeError("Number expected.");
        this.#price = value;
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