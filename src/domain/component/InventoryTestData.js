import {ItemFactory} from "./ItemFactory.js";
import {Rack} from "./Rack.js";
import {Group} from "./Group.js";


export class InventoryTestData {
    static #ids = [];
    static #counter = 0;

    static create() {
          // --- Simulate database ids ---
        // Create ids once.
        if (this.#ids.length === 0) {
            this.#ids = Array(1000);
            for (let i = 0; i < this.#ids.length; i++) {
                this.#ids[i] = this.#createId();
            }
        }

        // We create a new batch of instances on every call (ids remain the same).
        // This is instead of doing a deep copy of created instances,
        // whenever this method is called.
        let components = [];

        // DEFINE IF SIMPLE OR EXTENSIVE INVENTORY SHOULD BE CREATED.
        let simple = 0;
        if (simple) {
            components = this.#createSimple();
        }
        else {
            components = this.#createExtensive();
        }

        this.#counter = 0;
        this.#assignIds(components);
        return components;
    }


    static #createSimple() {
        let tmpComponents = [];
        let item;
        let rack;
        let fact = new ItemFactory();

        // *** Audio gruppe *******************************************************************************************

        let grpAudio = new Group("Audio");
        tmpComponents.push(grpAudio);

        // --- Mikrofongruppe ---
        // Mikrofon gruppe
        let grpMikrofoner = new Group("Mikrofoner");
        // tmpComponents.push(grpMikrofoner);
        grpAudio.addComponent(grpMikrofoner);

        // --- Dynamisk ---
        let grpDynamic = new Group("Dynamisk");
        grpAudio.addComponent(grpDynamic);
        // grpMikrofoner.addComponent(grpDynamic);


        // *************************************************************************************************************

        return tmpComponents;
    }


    static #createExtensive() {
        let tmpComponents = [];
        let item;
        let rack;
        let fact = new ItemFactory();

        // *** Audio gruppe ********************************************************************************************

        let grpAudio = new Group("Audio");
        tmpComponents.push(grpAudio);

        // --- Forstærkerer ---
        // Forstærker gruppe
        let grpAmps = new Group("Forstærkere");
        grpAudio.addComponent(grpAmps);

        item = fact.create("forstærker");
        item.name = "LAB Gruppen PLM 10000";
        item.setAttributeValue("watt", 10000);
        item.setAttributeValue("serienummer", "abc-12345-45");
        grpAmps.addComponent(item);

        item = fact.create("forstærker");
        item.name = "LAB Gruppen PLM 10000";
        item.setAttributeValue("watt", 10000);
        item.setAttributeValue("serienummer", "abc-54321-77");
        grpAmps.addComponent(item);

        item = fact.create("forstærker");
        item.name = "LAB Gruppen PLM 20000";
        item.setAttributeValue("watt", 20000);
        item.setAttributeValue("serienummer", "abc-54321-71");
        grpAmps.addComponent(item);

        item = fact.create("forstærker");
        item.name = "LAB fp2400";
        item.setAttributeValue("watt", 2400);
        item.setAttributeValue("serienummer", "abc-14321-72");
        grpAmps.addComponent(item);


        // --- Div. Mikrofoner -----------------------------------------------------------------
        // Mikrofon gruppe
        let grpMikrofoner = new Group("Mikrofoner");
        grpAudio.addComponent(grpMikrofoner);

        // --- Dynamiske ---
        let grpDynamic = new Group("Dynamisk");
        grpMikrofoner.addComponent(grpDynamic);

        item = fact.create("mikrofon");
        item.name = "Shure Beta58";
        item.pris = 50;
        item.setAttributeValue("antal", 40);
        grpDynamic.addComponent(item);

        item = fact.create("mikrofon");
        item.name = "Shure Beta52";
        item.pris = 50;
        item.setAttributeValue("antal", 4);
        grpDynamic.addComponent(item);

        item = fact.create("mikrofon");
        item.name = "Shure SM57";
        item.pris = 50;
        item.setAttributeValue("antal", 50);
        grpDynamic.addComponent(item);

        // --- Kondensator ---
        let grpCondensor = new Group("Kondensator");
        grpMikrofoner.addComponent(grpCondensor);

        item = fact.create("mikrofon");
        item.name = "AKG 636";
        item.pris = 50;
        item.setAttributeValue("antal", 6);
        grpCondensor.addComponent(item);

        item = fact.create("mikrofon");
        item.name = "AKG 414 (sæt)";
        item.pris = 100;
        item.setAttributeValue("antal", 1);
        grpCondensor.addComponent(item);

        item = fact.create("mikrofon");
        item.name = "AKG 214 (sæt)";
        item.pris = 75;
        item.setAttributeValue("antal", 2);
        grpCondensor.addComponent(item);

        // --- Div. kabler ----------------------------------------------------------
        // Kabelgruppe
        let grpKabler = new Group("Kabler");
        grpAudio.addComponent(grpKabler);

        // Mikrofonkabler gruppe
        let grpMikrofonkabler = new Group("XLR");
        grpKabler.addComponent(grpMikrofonkabler);

        // Mikrofonkabler i div. længder
        item = fact.create("kabel");
        item.name = "2 m.";
        item.setAttributeValue("længde", 2);
        item.setAttributeValue("antal", 10);
        grpMikrofonkabler.addComponent(item);

        item = fact.create("kabel");
        item.name = "3 m.";
        item.setAttributeValue("længde", 3);
        item.setAttributeValue("antal", 100);
        grpMikrofonkabler.addComponent(item);

        item = fact.create("kabel");
        item.name = "5 m.";
        item.setAttributeValue("længde", 5);
        item.setAttributeValue("antal", 100);
        grpMikrofonkabler.addComponent(item);

        item = fact.create("kabel");
        item.name = "10 m.";
        item.setAttributeValue("længde", 10);
        item.setAttributeValue("antal", 50);
        grpMikrofonkabler.addComponent(item);

        // --- Speakonkabler gruppe ---------------------------
        let grpSpeakon = new Group("Speakon");
        grpKabler.addComponent(grpSpeakon);

        // Div. speakonkabler
        item = fact.create("kabel");
        item.name = "NL4-0.5m.";
        item.setAttributeValue("længde", 0.5);
        item.setAttributeValue("antal", 20);
        grpSpeakon.addComponent(item);

        item = fact.create("kabel");
        item.name = "NL4-2m.";
        item.setAttributeValue("længde", 2);
        item.setAttributeValue("antal", 20);
        grpSpeakon.addComponent(item);

        item = fact.create("kabel");
        item.name = "NL4-5m.";
        item.setAttributeValue("længde", 5);
        item.setAttributeValue("antal", 20);
        grpSpeakon.addComponent(item);

        item = fact.create("kabel");
        item.name = "NL4-10m.";
        item.setAttributeValue("længde", 10);
        item.setAttributeValue("antal", 30);
        grpSpeakon.addComponent(item);

        item = fact.create("kabel");
        item.name = "NL4-15m.";
        item.setAttributeValue("længde", 15);
        item.setAttributeValue("antal", 20);
        grpSpeakon.addComponent(item);

        item = fact.create("kabel");
        item.name = "NL4-30m.";
        item.setAttributeValue("længde", 30);
        item.setAttributeValue("antal", 5);
        grpSpeakon.addComponent(item);

        // --- Audiomixere -----------------------------------------------------------
        let grpAudioMixere = new Group("Mixere");
        grpAudio.addComponent(grpAudioMixere);

        item = fact.create("mixer");
        item.name = "Soundcraft Vi400";
        item.price = 2500;
        item.setAttributeValue("kanaler", "max. 96");
        item.setAttributeValue("antal", 1);
        grpAudioMixere.addComponent(item);

        item = fact.create("mixer");
        item.name = "Soundcraft Vi1";
        item.price = 1800;
        item.setAttributeValue("kanaler", "32/16 (native)");
        item.setAttributeValue("antal", 2);
        grpAudioMixere.addComponent(item);

        item = fact.create("mixer");
        item.name = "Soundcraft Expression Si1";
        item.price = 350;
        item.setAttributeValue("kanaler", "16/16 (native)");
        item.setAttributeValue("antal", 1);
        grpAudioMixere.addComponent(item);

        item = fact.create("mixer");
        item.name = "Soundcraft Impact";
        item.price = 500;
        item.setAttributeValue("kanaler", "32/16 (native)");
        item.setAttributeValue("antal", 1);
        grpAudioMixere.addComponent(item);

        // *** Lys Gruppe **********************************************************************************************

        let grpLys = new Group("Lys");
        tmpComponents.push(grpLys);

        // --- Lysmixere -------------------------------------------------------------
        let grpLysmixere = new Group("Mixere");
        grpLys.addComponent(grpLysmixere);

        item = fact.create("mixer");
        item.name = "Chamsys Magic Q40N";
        item.price = 800;
        item.setAttributeValue("Kanaler", "4 universer (x 512)");
        item.setAttributeValue("antal", 1);
        grpLysmixere.addComponent(item);

        item = fact.create("mixer");
        item.name = "M-Touch m. PC";
        item.price = 350;
        item.setAttributeValue("Kanaler", "");
        item.setAttributeValue("antal", 1);
        grpLysmixere.addComponent(item);

        item = fact.create("mixer");
        item.name = "LSC Maxim M";
        item.price = 250;
        item.setAttributeValue("Kanaler", "48");
        item.setAttributeValue("antal", 1);
        grpLysmixere.addComponent(item);

        item = fact.create("mixer");
        item.name = "Zero Sirius";
        item.price = 100;
        item.setAttributeValue("Kanaler", "48");
        item.setAttributeValue("antal", 1);
        grpLysmixere.addComponent(item);

        item = fact.create("mixer");
        item.name = "Zero 88 Elara";
        item.price = 50;
        item.setAttributeValue("Kanaler", "24");
        item.setAttributeValue("antal", 1);
        grpLysmixere.addComponent(item);

        // --- Lamper -----------------------------------------------------------------
        let grpLamper = new Group("Lamper");
        grpLys.addComponent(grpLamper);

        // --- Fresnel ---
        let grpFresnel = new Group("Fresnel");
        grpLamper.addComponent(grpFresnel);

        item = fact.create("lampe");
        item.name = "Fresnel 1kW";
        item.price = 75;
        item.setAttributeValue("type", "glødepære");
        item.setAttributeValue("antal", 12);
        grpFresnel.addComponent(item);

        // --- Profil ---
        let grpProfil = new Group("Profil");
        grpLamper.addComponent(grpProfil);

        item = fact.create("lampe");
        item.name = "Profil 1,2kW";
        item.price = 75;
        item.setAttributeValue("type", "halogen");
        item.setAttributeValue("antal", 12);
        grpProfil.addComponent(item);

        item = fact.create("lampe");
        item.name = "Profil 650kW";
        item.price = 75;
        item.setAttributeValue("type", "halogen");
        item.setAttributeValue("antal", 4);
        grpProfil.addComponent(item);

        // --- Wash ---
        let grpWash = new Group("Wash");
        grpLamper.addComponent(grpWash);

        item = fact.create("lampe");
        item.name = "Plano Spot 7TC";
        item.price = 50;
        item.setAttributeValue("type", "led");
        item.setAttributeValue("antal", 8);
        grpWash.addComponent(item);

        // *** Rigging gruppe ******************************************************************************************

        let grpRigging = new Group("Rigging");
        tmpComponents.push(grpRigging);

        // --- Kraner ---------------------------------------------------------
        let grpKraner = new Group("Kraner");
        grpRigging.addComponent(grpKraner);

        item = fact.create("generisk");
        item.name = "Håndtalje 1T";
        item.price = 150;
        item.setAttributeValue("antal", 2);
        grpKraner.addComponent(item);

        item = fact.create("generisk");
        item.name = "Håndtalje 0,5T";
        item.price = 100;
        item.setAttributeValue("antal", 2);
        grpKraner.addComponent(item);

        // --- Stativer -------------------------------------------------------
        let grpStativer = new Group("Stativer");
        grpRigging.addComponent(grpStativer);

        item = fact.create("generisk");
        item.name = "Stand Force TA 25550";
        item.price = 300;
        item.description = "Wind up 5,5 m / 225kg";
        item.setAttributeValue("antal", 4);
        grpStativer.addComponent(item);

        item = fact.create("generisk");
        item.name = "Doughty";
        item.price = 250;
        item.description = "Wind up 6m / 150kg";
        item.setAttributeValue("antal", 2);
        grpStativer.addComponent(item);

        item = fact.create("generisk");
        item.name = "Manfrotto 087";
        item.price = 125;
        item.description = "Wind up 3,70m / 30kg ";
        item.setAttributeValue("antal", 8);
        grpStativer.addComponent(item);

        // *** Tæpper gruppe *******************************************************************************************

        let grpTaepper = new Group("Tæpper");
        tmpComponents.push(grpTaepper);

        item = fact.create("tæppe");
        item.name = "Bagtæppe Molton 3x6m";
        item.pris = 150;
        item.setAttributeValue("bredde", 3, "meter");
        item.setAttributeValue("højde", 6, "meter");
        item.setAttributeValue("antal", 7);
        grpTaepper.addComponent(item);

        item = fact.create("tæppe");
        item.name = "Bagtæppe Molton 9x6m";
        item.pris = 300;
        item.setAttributeValue("bredde", 9, "meter");
        item.setAttributeValue("højde", 6, "meter");
        item.setAttributeValue("antal", 2);
        grpTaepper.addComponent(item);

        item = fact.create("tæppe");
        item.name = "Sofit Molton 3x1m";
        item.pris = 50;
        item.setAttributeValue("bredde", 3, "meter");
        item.setAttributeValue("højde", 1, "meter");
        item.setAttributeValue("antal", 6);
        grpTaepper.addComponent(item);

        // *** Niveau test gruppe **************************************************************************************

        let grpNiveau0 = new Group("Niveau 0");
        tmpComponents.push(grpNiveau0);

        let grpNiveau1 = new Group("Niveau 1");
        grpNiveau0.addComponent(grpNiveau1);

        let grpNiveau2 = new Group("Niveau 2");
        grpNiveau1.addComponent(grpNiveau2);

        let grpNiveau3 = new Group("Niveau 3");
        grpNiveau2.addComponent(grpNiveau3);

        let grpNiveau4 = new Group("Niveau 4");
        grpNiveau3.addComponent(grpNiveau4);

        item = fact.create("generisk");
        item.name = "Herfra er niveauerne magen til 4";
        item.price = 250;
        item.description = "";
        item.setAttributeValue("antal", 27);
        // grpNiveau4.addComponent(item);

         let grpNiveau5 = new Group("Niveau 5");
        grpNiveau4.addComponent(grpNiveau5);

        item = fact.create("generisk");
        item.name = "Som sagt magen til niveau 4";
        item.price = 250;
        item.description = "";
        item.setAttributeValue("antal", 42);
        // grpNiveau5.addComponent(item);

        // *** Udenfor gruppe ******************************************************************************************

        // item = fact.create("tæppe");
        // item.name = "Bagtæppe Molton 3x6m";
        // item.pris = 150;
        // item.setAttributeValue("bredde", 3, "meter");
        // item.setAttributeValue("højde", 6, "meter");
        // item.setAttributeValue("antal", 7);
        // tmpComponents.push(item);

        // item = fact.create("tæppe");
        // item.name = "Bagtæppe Molton 9x6m";
        // item.pris = 300;
        // item.setAttributeValue("bredde", 9, "meter");
        // item.setAttributeValue("højde", 6, "meter");
        // item.setAttributeValue("antal", 2);
        // tmpComponents.push(item);

        // *************************************************************************************************************

        return tmpComponents;
    }

    /**
     * --- Recursive ---
     * true:    Returned components will contain descendants in components array to the bottom of tree.
     * false:   Returned components not contain any descendants in components array.
     * @param recursive
     * @returns [compoenents]
     */
    static getComponents(recursive = false) {
        if (typeof (recursive) !== "boolean") throw new TypeError("Boolean expected.");

        // Create test inventory.
        let cmps = this.create();

        if (!recursive) {
            for (let cmp of cmps) {
                if (cmp.isClassName("Group")) {
                    // Component is a group. Purge all sub-components.
                    cmp.removeAllComponents();
                }
            }

        }

        return cmps;
    }

    /**
     * Simulates query to database.
     * --- Recursive ---
     * true:    Returned component will contain descendants in components array to the bottom of tree.
     * false:   Returned component will only contain first-child descendants in components array.
     * @param id
     * @param recursive
     * @return component
     */
    static getComponentById(id, recursive = false) {
        if (typeof (id) !== "string") throw new TypeError("String expected.");
        if (typeof (recursive) !== "boolean") throw new TypeError("Boolean expected.");

        // Create test inventory.
        let cmps = this.create();

        // Search component by id.
        let targetCmp = this.#getComponentByIdHelper(id, cmps);

        // Check if component was found.
        if (targetCmp === null) throw new ReferenceError("Unrecognized id: " + id);

        // If found component is a group.
        if (recursive === false && targetCmp instanceof Group) {
            targetCmp.purgeComponentsInSubGroups();
        }

        return targetCmp;
    }

    static #getComponentByIdHelper(id, components) {
        // Simulate searching database for passed id.
        for (let cmp of components) {
            if (cmp.id === id) {
                return cmp;
            }
            else if (cmp instanceof Group) {
                let result = this.#getComponentByIdHelper(id, cmp.getComponents()); // Recursive callback.
                if (result !== null) return result;
            }
        }
        return null;
    }

    static #assignIds(components) {
        for (let cmp of components) {
            cmp.id = this.#ids[this.#counter++];
            if (cmp.isClassName("Group")) {
                this.#assignIds(cmp.getComponents()); // Recursive callback.
            }
        }
    }

    /**
     * Creates and returns a unique id string for test purposes.
     */
    static #createId() {
        let hrTime = process.hrtime();
        return this.#createRandomString(10) + hrTime[1];
    }

    static #createRandomString(length, casing = "mixed", alphanumerical = false) {
        if (typeof (length) !== "number") throw new TypeError("Number expected.");
        if (typeof (casing) !== "string") throw new TypeError("String expected.");
        if (typeof (alphanumerical) !== "boolean") throw new TypeError("Boolean expected.");

        let charCodes = []; // We will populate this array with relevant character codes.

        // Char code: 65 - 90 (A-Z).
        if (casing === "upper" || casing === "mixed") {
            charCodes = charCodes.concat(Array.from({length: (90 - 65) + 1}, (elm, idx) => {
                return idx + 65
            }));
        }

        // Char char code: 97 - 122 (a-z).
        if (casing === "lower" || casing === "mixed") {
            charCodes = charCodes.concat(Array.from({length: (122 - 97) + 1}, (elm, idx) => {
                return idx + 97
            }));
        }

        // Check value of casing was recognized.
        if (charCodes.length === 0) throw new ReferenceError("Value of argument casing unrecognized: " + casing);

        // Char code: 48 - 57 (0-9).
        if (alphanumerical) {
            charCodes = charCodes.concat(Array.from({length: (57 - 48) + 1}, (elm, idx) => {
                return idx + 48
            }));
        }

        // Create random string by selecting randomly from charCodes array.
        let txt = "";
        for (let i = 0; i < length; i++) {
            txt += String.fromCharCode(charCodes[Math.floor(Math.random() * (charCodes.length))]);
        }

        return txt;
    }

}


