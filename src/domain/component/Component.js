"use strict";

import {ReassignError} from "../../error/ReassignError.js";
import {EmptyStringError} from "../../error/EmptyStringError.js";


export class Component {
    #className = "";
    #id = "";
    #name = "";
    #description = "";

    constructor(name, id) {
        if (typeof (name) !== "string") throw new TypeError("String expected.");
        if (typeof (id) !== "string") throw new TypeError("String expected.");
        this.#id = id;
        this.#name = name;

    }

    toString() {
       let txt = "";
       txt += "\nclassName: " + this.#className;
       txt += "\nid: " + this.#id;
       txt += "\nname: " + this.#name;
       txt += "\ndescription: " + this.#description;
       return txt;
    }

    toJSON() {
        return {...{
            className: this.#className,
            id: this.#id,
            name: this.#name,
            description: this.#description
        }}
    }

    /**
     * Returns boolean defining if passed name matches name of constrcutor used to create this instance.
     * @param name
     * @returns {boolean}
     */
    isClassName(name) {
        return name.toLowerCase() === this.#className.toLowerCase();
    }

    /**
     * Returns name of constructor used when this instance was created.
     * @returns {string}
     */
    get className() {
        return this.#className;
    }

    /**
     * Sets name of constructor used to create this instance.
     * @param name
     */
    set className(name) {
        if (typeof (name) !== "string") throw new TypeError("String expected.");
        if (name.length === 0) throw new EmptyStringError("ClassName argument may not be empty.");
        if (this.#className.length !== 0) throw new ReassignError("Already assigned className may not be changed.");
        this.#className = name;
    }

    get id() {
        return this.#id;
    }

    set id(id) {
        if (typeof (id) !== "string") throw new TypeError("String expected.");
        if (id.length === 0) throw new EmptyStringError("Id argument may not be empty.");
        if (this.#id.length !== 0) throw new ReassignError("Already assigned id may not be changed.");
        this.#id = id;
    }

    get name() {
        return this.#name;
    }

    set name(name) {
        if (typeof (name) !== "string") throw new TypeError("String expected.");
        this.#name = name;
    }

    get description() {
        return this.#description;
    }

    set description(value) {
        if (typeof (value) !== "string") throw new TypeError("String expected.");
        this.#description = value;
    }

}