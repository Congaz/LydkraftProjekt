import express from "express";
import path from "path";
import {fileURLToPath} from "url";
import morgan from "morgan";
import UserRouter from "./routes/userRoutes.js";
import {ItemFactory} from "../domain/component/ItemFactory.js";
import session from 'express-session';
import Controller from "../service/controller.js";
import bodyParser from 'body-parser'


// TODO Create item --> needs session------------------------------------------------

//-----------------------------------------------------------------------------------

const app = express();
const controller = new Controller()
const userRouter = new UserRouter(controller);
// hvis brug af forms skal vi have denne !
app.use(bodyParser.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// console.log(__dirname + " test");

// original placering
let pathToPublic = path.join(__dirname, '../../', 'public');

app.use(express.static(pathToPublic))
app.use(session({secret: 'mySecret', saveUninitialized: true, resave: true}));
app.use(express.json());
app.use(morgan('tiny'));


app.use(userRouter.router)

let mypath = path.join(__dirname, '../','views');
// console.log(mypath)
// console.log(mypath)
app.set('view engine','pug')
app.set('views', mypath);

export function startServer(port){
    app.listen(port, () => console.log(`Listen at  ${port}`))
}

