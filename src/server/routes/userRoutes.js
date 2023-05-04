import express from 'express'
import {ItemFactory} from "../../domain/component/ItemFactory.js";
import path from "path";
import {fileURLToPath} from "url";
import {InventoryTestData} from "../../domain/component/InventoryTestData.js";
import session from "express-session";

class UserRouter {
    #pathToSrc
    #router
    #controller

    constructor(controller) {
        this.#pathToSrc = path.join(path.dirname(fileURLToPath(import.meta.url)), '../..');
        this.#router = express.Router();
        this.#controller = controller;
        this.setUpRoutes()

        // *** DEVELOPMENT ******************************
        // session.loggedIn = true; // Defeat log-in check.
        // **********************************************
    }

    setUpRoutes() {
        this.#router.get('/', (reg, res) => {
            if (!session.loggedIn) {
                res.redirect("/login")
            }
            else {
                res.render('index');
            }
        })


        // --- Log in/out -----------------------------------------------------------------------------------------------
        this.#router.get("/login", (request, response) => {
            if (session.loggedIn) {
                response.redirect("/")
            }
            else {
                response.render("login.pug");
            }
        })

        this.#router.get("/logout", (request, response) => {
            if (session.loggedIn) {
                session.loggedIn = false;
            }
            response.redirect("/login")
        })

        this.#router.post("/userValidation", async (request, response) => {
            console.log(request.body.userName);
            let authObj = {};
            await this.#controller.repository.validateUser(request.body.userName, request.body.password, authObj);
            if (authObj.loggedIn) {
                console.log("loggedIn")
                session.loggedIn = true;
                response.redirect("/")
            }
            else {
                console.log("access Denied")
                response.send("Access denied...go away hacker man!")
            }
        })

        // --- InventoryView -------------------------------------------------------------------------------------------
        this.#router.get('/inventoryView', (request, response) => {
            if (session.loggedIn) {
                // Returns array with component objects.
                const components = InventoryTestData.getComponents(true);
                //console.log(components.toString());
                response.render('inventoryView.pug', {components: components});
            }
            else {
                response.render("login.pug");
            }
        });

        // --- Create product ------------------------------------------------------------------------------------------
        const itemFactory = new ItemFactory();
        const templateObj = itemFactory.getAllTemplateObjects().map(i => i.toJSON())
            .map(i => {
                    return {templateName: i.templateName, attributes: i.attributes}
                }
            );

        this.#router.get('/createProduct', (request, response) => {
            if (session.loggedIn) {
                response.render('createProduct.pug', {templateNames: templateObj});
            }
            else {
                response.render("login.pug");
            }
        });

        // når man create a product
        this.#router.get('/products', (request, response) => {
            if (session.loggedIn) {
                response.render('products.pug');
            }
            else {
                response.render("login.pug");
            }
        });

        this.#router.post('/products', (request, response) => {
            if (session.loggedIn) {
                const jo = request.body
                console.log(jo);
                this.#controller.repository.pushToDb(jo).catch(err => {
                    console.log(err)
                });
                response.sendStatus(201);
            }
            else {
                response.render("login.pug");
            }
        });


        //this.#router.post('/createProducts', (req, response) => {
        //response.send("File upload sucessfully.")});

        // --- Lagerbeholdningsdata -----------------------------------------------------------------------------------

        /**
         *
         * Requires two query paramters:
         * searchId     string     Options: all | [component id from database]
         * recursive    string     Options: true | false
         */
        this.#router.get('/inventoryData', (req, rsp) => {
            if (session.loggedIn) {
                if (typeof (req.query.searchId) === "undefined") {
                    throw new TypeError("Parameter 'searchId' may not be undefined.");
                }
                if (typeof (req.query.recursive) === "undefined") {
                    throw new TypeError("Parameter 'recursive' may not be undefined.");
                }
                let searchId = decodeURIComponent(req.query.searchId);
                let recursive = decodeURIComponent(req.query.recursive).toLowerCase() === 'true';

                let result;
                if (searchId.toLowerCase() === "all") {
                    // Returns array with component objects.
                    result = InventoryTestData.getComponents(recursive);
                }
                else {
                    // Returns component object.
                    result = InventoryTestData.getComponentById(searchId, recursive);
                }

                rsp.send(JSON.stringify(result));
            }
            else {
                rsp.render("login.pug");
            }
        });

        // --- Order edit ----------------------------------------------------------------------------------------------

        // this.#router.get("/orderEditOFF.html", (req, res) => {
        //     res.sendFile(path.join(this.#pathToSrc, '/html/orderEditOFF.html'));
        // })

        this.#router.get('/orderEdit.html', (request, response) => {
            if (session.loggedIn) {
                response.render('orderEdit.pug');
            }
            else {
                response.render("login.pug");
            }
        });


    } // Setup-Routes done---

    get router() {
        return this.#router;
    }

}

export default UserRouter