import {Item} from "./Item.js";
import {Attribute} from "./Attribute.js";

export class ItemFactory {
    static templates = new Map();

    constructor() {
        // Anvendes for Items der ikke har behov for specifikke attributter
        ItemFactory.templates.set("generisk", (templateName) => {
            let item = new Item(templateName);
            return item;
        });

        ItemFactory.templates.set("forstærker", (templateName) => {
            let item = new Item(templateName);
            item.addAttribute(new Attribute("Watt", "number"));
            item.addAttribute(new Attribute("Serienummer", "string"));
            return item;
        });

        ItemFactory.templates.set("kabel", (templateName) => {
            let item = new Item(templateName);
            item.addAttribute(new Attribute("Længde", "number", null, [], "meter"));
            return item;
        });

        ItemFactory.templates.set("lampe", (templateName) => {
            let item = new Item(templateName);
            item.addAttribute(new Attribute("Type", "string", null, ["LED", "Halogen", "Glødepære"]));
            return item;
        });

        ItemFactory.templates.set("mikrofon", (templateName) => {
            let item = new Item(templateName);
            return item;
        });

        ItemFactory.templates.set("mixer", (templateName) => {
            let item = new Item(templateName);
            item.addAttribute(new Attribute("Kanaler", "string"));
            return item;
        });

        ItemFactory.templates.set("tæppe", (templateName) => {
            let item = new Item(templateName);
            item.addAttribute(new Attribute("Bredde", "number", null, [], "meter"));
            item.addAttribute(new Attribute("Højde", "number", null, [], "meter"));
            item.addAttribute(new Attribute("Farve", "string", "", [], ""));

            return item;
        });
    }

    getTemplateNames() {
        return Array.from(ItemFactory.templates.keys());
    }

    getAttributesByTemplateName(itemName) {
        let item = this.create(itemName);
        return item.getAttributes();
    }

    getAllTemplateObjects() {
        let templateObjects = [];
        let keys = Array.from(ItemFactory.templates.keys());
        for (let key of keys) {
            templateObjects.push(this.create(key));
        }

        return templateObjects;
    }

    create(templateName) {
        if (typeof (templateName) !== "string") throw new TypeError("String expected.");
        if (!ItemFactory.templates.has(templateName)) {
            throw new ReferenceError("Unrecognized templateName (" + templateName + ").");
        }
        return ItemFactory.templates.get(templateName)(templateName);
    }
}









