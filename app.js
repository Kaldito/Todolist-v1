const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js")

let weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
let items = ["Jugar LoL", "Comer", "Dormir"];
let workItems = [];

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public")); // Uploads the public folder
app.set("view engine", "ejs");

app.get("/", function(req, res){
    let day = date.getDate();

    res.render("list", {listTitle: day, itemList: items});
});

app.post("/", function(req, res){
    const todo = req.body.todo;

    if(req.body.list == "Work List") {
        workItems.push(todo);
        res.redirect("/work");
    } else{
        items.push(todo);
        res.redirect("/")
    }
})

app.get("/work", function(req, res){
    res.render("list", {listTitle: "Work List", itemList: workItems})
})

app.post("/work", function (req, res) {
    const item = req.body.todo;
    workItems.push(item);
    res.redirect("/work");
})

app.listen(3000, function(){
    console.log("The server is running on port 3000");
})






