import {Component} from "./Component.js";
import {Item} from "./Item.js";
import {Rack} from "./Rack.js";

export class Group extends Component {
    #components = [];

    constructor(name, id = "") {
        super(name, id);
        super.className = this.constructor.name;
    }

    toString() {
        let txt = "--- Group ---\n";
        txt += super.toString() + "\n";
        return txt;
    }

    /**
     * Transforms instance of this class to JSON object.
     * Invoked when calling JSON.stringfy() on an instance of this class.
     * Note:
     * When calling JSON.stringify() on return value of this method,
     * the toJSON() method of instances of Components will automatically be invoked.
     * @return {*}
     */
    toJSON() {
        // Add properties of super class to JSON version of this instance.
        // Return shallow copy.
        return {...super.toJSON(),
            components: this.#components
        };
    }

    getComponents() {
        return [...this.#components];
    }

    addComponent(cmp) {
        if (!(cmp instanceof Group) && !(cmp instanceof Rack) && !(cmp instanceof Item))
            throw new TypeError("Instance of Group, Rack or Item expected.");
        this.#components.push(cmp);
    }

    removeComponent(cmp) {
        if (!(cmp instanceof Component)) throw new TypeError("Instance of Component expected.");
        let index = this.#components.indexOf(cmp);
        if (index !== -1) this.#components.slice(index, 1);
    }

    removeAllComponents() {
        this.#components = [];
    }

    /**
     * ONLY FOR DEVELOPMENT USE!
     * Removes sub-compoents from this instance.
     * Simulates non-recursive databse query.
     */
    purgeComponentsInSubGroups() {
        // Iterate through components.
        for (let cmp of this.#components) {
            if (cmp.isClassName("Group")) {
                cmp.removeAllComponents();
            }
        }
    }

}



