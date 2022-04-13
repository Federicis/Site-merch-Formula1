const express= require("express");
const {Client}=require("pg");
// const formidable= require('formidable');
app= express();

client= new Client({user:"Alex", password: "2002", database:"dbproiect_web", host:"localhost", port:"5432"})
client.connect()

app.set("view engine", "ejs");


app.use("/resurse", express.static(__dirname + "/resurse"))

app.get(["/", "/index"], function(req, res){
    console.log(__dirname)
    // res.sendFile(__dirname + "/index.html");
    res.render("pages/index", {ip: req.ip});
})

app.get("/*.ejs", function(req,res){
    res.status(403).render("pages/403");
    res.end();
})

app.get("/ceva", function(req,res){
    res.write("Salut");
    res.end();
})

app.get("/merch", function(req, res){
    client.query(`select * from merch`, function(err, rezQuery){
        res.render("pages/merch", {produse: rezQuery.rows })
    })
})

app.get("/merch/:id", function(req, res){
    client.query(`select * from merch where id= $1`, [req.params.id],function(err, rezQuery){
        console.log(err);
        console.log(rezQuery);
        res.render("pages/produs", {prod: rezQuery.rows[0] });
    })
})

app.get("/*", function(req,res){
    res.render("pages" + req.url, function(err, rezRender){
        if(err) {
            if(err.message.includes("Failed to lookup view"))
                res.status(404).render("pages/404");
            else{
                res.render("pages/general_error")
            }
        }
        else{
            console.log(rezRender);
            res.send(rezRender);
        }
    });

    console.log("generala", req.url);
    res.end();
})
var s_port = process.env.PORT || 5000;
app.listen(s_port);
// app.listen(8080);
console.log("A pornit");