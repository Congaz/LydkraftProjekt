import admin from "firebase-admin"
import serviceAccount from "./lydkraftCredentials.js"
import {FieldValue} from "@google-cloud/firestore/build/src/index.js";
import {ItemFactory} from "../domain/component/ItemFactory.js";
import {hashPwd, validateHashedPassword} from "../domain/userValidation.js";

class Repository {
    #db
    #ItemFactory

    constructor(ItemFactory) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        this.#db = admin.firestore();
        this.#ItemFactory = ItemFactory;
    }

    /*
    * do not use directly
    * used by method saveProduct()
    * */
    async pushToDb(product) {
        const data = {...product, created: new Date()}
        console.log(data)
        const userRef = this.#db.collection("products").doc();
        await userRef.set(data);
    }

    /*
    * creates a array of items fom all the documents in specified collection.
    * */
    async loadObjsFrom(collectionName) {
        // getting all objects in sepecified collection
        const querySnapshot = await this.#db.collection(collectionName)
            .get()
            .catch(e => console.log("not working out man... "+ e));
        const docs = querySnapshot.docs
        const data = docs;

        // push dbObjs to array and return
        let objs = [];
        for (let i = 0; i <data.length; i++) {
           let dbObj = data[i].data();



            let excludes = [ "created", "name", "templateType"];
            // creating model type
            let tempType = dbObj["templateType"];
            let newObj = this.#ItemFactory.create(tempType);
            newObj.name = dbObj["name"];
            newObj.id = data[i].id

            for (const attr of Object.keys( dbObj ) ) {
                if ( !excludes.includes(attr) && newObj.isAttribute(attr) ) {
                    newObj.setAttributeValue(attr, dbObj[attr]);
                } else if (!excludes.includes(attr)){
                    await this.removeFieldFromItem(data[i].id, attr, collectionName);
                }
            }

            // add new model type to out array and return
            objs.push(newObj);
       }
       return objs;
   }
    /*
    * use this method to save item to DB
    * it converts item to dbObject and
    * saves it to DB
    * */
    saveProduct(item){
        // converting attributes objects on item to ( One object )
        let attrsObj = {};
        for (const element of item.getAttributes()) {
            attrsObj[element.name] = element.value;
        }
        //console.log(attrsObj)

        //merging item and  One object
        let dbObj = {templateName:item.templateName, name:item.name, ...attrsObj}
        //console.log(dbObj)
        // trying to return promis from pushToDb
        return this.pushToDb(dbObj).catch(err => console.log("Object NOT saved" + err));
    }

    /*
    //old
    async getItemWithName(ItemName, collectionName) {
        const querySnapshot = await this.#db.collection(collectionName).where('name', '==', ItemName)
            .get()
            .catch(e => console.log("not working out man... "+ e));
        const docs = querySnapshot.docs
        // check if more that one with same username else return user
        const data = docs;

        console.log( data[0].data() );
    }*/

    async getItemWithName(ItemName, collectionName) {
        let data = await this.#db.collection(collectionName).where('name', '==', ItemName).get();
        return new Promise((resolve, reject) => {
            resolve(data.docs[0].data());
        });
    }

    async getUser(userName, collectionName) {
        let data = await this.#db.collection(collectionName).where('username', '==', userName).get();

        return new Promise((resolve, reject) => {
            resolve(data.docs[0].data());
        });

    }

    //console.log("is same: "+ ( checkHash == user.hashPwd ) );
    async validateUser(usr, password, usrObj) {
        await this.getUser(usr, "users").then(user => {
            console.log(user);
            let checkHash = hashPwd(password, user.salt);
            let checkresult = validateHashedPassword(checkHash, user.hashPwd);
            console.log("is generated hash like stored: "+ ( checkHash === user.hashPwd ) )
            return new Promise((resolve, reject) => {
                usrObj.username = user.username;
                usrObj.loggedIn = checkresult;

                if (checkresult == true) {
                    resolve("user exists")
                } else {
                    reject("user dosnt exist or password is wrong")
                }
            });
        }).catch(err => {
            console.log("couldnt get user: "+usr);
        })
    }

    async deleteItem(itemId, collectionName) {
        //db.collection('cities').doc('DC').delete();
        const querySnapshot = await this.#db.collection(collectionName).doc(itemId).delete();
    }

    async removeFieldFromItem(itemId, field ,collection) {
        // Create a document reference
        const ref = await this.#db.collection(collection).doc(itemId);
        // Remove the 'capital' field from the document
        //console.log(field)
        const res = await ref.update({
            [field]: FieldValue.delete()
        });
    }

    //todo create method that return document with specific documentId
}



export default Repository;

//test
if ( false ) {
    let repo = new Repository(new ItemFactory());

    // tilføjelse af fakeusers
    //repo.createFakeUsers();

    /*repo.getUser("steffen", "users").then(msg => {
        console.log(msg)
    })*/

    //userValidation
    let LoggedIn = {};
    await repo.validateUser("lars", "4321", LoggedIn)
        .then(() => console.log("login Succes: ") )
        .catch(err => console.log(err))
    console.log( LoggedIn.username+" "+ LoggedIn.loggedIn);


    // tilføjelse af object;
    /*let factory = new ItemFactory();
    let kabel = factory.create("kabel");
    kabel.name = "X2025LR";

    kabel.setAttributeValue("Længde", 20);
    kabel.setAttributeValue("Antal", 3);
    repo.saveProduct(kabel).then(m => {console.log(m)}).catch( err => console.log(err));
*/
    /*let forstærker = factory.create("forstærker");
    forstærker.name = "store Prins";
    forstærker.setAttributeValue("Watt", 20);
    forstærker.setAttributeValue("Serienummer", "5f324234235345");
    repo.saveProduct(kabel);
*/

    // getting all objects in sepecified collection
  /*  repo.loadObjsFrom("products").then( o => {
        console.log(o.toString());
    });*/

    // get item with names
    /*let dbobj = repo.getItemWithName("Test1", "products")
        .then( m => console.log(m.name));*/

    // deleting item from repo
    //repo.deleteItem("rolAhQ9xIedymSrRm89T", "products"); /*.then(msg => {console.log("success")}).catch( err => {console.log( "fail" )});*/

    // removing specifik field from item in repo
    //repo.removeFieldFromItem("kJm9gm9ArMklBdJ6IyNY", "Længde", "products");

}