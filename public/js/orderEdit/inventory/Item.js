import {Component} from "./Component.js";
import {Controller} from "../Controller.js";

export class Item extends Component {
    #elms = new Map(); // Holds DOM elms.
    static quantityBounds = {min: 1, max: 999};

    constructor(data) {
        super(data);
    }

    createElement(parentElm) {
        if (!(parentElm instanceof HTMLElement)) throw new TypeError("HTMLElement expected for argument parentElm.");

        // Item
        let elmItem = super.createElement(parentElm); // Appends created elm to parentElm.
        elmItem.className = "item"; // CSS class.
        this.#elms.set("item", elmItem);

        // Item name
        let elmName = document.createElement("div");
        elmItem.appendChild(elmName);
        elmName.className = "itemName";
        elmName.appendChild(document.createTextNode(this._data.name));

        // Lower container
        // Holds attributes and actions elements
        let elmLowerContainer = document.createElement("div");
        elmItem.appendChild(elmLowerContainer);
        elmLowerContainer.className = "lowerContainer";

        // Dynamic attributes
        if (Array.isArray(this._data.attributes) && this._data.attributes.length !== 0) {
            let elmAttributes = this.#createAttributes(this._data.attributes);
            elmLowerContainer.appendChild(elmAttributes);
        }

        // --- Actions ----
        let elmActions = document.createElement("div");
        elmLowerContainer.appendChild(elmActions);
        elmActions.className = "actions";

        // Input number
        let elmNumber = document.createElement("input");
        elmActions.appendChild(elmNumber);
        this.#elms.set("number", elmNumber);
        elmNumber.className = "addNumber";
        elmNumber.type = "number";
        elmNumber.value = Item.quantityBounds["min"].toString(); // Default value.
        elmNumber.min = Item.quantityBounds["min"].toString(); // Only affects spindle.
        elmNumber.max = Item.quantityBounds["max"].toString(); // Only affects spindle.
        elmNumber.step = "1";

        // Button
        let elmButton = document.createElement("input");
        elmActions.appendChild(elmButton);
        elmButton.className = "addButton";
        elmButton.type = "button";
        elmButton.value = "+";
        // Add eventListner for click: adds Item to order.
        elmButton.addEventListener("click", (e) => this.#actionAddItemToOrder(e));

        /*
        <input type="number" id="tentacles" name="tentacles"
       min="10" max="100">
        */

        return elmItem;
    }

    /**
     *
     * @param attributes             Array
     * @returns {HTMLDivElement}
     */
    #createAttributes(attributes) {
        // Attributes container
        let elmContainer = document.createElement("div");
        elmContainer.className = "attributesContainer";
        // Attribute
        for (let att of attributes) {
            elmContainer.appendChild(this.#createSingleAttribute(att));
        }
        return elmContainer;
    }

    /**
     *
     * @param att
     */
    #createSingleAttribute(att) {
        // Row
        let elmRow = document.createElement("div");
        elmRow.className = "attributeRow";

        // --- Elements in row ---
        // Name
        let elmName = document.createElement("div");
        elmName.className = "name";
        elmRow.appendChild(elmName);
        let strName = att.name.charAt(0).toUpperCase() + att.name.slice(1) + ":"; // Capitalize first letter.
        elmName.appendChild(document.createTextNode(strName));

        // Value
        let elmValue = document.createElement("div");
        elmValue.className = "value";
        elmRow.appendChild(elmValue);
        elmValue.appendChild(document.createTextNode(att.value));

        // Unit
        let elmUnit = document.createElement("div");
        elmUnit.className = "unit";
        elmRow.appendChild(elmUnit);
        elmUnit.appendChild(document.createTextNode(att.unit));

        return elmRow;
    }

    #actionAddItemToOrder(e) {
        let quantity = parseInt(this.#elms.get("number").value);
        if (Number.isNaN(quantity)) throw new TypeError("Unable to parse quantity to integer.");
        if (quantity < Item.quantityBounds["min"] || quantity > Item.quantityBounds["max"]) {
            alert("Quantity is outside bounds. Operation aborted.");
        }
        else {
            // console.log("Typeof: " + typeof (quantity) + " Quantity: " + quantity);
            Controller.addComponentToOrder(quantity, this._data);
        }
    }


}