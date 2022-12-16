// -------------- PACKAGES -------------- //
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { Schema } = mongoose;
const _ = require('lodash');

// -------------- ASYNC FUNCTIONS -------------- //
async function insertEntry(mod, arr){
    try{
        await mod.insertMany(arr)
        console.log("Succesfully saved on DB");
    } catch(err){
        console.log(err);
    }
}

async function showCollection(mod, filter){
    try{
        const documents = await mod.find(filter);
        return documents;
    } catch(err){
        console.log(err);
    }
}

// -------------- APP CONFIG -------------- //
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public")); // Uploads the public folder
app.set("view engine", "ejs");

// -------------- DATABASE -------------- //
mongoose.set('strictQuery', true);
mongoose.connect("mongodb://0.0.0.0:27017/todolistDB");

// -------------- SCHEMAS -------------- //
const itemSchema = new Schema ({
    name: {
        type: String,
        required: true,
    },
    listName: String
});

// -------------- MODELS -------------- //
const Item = mongoose.model("Item", itemSchema);

// -------------- SERVER -------------- //
// -- GET METHOD -- //
// - Home
app.get("/", async function(req, res){
    const items = await showCollection(Item, {listName: "/"});

    res.render("list", {listTitle: "My daily list", itemList: items, r: "/"});
});

// - Custom List
app.get("/:listPath", async function(req, res){
    const list = _.startCase(req.params.listPath);
    const route = "/" + list;
    const items = await showCollection(Item, {listName: route});

    res.render("list", {listTitle: list, itemList: items, r: route});
}) 

// -- POST METHOD -- //
// - Home
app.post("/", async function(req, res){
    const todo = req.body.todo;

    const newItem = new Item({
        name: todo,
        listName: "/"
    });

    await insertEntry(Item, [newItem]);

    res.redirect("/")
});

// - Custom List
app.post("/:listPath", async function(req, res){
    const todo = req.body.todo;
    const list = _.startCase(req.params.listPath);
    const route = "/" + list;

    const newItem = new Item({
        name: todo,
        listName: route
    });

    await insertEntry(Item, [newItem]);

    res.redirect(route)
})

// - DELETE ITEM
app.post("/db/delete", async function(req, res){
    const itemId = req.body.checkbox;

    try{
        deletedItem = await Item.findByIdAndDelete(itemId);
    } catch(err){
        console.log(err);
    }

    route = deletedItem.listName;

    res.redirect(route);
})

// -- SERVER LISTEN -- //
app.listen(3000, function(){
    console.log("The server is running on port 3000");
});
