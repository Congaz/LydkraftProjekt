import {Order} from "./Order.js";
import {Item} from "./component/Item.js";

let order;
let item;

/*
    #id;
    #name;
    #dateCreated;
    #dateStart;
    #dateEnd;
    #userId;
 */

order = new Order("joker", Date.now(), "blop", null, null, "7");

item = new Item("testItem", "9");
order.addItem(item);

console.log(order.toString())




