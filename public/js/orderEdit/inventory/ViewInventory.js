import {Controller} from "../Controller.js";
import {Group} from "./Group.js";
import {Rack} from "./Rack.js";
import {Item} from "./Item.js";
import {UnknownComponentError} from "../../error/UnknownComponentError.js";
import {Component} from "./Component.js";

export class ViewInventory {
    static #palettes; // Color palettes. Multi-array.
    #sidebarElm; // DOM elm. Container for our UI elms (Group, Rack, Item).
    #components = []; // UI components.

    /**
     *
     * @param sidebarId
     */
    constructor(sidebarId) {
        if (typeof (sidebarId) !== "string") throw new TypeError("String expected.");
        this.#sidebarElm = document.getElementById(sidebarId);
        if (this.#sidebarElm === null) {
            throw new ReferenceError("Unable to resolve DOM id to element: " + sidebarId);
        }

        // Create palettes once.
        if (!Array.isArray(ViewInventory.#palettes)) {
            ViewInventory.#palettes = ViewInventory.#createPalettes();
        }
    }

    display() {
        Controller.getInventoryData("all", false)
            .then((dataComponents) => {
                this.#createComponents(dataComponents, this.#sidebarElm);
            })
    }

    /**
     * Closes first-child descendants of passed group.
     * @param group         Options: null (first-level recursion) | Instance of Group.
     * @param exceptGroup   Options: null | This group will not be closed.
     */
    closeGroupDescendants(group = null, exceptGroup = null) {
        let srcA;
        if (group === null) {
            srcA = this.#components;
        }
        else if (group instanceof Group) {
            srcA = group.getComponents();
        }
        else {
            throw new TypeError("Argument group expeted to be istance of Group or null.");
        }

        srcA.forEach((g) => {
            if (g instanceof Group && (exceptGroup === null || exceptGroup !== g)) {
                g.actionCloseGroup();
            }
        });
    }

    /**
     * Called by group component when sub-component data is needed.
     * Creates ui components representing retrieved data.
     * Returns promise.
     * @param group
     * @returns {Promise<*>}
     */
    retrieveGroupData(group) {
        if (!(group instanceof Group)) throw new TypeError("Instance of Group expected.");
        return Controller.getInventoryData(group.id, false)
            .then((dataComponent) => {
                // Note: Fetched dataCmponent is the same as group, but with populated components array.
                console.log("Pre-fetch components length: " + group.getComponents().length);
                this.#createComponents(
                    dataComponent.components, group.getElement("content"), group, group.paletteIdx, group.levelIdx + 1
                );
                console.log("Post-fetch compoents length: " + group.getComponents().length);
            })
    }

    /**
     * Returns array holding colors as hex strings.
     * @param index      If out-of-bounds, last palette item is returned.
     * @returns {*}
     */
    static getPalette(index) {
        if (typeof (index) !== "number") throw new TypeError("Number expected.");
        // If index is out-of-bounds, set it to the last element.
        if (index >= ViewInventory.#palettes.length) index = ViewInventory.#palettes.length - 1;
        return ViewInventory.#palettes[index];
    }

    /**
     * Returns color as hex string.
     * @param paletteIdx        If out-of-bounds, last palette is used.
     * @param colorIdx          If out-of-bounds, last color in palette is returned.
     * @returns {*}
     */
    static getPaletteColor(paletteIdx, colorIdx) {
        if (typeof (paletteIdx) !== "number") throw new TypeError("Argument palettedIdx expected to be of type Number.");
        if (typeof (colorIdx) !== "number") throw new TypeError("Argument colorIdx expected to be of type Number.");
        const palette = ViewInventory.getPalette(paletteIdx); // Returns array with colors as strings (hex).
        // If colorIdx is out-of-bounds, set it to the last element.
        if (colorIdx >= palette.length) colorIdx = palette.length - 1;
        return palette[colorIdx];
    }

    /**
     * Creates color palettes to be used in UI.
     * @returns {string[][]}
     */
    static #createPalettes() {
        // Each palette holds five colors (dark to light) as hex string.
        // PANTONE+ Solid Coated (Photoshop).
        return [
            ["d02c30", "e63f52", "f36279", "fc92a4", "fab6c4"], // Red: Pantone 711 - 707.
            ["ecaa00", "ffc72a", "ffd141", "fed857", "fedb65"], // Yellow: Pantone 124 - 120.
            ["0081bc", "0094ca", "00add8", "4bc1e1", "88d2e7"], // Blue: Pantone 640 - 636.
            ["009579", "00a888", "30d9c4", "88e2d2", "a5e6da"], // Green: Pantone 334, Pantone Green, 333 - 331.
            ["9c6268", "b17c81", "cda2a6", "dcb8bc", "e0c2c3"], // Brown: Pantone 4995, 5005, 5015, 5025, 5035
            ["4c868f", "7da8ae", "92b7bc", "abc6ca", "b6ced1"], // Dusty green: Pantone 5483 - 5523.
            ["c018a2", "cc28b0", "e280d2", "e89cdb", "eeb8e4"], // Purple: Pantone 247 - 243.
            ["008996", "0099a9", "20cbd4", "85dadf", "b0e3e4"], // Cyan: Pantone 321 - 317.
        ];
    }

    /**
     *
     * parentCmp options:
     * null         Created components will be added to this.#components array.
     * parentCmp    Created components will be added to parentCmp as sub-components.
     *
     * @param dataComponents    JSON array containing components.
     * @param parentElm         HTMLElement. Created UI elms will be added to this element.
     * @param parentCmp         Options: null | Instance of Group or Rack.
     * @param paletteIdx        Number defining color palette. Starts at zero.
     * @param levelIdx          Number defining recursion level. Starts at zero.
     */
    #createComponents(dataComponents, parentElm, parentCmp = null, paletteIdx = 0, levelIdx = 0) {
        if (!Array.isArray(dataComponents)) {
            throw new TypeError("Array expected for argument: dataComponents. Passed: " + typeof(dataComponents));
        }
        if (!(parentElm instanceof HTMLElement)) throw new TypeError("HTMLElement expected for argument: parentElm.");
        if (parentCmp !== null && !(parentCmp instanceof Component)) {
            throw new TypeError("Instance of Component expected for argument: parentCmp.");
        }
        if (typeof (paletteIdx) !== "number") throw new TypeError("Number expected for argument: paletteIdx.");
        if (typeof (levelIdx) !== "number") throw new TypeError("Number expected for argument: levelIdx.");

        // Iterate through dataComponents array and create components as applicable.
        for (let dataCmp of dataComponents) {
            let cmp, elm;
            switch (dataCmp.className) {
                case "Group":
                    cmp = new Group(dataCmp, this, parentCmp, paletteIdx, levelIdx);
                    elm = cmp.createElement(parentElm); // Returns container element for sub-components.
                    // Check if current dataCmp contains sub-components.
                    if (Array.isArray(dataCmp.components)) {
                        // Recursive callback.
                        this.#createComponents(dataCmp.components, elm, cmp, paletteIdx, levelIdx + 1);
                    }
                    break;
                case "Rack":
                    // NOTE: RACK IS NOT FULLY IMPLEMENTED!
                    cmp = new Rack(dataCmp);
                    // Check if current dataCmp contains items.
                    if (Array.isArray(dataCmp.items)) {
                        // Recursive callback.
                        this.#createComponents(dataCmp.items, elm, cmp, paletteIdx, levelIdx);
                    }
                    break;
                case "Item":
                    cmp = new Item(dataCmp);
                    elm = cmp.createElement(parentElm); // Returns item element.
                    break;
                default:
                    throw new UnknownComponentError("Urecognized component class name: " + dataCmp.className);
            }

            // Add created component to this.#components or passed parentCmp.
            switch (true) {
                case (parentCmp === null):
                    this.#components.push(cmp);
                    // If created cmp is instanceof Group, advance paletteIdx for next iteration.
                    if (cmp instanceof Group) paletteIdx++;
                    break;
                case (parentCmp instanceof Group):
                    parentCmp.addComponent(cmp);
                    break;
                case (parentCmp instanceof Rack):
                    parentCmp.addItem(cmp);
                    break;
                default:
                    new UnknownComponentError("Urecognized parentCmp class: " + parentCmp.constructor.name);
            }
        }
    }


}