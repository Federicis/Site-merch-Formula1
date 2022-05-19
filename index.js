const express= require("express");
const fs=require("fs");
const sharp=require("sharp");
const {Client}=require("pg");
const ejs= require("ejs");
const sass=require("sass");
// const formidable= require('formidable');
app= express();

client= new Client({user:"Alex", password: "2002", database:"dbproiect_web", host:"localhost", port:"5432"})
client.connect()

var categorii = [], theoptiuni = [], luni = ["ianuarie", "februarie", "martie", "aprilie", "mai", "iunie", "iulie", "august", "septembrie", "octombrie", "noimebrie", "decembrie"], echipe =[], produse = [];

client.query(`select * from merch`, function(err, rezQuery){
    produse = rezQuery.rows;

})

module.exports = {produse};

client.query(`SELECT enum_range(NULL::tipuri_merch)`, function(err, rezQuery){
    if(err) return;
    if (rezQuery.rows.length == 1){
        categorii = rezQuery.rows[0].enum_range.slice(1, -1).split(',').map( elem => {return elem.charAt(0).toUpperCase() + elem.slice(1) });

    }

})

client.query(`SELECT echipa FROM public.merch`, function(err, rezQuery){
    if(err) return;
    for(let item of rezQuery.rows){
        if(!echipe.includes(item["echipa"])){
            echipe.push(item["echipa"])
        }
    }

})

client.query(`SELECT enum_range(NULL::categ_produse)`, function(err, rezQuery){
    if(err) return;
    if (rezQuery.rows.length == 1){
        theoptiuni = rezQuery.rows[0].enum_range.slice(1, -1).split(',').map( elem => {return elem.charAt(0).toUpperCase() + elem.slice(1) });

    }
})

app.set("view engine", "ejs");


app.use("/resurse", express.static("./resurse"))

app.get('*', (req, res, next) =>{
    res.locals.categorii = categorii;
    res.locals.luni = luni;
    res.locals.echipe = echipe;
    next()
})

app.get(["/", "/index", "/home"], function(req, res){
    console.log(__dirname)
    // res.sendFile(__dirname + "/index.html");
    res.render("pages/index", {ip: req.ip, imagini: obImagini.imagini });
})

// app.get("/eroare", function(req, res){
//     randeazaEroare(res,1, "Titlu schimbat");
//
// });

app.get("/*.ejs", function(req,res){
    // res.status(403).render("pages/403");
    // res.end();
    randeazaEroare(res,403);
})

app.get("/ceva", function(req,res){
    res.write("Salut");
    res.end();
})

app.get("/merch", function(req, res){
    client.query(`select * from merch`, function(err, rezQuery){
        var pretMin = 100000;
        var pretMax = -1;
        for(let preturi of rezQuery.rows) {
            let pretCur = parseInt(preturi.pret)
            if (pretCur > pretMax) {
                pretMax = pretCur;
            }
            if (pretCur < pretMin) {
                pretMin = pretCur
            }
        }
        var optMarimi = [];
        for(let produs of rezQuery.rows) {
            for (let marime of produs.marimi) {
                if (!optMarimi.includes(marime)) {
                    optMarimi.push(marime);
                }
            }
        }
        res.render("pages/merch", {produse: produse, optiuni: theoptiuni, pretMax: pretMax, pretMin: pretMin, marimi:optMarimi})
    })
})

app.get("/merch/id/:id", function(req, res){
    client.query(`select * from merch where id= $1`, [req.params.id],function(err, rezQuery){
        console.log(err);
        console.log(rezQuery);
        res.render("pages/produs", {prod: rezQuery.rows[0] });
    })
})
app.get("/merch/categorii/:categ", function(req, res){
    client.query(`select * from merch where tip_produs= $1`, [req.params.categ],function(err, rezQuery){
        var pretMin = 100000;
        var pretMax = -1;
        for(let preturi of rezQuery.rows) {
            let pretCur = parseInt(preturi.pret)
            if (pretCur > pretMax) {
                pretMax = pretCur;
            }
            if (pretCur < pretMin) {
                pretMin = pretCur
            }
        }
        var optMarimi = [];
        for(let produs of rezQuery.rows) {
            for (let marime of produs.marimi) {
                if (!optMarimi.includes(marime)) {
                    optMarimi.push(marime);
                }
            }
        }
        res.render("pages/merch", {produse: rezQuery.rows, optiuni: theoptiuni, pretMax: pretMax, pretMin: pretMin, marimi:optMarimi})
    })
})
app.get("/*", function(req,res){
    res.render("pages" + req.url, function(err, rezRender){
        if(err) {
            if(err.message.includes("Failed to lookup view"))
                // res.status(404).render("pages/404");
                {
                    randeazaEroare(res,404);
                }
                else{
                randeazaEroare(res);
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

function creeazaImagini(){
    var buf=fs.readFileSync("./Resurse/json/galerie.json").toString("utf8");


    obImagini=JSON.parse(buf);//global

    //console.log(obImagini);
    for (let imag of obImagini.imagini){
        let nume_imag, extensie;
        [nume_imag, extensie ]=imag.fisier.split(".")// "abc.de".split(".") ---> ["abc","de"] imagine.png->imagine.webp
        let dim_mic=150

        imag.mic=`${obImagini.cale_galerie}/mic/${nume_imag}-${dim_mic}.webp` //nume-150.webp // "a10" b=10 "a"+b `a${b}`
        //console.log(imag.mic);


        imag.mare=`${obImagini.cale_galerie}/${imag.fisier}`;
        if (!fs.existsSync(imag.mic))
            sharp("./"+imag.mare).resize(dim_mic).toFile("./"+imag.mic);


        let dim_mediu=300;
        imag.mediu=`${obImagini.cale_galerie}/mediu/${nume_imag}-${dim_mediu}.png`
        if (!fs.existsSync(imag.mediu))
            sharp("./"+imag.mare).resize(dim_mediu).toFile("./"+imag.mediu);


    }

}
creeazaImagini();



function creeazaErori(){
    var buf=fs.readFileSync("./Resurse/json/erori.json").toString("utf8");
    obErori=JSON.parse(buf);//global
}
creeazaErori();

function randeazaEroare(res, identificator, titlu, text, imagine){
    var eroare= obErori.erori.find(function(elem){return elem.identificator == identificator});
    titlu= titlu || (eroare && eroare.titlu) || "Titlu eroare custom";
    text= text || (eroare && eroare.text) || "Titlu eroare custom";
    imagine= imagine || (eroare && (obErori.cale_baza+"/"+eroare.imagine)) || "Titlu eroare custom";
    if(eroare && eroare.status)
        res.status(eroare.identificator);
    res.render("pages/eroare_generala",{titlu:titlu, text:text, imagine: imagine});

}


var s_port = process.env.PORT || 8080;
app.listen(s_port);
// app.listen(8080);
console.log("A pornit");