import {ItemFactory} from "../domain/component/ItemFactory.js";
import Repository from "../persistence/persistence.js";


class Controller {
    //#repository
    #itemFactory
    #repository

    constructor(){
        this.#itemFactory = new ItemFactory();
        this.#repository = new Repository(this.#itemFactory);
    }


    get itemFactory() {
        return this.#itemFactory;
    }

    get repository() {
        return this.#repository;
    }
}

export default Controller