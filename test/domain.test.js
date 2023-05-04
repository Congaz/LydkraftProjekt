import {Item} from "../src/domain/component/Item.js";
import {Attribute} from "../src/domain/component/Attribute.js";
import {Component} from "../src/domain/component/Component.js";
import {Order} from "../src/domain/Order.js"


    describe("Domain: Attribute unit Test", () => {
        let testAttribute;

        test("Attribute: name, type, value", () => {
            //setup
            testAttribute = new Attribute("Længde", 'number', 10,[], "meter")
            //assert
            const expectedName = "Længde"
            const expectedType = "number"
            const expectedUnit = "meter"
            //test
            expect(testAttribute.name).toBe(expectedName)
            expect(testAttribute.type).toBe(expectedType)
            expect(testAttribute.unit).toBe(expectedUnit)

        });

        test("Attribute: toThrow error when name, empty ", () => {
           expect(()=> {
               // new Attribute("", "number", "10")
               new Attribute("", "number")
           }).toThrow("Name argument may not be empty.")
        });

        test("set value", () => {
            //setup
            testAttribute = new Attribute("Længde", "number")
            testAttribute.value = 20;
            //asert
            const testValue = testAttribute.value;
            let testBool = (typeof testValue == 'number')
            //test
            expect(testAttribute.value).toBe(testValue)
            expect(testBool).toBe(true)

        });

        test("set value tothrow Error type ", () => {
            testAttribute = new Attribute("Længde", "number",null,[], "meter")
            expect(()=>{
                testAttribute.value = "tyve";
            }).toThrow("Incomaptible type")
        });



})


    describe("Domain Item Test", () => {

        let testItem;
        beforeEach(() => {
            testItem = new Item("kabel");
        })



        test("Item: set name(name)", () => {
            //setup
            testItem.name = "3 tommer sort"
            //assert
            const testName = "3 tommer sort"
            //test
            expect(testItem.name).toBe(testName);

        });




        test("addAttribute(attribute)", () => {
            //setup
            testItem.addAttribute(new Attribute("Længde", "number"))
            testItem.addAttribute(new Attribute("Effekt", "number"))
            //assert
            const testArrayLength = 2;
            const testAtribName = "Længde"
            //test
            expect(testItem.getAttributes().length === testArrayLength);
            expect(testItem.getAttribute("Længde").name).toBe(testAtribName)


        });




    });

    describe("Domain Order Test", () => {

        let testOrder;
        let testItem;
        let testItem2;


        beforeEach(() => {
            testOrder = new Order("Keld og hilda 11-05-2022", Date.now(), "Steffen22", null, null, "02");

            testItem = new Item("kabel1-kort");
            testItem.addAttribute(new Attribute("Længde", "number"))
            testItem.setAttributeValue("Længde", 2)
            testItem.setAttributeValue("Antal", 10);
            testItem.price = 10;

            testItem2 = new Item("kabel2-langt");
            testItem2.addAttribute(new Attribute("Længde", "number"))
            testItem2.setAttributeValue("Længde", 20)
            testItem2.setAttributeValue("Antal", 1);
            testItem2.price = 300;

        });

        test("Domain Order addItem", () => {
            //setup
            testOrder.addItem(testItem);
            testOrder.addItem(testItem2);

            //assert
            let totalItems = 0;
            for (let element of testOrder.getItems()) {
                let elementAttrib = element.getAttribute("Antal")
                let attribAntal = elementAttrib.value
                totalItems += attribAntal
            }
            const expected = 11
            //test
            expect(totalItems).toBe(expected)


        });


    });