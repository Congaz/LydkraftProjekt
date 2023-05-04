import { ViewInventory } from "../orderEdit/inventory/ViewInventory.js"
import {Order} from "./order.js";

export class Controller {
    static #viewInventory;
    static #order


    static main() {
        this.#viewInventory = new ViewInventory("sidebar");
        this.#viewInventory.display();

        this.#order = new Order();
        this.#order.show();
    }

    /**
     *
     * @param quantity
     * @param component     JSON object representation of component.
     */
    static addComponentToOrder(quantity, component) {
        if (typeof(quantity) !== "number") throw new TypeError("Argument quantity expected to be of type Number.");
         if (typeof (component) !== "object" || component?.constructor.name.toLowerCase() !== "object") {
            throw new TypeError("JSON object expected.");
        }

        console.log("Quantity: " + quantity + " Component: " + component);
        this.#order.createOrderLine(quantity, component);

    }

     /**
     * Queries database for inventory data.
     * Example:
     * getInventoryData("all", false)
        .then((data) => {
            console.log("Data: " + data); // Data is a json representation of a component.
        })
      *
     * --- Recursive ---
     * false:   Returned component will only contain first-child descendants.
     * true:    Returned component will contain descendants to the bottom of tree.
     *
     * @param searchId              Options: all (returns array) | [compoent id] (returns component).
     * @param recursive             false: returned component will only contain first-child descendants.
     * @returns {Promise<any>}
     */
    static async getInventoryData(searchId, recursive = false) {
        if (typeof (searchId) !== "string") throw new TypeError("String expected.");
        if (typeof (recursive) !== "boolean") throw new TypeError("Boolean expected.");

        let url = 'http://localhost:7666/inventoryData';
        url += '?searchId=' + encodeURIComponent(searchId);
        url += '&recursive=' + encodeURIComponent(recursive.toString());

        const rsp = await fetch(url, {
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // mode: 'cors' | 'no-cors' |  *cors, same-origin
        // cache: 'no-cache' | *default | no-cache | reload | force-cache | only-if-cached
        // credentials: 'same-origin'

        if (!rsp.ok) {
            throw new Error(rsp.status.toString());
        }
        return rsp.json();
    }


}