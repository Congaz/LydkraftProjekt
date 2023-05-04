import {EmptyStringError} from "../../error/EmptyStringError.js";

export class Attribute {
    #name = "";
    #type = "";
    #value = null; // Mixed.
    #unit = ""; // F.eks. meter, centimeter el. lgn.
    #options = []; // Tænkt som enum for value.

    constructor(name, type, value = null, options = [], unit = "") {
        if (typeof (name) !== "string") throw new TypeError("String expected");
        if (name.length === 0) throw new EmptyStringError("Name argument may not be empty.");
        if (typeof (type) !== "string") throw new TypeError("String expected");
        if (value !== null && type !== typeof (value))
            throw new TypeError("Incomaptible type (" + typeof (value) + "). Expected: " + type);
        if (!Array.isArray(options)) throw new TypeError("Array expected.");
        if (typeof (unit) !== "string") throw new TypeError("String expected");

        this.#name = name;
        this.#type = type;
        this.#unit = unit;
        this.#value = value;
        this.#options = options;
    }

    toString() {
        let txt = "Name: " + this.#name;
        txt += " Type: " + this.#type;
        txt += " Value: " + this.#value;
        txt += " Unit: " + this.#unit;
        txt += " Options: " + this.#options;
        return txt;
    }

    /**
     * Transforms instance of this class to JSON object.
     * @return {*}
     */
    toJSON() {
        return {
            name: this.#name,
            type: this.#type,
            value: this.#value,
            unit: this.#unit,
            options: this.#options
        };
    }

    get name() {
        return this.#name;
    }

    set name(value) {
        if (typeof (name) !== "string") throw new TypeError("String expected");
        this.#name = value;
    }

    get type() {
        return this.#type;
    }

    set type(type) {
        if (typeof (type) !== "string") throw new TypeError("String expected");
        this.#type = type;
    }

    get value() {
        return this.#value;
    }

    set value(value) {
        if (value !== null && this.#type !== typeof (value))
            throw new TypeError("Incomaptible type (" + typeof (value) + "). Expected: " + this.#type);
        // Validate against options (if populated).
        if (this.#options.length !== 0) {
            let valid = false;
            for (let i = 0; i < this.#options.length && !valid; i++) {
                if (value.toLowerCase() === this.#options[i].toLowerCase()) valid = true;
            }

            if (!valid) throw new ReferenceError("Unrecognized value (" + value + ").");
        }
        this.#value = value;
    }

    get options() {
        return this.#options;
    }

    set options(value) {
        if (!Array.isArray(value)) throw new TypeError("Array expected.");
        this.#options = value;
    }

    get unit() {
        return this.#unit
    }

}