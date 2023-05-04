import {Component} from "./Component.js";
import {Controller} from "../Controller.js";
import {ViewInventory} from "./ViewInventory.js";


export class Group extends Component {
    #elms = new Map(); // Holds DOM elms.
    #viewInventory;
    #paletteIdx;
    #levelIdx;
    #transitionInProgress = false; // Defines if display/hide transition of sub-componets is running.
    #components = []; // Sub-components.

    constructor(data, viewInventory, parentCmp = null, paletteIdx = 0, levelIdx = 0) {
        super(data, parentCmp);
        if (!(viewInventory instanceof ViewInventory)) {
            throw new TypeError("Argument viewIventory expected to be instance of ViewInventory.");
        }
        if (typeof (paletteIdx) !== "number") throw new TypeError("Argument paletteIdx expected to be of type number.");
        if (typeof (levelIdx) !== "number") throw new TypeError("Argument levelIdx expected to be of type number.");
        this.#viewInventory = viewInventory;
        this.#paletteIdx = paletteIdx;
        this.#levelIdx = levelIdx;
    }

    get paletteIdx() {
        return this.#paletteIdx;
    }

    get levelIdx() {
        return this.#levelIdx;
    }

    getElement(name) {
        if (typeof (name) !== "string") throw new TypeError("String expected.");
        return this.#elms.get(name);
    }

    getComponents() {
        return [...this.#components]; // Return shallow copy.
    }

    addComponent(cmp) {
        if (!(cmp instanceof Component)) throw new TypeError("Instance of Component expected.");
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

    createElement(parentElm) {
        if (!(parentElm instanceof HTMLElement)) throw new TypeError("HTMLElement expected for argument parentElm.");

        // Group wrapper
        let elmWrapper = super.createElement(parentElm); // Appends created elm to parentElm.
        this.#elms.set("wrapper", elmWrapper);
        elmWrapper.className = "groupWrapper"; // CSS class.

        // Group
        let elmGroup = document.createElement("div");
        this.#elms.set("group", elmGroup);
        elmWrapper.appendChild(elmGroup);
        let levelCssClass = (this.#levelIdx >= 5) ? "infinite" : this.#levelIdx;
        elmGroup.className = "group levelIdx_" + levelCssClass; // CSS class.
        // Set background color by palette and level.
        let hexColor = ViewInventory.getPaletteColor(this.#paletteIdx, this.#levelIdx);
        elmGroup.style.backgroundColor = "#" + hexColor;
        // Add eventListner for click: toggles visibility of group components.
        elmGroup.addEventListener("click", (e) => this.#actionToggleGroup(e));

        // Content container (holds sub-groups, racks and items).
        let elmContent = document.createElement("div");
        this.#elms.set("content", elmContent);
        elmWrapper.appendChild(elmContent);
        elmContent.className = "groupContent"; // CSS class.
        elmContent.style.display = "none"; // Hide element as default.

        // --- Group info ----------------------------------------------------------------------------------------------

        // Group name
        let elmName = document.createElement("div");
        elmGroup.appendChild(elmName);
        elmName.className = "groupName";
        elmName.appendChild(document.createTextNode(this._data.name));

        // Triangle symbol (indicates display/hidden state of sub-components in group)
        let elmTriangle = document.createElement("div");
        this.#elms.set("triangle", elmTriangle);
        elmGroup.appendChild(elmTriangle);
        elmTriangle.className = "groupTriangle";
        // We use down-pointing triangle only - and rotate element in CSS to display left pointing triangle.
        elmTriangle.innerHTML = "&#9660;";

        // ◀	Black Left-pointing Triangle	Decimal: &#9664;
        // ▼	Black Down-pointing Triangle	Decimal: &#9660;

        // *** For testing ***
        // elmName.appendChild(document.createTextNode(this._data.name + " (" + this.#paletteIdx + ", " + this.#levelIdx + ")"));
        // *******************

        // -------------------------------------------------------------------------------------------------------------

        return elmContent;
    }

    /**
     * Closes group (hides sub-components if displayed).
     */
    actionCloseGroup() {
        if (this.#elms.get("content").style.display !== "none") {
            this.#actionToggleGroupHelper();
        }
    }

    #actionToggleGroup(e) {
        if (!e.ctrlKey && this.#elms.get("content").style.display === "none") {
            // Auto-close any other groups on this level.
            this.#viewInventory.closeGroupDescendants(super.parentCmp, this);
        }

        // Check if components array has been populated.
        if (this.#components.length === 0) {
            // Retrieve first-childrem data for this group, and create corresponding elements.
            this.#viewInventory.retrieveGroupData(this)
                .then(() => this.#actionToggleGroupHelper());
        }
        else {
            this.#actionToggleGroupHelper();
        }
    }

    #actionToggleGroupHelper() {
        // Check if transition between display/hide is in progress.
        // If so, ignore call, as this may otherwise reverse the expected display/hide state.
        if (this.#transitionInProgress) return; // Bail out.
        this.#transitionInProgress = true; // Block toggle action until running transition is completed.
        let self = this; // To allow referencing this in closure.
        const elmContent = this.#elms.get("content");
        if (elmContent.style.display === "none") {
            // --- Display element ---
            elmContent.style.display = "block";
            // Change triangle symbol to down-poiting
            this.#elms.get("triangle").classList.toggle("open");
            // Set max-height to the height of the elements inner content (regardless of its actual size),
            elmContent.style.maxHeight = elmContent.scrollHeight + "px"; // Triggers transition.
            elmContent.addEventListener("transitionend", function action(event) {
                // Check that transitionend triggered for expected property.
                if (event.propertyName !== "max-height") return; // Ignore.
                elmContent.style.maxHeight = "fit-content";
                self.#transitionInProgress = false; // Re-engage toggle action.
                elmContent.removeEventListener('transitionend', action);
            });
        }
        else {
            // --- Hide element ---
            // Change triangle symbol to left-pointing
            this.#elms.get("triangle").classList.toggle("open");
            // Set max-height to its current screen size.
            elmContent.style.maxHeight = elmContent.scrollHeight + "px";
            // Wait until browser has repainted screen.
            window.requestAnimationFrame(() => {
                elmContent.style.maxHeight = "0px"; // Triggers transition.
                elmContent.addEventListener("transitionend", function action(event) {
                    // Check that transitionend triggered for expected property.
                    if (event.propertyName !== "max-height") return; // Ignore.
                    elmContent.style.display = "none";
                    self.#transitionInProgress = false; // Re-engage toggle action.
                    elmContent.removeEventListener('transitionend', action);
                });
            });
        }
    }

}