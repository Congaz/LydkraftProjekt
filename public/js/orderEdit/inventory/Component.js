export class Component {
    _data; // JSON object holding data represented by this instance.
    #parentCmp = null; // Holds possible parentCmp of this instance.

    constructor(data, parentCmp = null) {
        if (typeof (data) !== "object" || data?.constructor.name.toLowerCase() !== "object") {
            throw new TypeError("JSON object expected.");
        }
        if (parentCmp !== null && !(parentCmp instanceof Component)) {
            throw new TypeError("parentCmp expected to be of type Component.");
        }

        this._data = {...data}; // Create shallow copy.
        this.#parentCmp = parentCmp;

        // --- Purge sub-components ---
        // We only want _data to represent this instance and not its children.
        if (typeof (this._data.components) !== "undefined" && Array.isArray(this._data.components)) {
            this._data.components = [];
        }
    }

    get parentCmp() {
        return this.#parentCmp;
    }

    get id() {
        return this._data.id;
    }

    createElement(parentElm) {
        if (!(parentElm instanceof HTMLElement)) throw new TypeError("HTMLElement expected for argument parentElm.");
        let elm = document.createElement("div");
        parentElm.appendChild(elm);
        elm.id = this._data.id;
        return elm;
    }

    getDataValue(attributeName) {
        if (typeof(attributeName) !== "string") throw new TypeError("String expected.");
        if (typeof(this._data[attributeName]) !== "undefined") return this._data[attributeName];
        return null;
    }

}