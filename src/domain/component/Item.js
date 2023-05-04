import {Component} from "./Component.js";
import {Attribute} from "./Attribute.js";
import {AttributeExistsError} from "../../error/AttributeExistsError.js";
import {AttributeUnknownError} from "../../error/AttributeUnknownError.js";

export class Item extends Component {
    #templateName = "";
    #price = 0;
    #attributes = [];

    constructor(templateName) {
        super("", "");
        super.className = this.constructor.name;
        if (typeof (templateName) !== "string") throw new TypeError("String expected.");
        this.#templateName = templateName;
        // --- Mandatory attributes ---
        this.addAttribute(new Attribute("Antal", "number", 0));
        this.addAttribute(new Attribute("Tilgængelig", "number", 0));

    }

    toString() {
        let txt = "--- Item ---\n";
        txt += "Template: " + this.#templateName + "\n";
        txt += super.toString() + "\n";
        txt += "Price: " + this.#price + "\n";
        txt += "- Attributes -\n";
        for (let att of this.#attributes) txt += att.toString() + "\n";
        return "\n" + txt;
    }

    /**
     * Transforms instance of this class to JSON object.
     * Invoked when calling JSON.stringfy() on an instance of this class.
     * Note:
     * When calling JSON.stringify() on return value of this method,
     * the toJSON() method of instances of Attributes will automatically be invoked.
     * @return {*}
     */
    toJSON() {
        // Add properties of super class.
        return {...super.toJSON(),
            templateName: this.#templateName,
            price: this.#price,
            attributes: this.#attributes.map(a => a.toJSON())
        };
    }

    /**
     * Returns name of templateName that instance is based on (if any).
     * @return {string}
     */
    get templateName() {
        return this.#templateName;
    }

    get price() {
        return this.#price;
    }

    set price(value) {
        if (typeof (value) !== "number") throw new TypeError("Number expected.");
        this.#price = value;
    }

    /**
     * Checks if attribute exists.
     * @param name
     * @return {boolean}
     */
    isAttribute(name) {
        if (typeof (name) !== "string") throw new TypeError("String expected.");
        for (let att of this.#attributes) {
            if (att.name.toLowerCase() === name.toLowerCase()) return true;
        }
        return false;
    }

    /**
     * Returns array with all attribute objects.
     * @return {*}
     */
    getAttributes() {
        return [...this.#attributes];
    }

    /**
     * Adds attribute.
     * Name of attribute must be unique,
     * @param attribute
     */
    addAttribute(attribute) {
        if (!(attribute instanceof Attribute)) throw new TypeError("Attribute type expected.");
        this.#attributes.forEach((elm) => {
            if (elm.name.toLowerCase() === attribute.name.toLowerCase())
                throw new AttributeExistsError("Name of atttribute must be unique. Passed: " + elm.name);
        });

        this.#attributes.push(attribute);
    }

    /**
     *
     * @param attribute
     */
    removeAttribute(attribute) {
        if (!(attribute instanceof Attribute)) throw new TypeError("Attribute type expected.");
        let i = this.#attributes.indexOf(attribute);
        if (i !== -1) this.#attributes.splice(i, 1);
    }

    setAttributeValue(attributeName, value) {
        let found = false;
        for (let i = 0; i < this.#attributes.length && !found; i++) {
            if (this.#attributes[i].name.toLowerCase() === attributeName.toLowerCase()) {
                found = true;
                this.#attributes[i].value = value;
            }
        }
        if (!found) throw new AttributeUnknownError("Unrecognized attribute (" + attributeName + ").");
    }

    /*
    * get specifik attrbute on item
    * returns null if attribute dosnt exist
    * */
    getAttribute(attrName) {
        for (const attr of this.#attributes) {
            if ( attr.name === attrName) {
                return attr;
            }
        }
        return null;
    }

}

