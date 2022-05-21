window.onload=function(){
    console.log(window.location.hostname)
    // console.log(document.getElementById("sizes").options)
    var articole= document.getElementsByClassName("produs");
    var v_articole2=Array.from(articole);
     var preturi = document.getElementsByClassName("val-pret");
     var pretMin = 100000;
     var pretMax = -1;
     const translate ={"Jan":"ianuarie", "Feb":"februarie", "Mar":"martie","Apr": "aprilie", "May": "mai", "Jun": "iunie", "Jul":"iulie", "Aug":"august", "Sep":"septembrie","Oct":"octombrie","Nov":"noiembrie","Dec":"decembrie"}
     for(let pret of preturi) {
         let pretCur = parseInt(pret.innerHTML)
         if (pretCur > pretMax) {
             pretMax = pretCur;
         }
         if (pretCur < pretMin) {
             pretMin = pretCur
         }
     }
    document.getElementById("infoRange").innerHTML = pretMax.toString() + "   (" + pretMin.toString() + ")";
     document.getElementById("inp-pret").onchange=function(){
         document.getElementById("infoRange").innerHTML = pretMax.toString() + "   (" + this.value + ")";
     }

    var valSize = "";
     document.getElementById("inp-size").onchange = function(){
        valSize = this.value;
     }
     document.getElementById("filtrare").onclick = function(){
         var valNume= document.getElementById("inp-nume").value.toLowerCase();

         var butoaneRadio = document.getElementsByName("gr_rad")

         for(let buton of butoaneRadio){
             if(buton.checked)
             {
                 var valEchipa= buton.value;
                 break;
             }
         }

         var valPret = document.getElementById("inp-pret").value;
        var valCateg = document.getElementById("inp-categorie").value.toLowerCase();
         var luni = document.getElementById("inp-luna").options;
         var valluna = [];
         for(let luna of luni){
             if(luna.selected){
                 valluna.push(luna.value)
             }
         }
         // console.log(valluna);
        var valKids = document.getElementById("inp-kids").checked;
         var articole= document.getElementsByClassName("produs");
         let OK = 1;
         for(let litera of valNume){
             if((litera < 'a' || litera > 'z')&&(litera <'A' || litera > 'Z')){
                 document.getElementsByClassName("err-filtru")[0].style.display = "block";
                 OK = 0;
                 break;
             }
             else
             {
                 OK = 1;
             }
         }
         if(OK) {
             document.getElementsByClassName("err-filtru")[0].style.display = "none";
             for (let art of articole) {
                 art.style.display = "none";
                 let numeArt = art.getElementsByClassName("val-nume")[0].innerHTML.toLowerCase();
                 let echipaArt = art.getElementsByClassName("val-echipa")[0].innerHTML;
                 let pretArt = parseInt(art.getElementsByClassName("val-pret")[0].innerHTML);
                 let categArt = art.getElementsByClassName("val-categorie")[0].innerHTML;
                 let sizeArt = art.getElementsByClassName("val-marimi")[0].innerHTML.trim().split(",");
                 let kidsArt = art.getElementsByClassName("val-copii")[0].innerHTML;
                 let lunaArt = art.getElementsByClassName("val-luna")[0].innerHTML;
                 lunaArt = translate[lunaArt.split(" ")[1]];
                 // console.log(tipArt)
                 let cond1 = (numeArt.startsWith(valNume));
                 let cond2 = (valEchipa.toString() == echipaArt) || valEchipa.toString() == "toate";
                 let cond3 = pretArt >= valPret;
                 let cond4 = (categArt == valCateg) || (valCateg == "toate");
                 let cond5 = sizeArt.includes(valSize.toString()) || (valSize == "")
                 let cond6 = (kidsArt.toString() == valKids.toString()) || !valKids;
                 let cond7 = valluna.includes(lunaArt.trim()) || valluna.includes("toate");
                 let conditieFinala = cond1 && cond2 && cond3 && cond4 && cond5 && cond6 && cond7;
                 if (conditieFinala)
                     art.style.display = "grid";
             }
         }
     }
    function sorteaza(semn){
        var articole= document.getElementsByClassName("produs");
        var v_articole=Array.from(articole);
        v_articole.sort(function(a,b){
            var pret_a= parseFloat(a.getElementsByClassName("val-pret")[0].innerHTML);
            var pret_b= parseFloat(b.getElementsByClassName("val-pret")[0].innerHTML);
            if(pret_a!=pret_b)
                return semn*(pret_a - pret_b);
            else{

                var marimi_a= a.getElementsByClassName("val-marimi")[0].innerHTML.trim().split(',').length;
                var marimi_b= b.getElementsByClassName("val-marimi")[0].innerHTML.trim().split(',').length;
                return semn*(marimi_a - marimi_b);
            }

        });

        for(let art of v_articole){
            art.parentElement.appendChild(art);
        }
    }

    document.getElementById("sortCrescPret").onclick = function() {
         sorteaza(1)
    }
    document.getElementById("sortDescrescPret").onclick = function() {
        sorteaza(-1)
    }
     let alt = 0;
    window.addEventListener("keydown", function (event) {
        if (event.defaultPrevented) {
            return; // Do nothing if the event was already processed
        }
        if(event.key == "Alt"){
            alt = 1;
        }else
            if(event.key == "c"){
                if(alt){
                    var articole= document.getElementsByClassName("produs"), sum = 0;
                    for(let art of articole){
                        if(art.style.display != "none"){
                            sum += parseInt(art.getElementsByClassName("val-pret")[0].innerHTML);
                        }
                    }
                    // create a new div element
                    const newDiv = document.createElement("div");

                    // and give it some content
                    const newContent = document.createTextNode("Suma tuturor produselor de pe pagina este " + sum);

                    // add the text node to the newly created div
                    newDiv.appendChild(newContent);
                    newDiv.style.position = "fixed"
                    newDiv.style.fontSize = "50px"
                    newDiv.style.color = "red"
                    newDiv.style.left = "200px"
                    newDiv.style.top = "500px"
                    newDiv.style.display = "block"

                    // add the newly created element and its content into the DOM

                    console.log(newDiv)
                    document.body.appendChild(newDiv)
                    setTimeout(() => {  newDiv.parentNode.removeChild(newDiv); }, 2000);

                    console.log("Suma tuturor produselor de pe pagina este " + sum)
                }
            }
        // Cancel the default action to avoid it being handled twice
        event.preventDefault();
    }, true);
    window.addEventListener("keyup", function (event) {
        if (event.defaultPrevented) {
            return; // Do nothing if the event was already processed
        }
        if(event.key == "Alt"){
            alt = 0;
        }
        // Cancel the default action to avoid it being handled twice
        event.preventDefault();
    }, true);
     document.getElementById("resetare").onclick = function(){
         document.getElementsByClassName("err-filtru")[0].style.display = "none";
         var articole= document.getElementsByClassName("produs");
         document.getElementById("inp-nume").value = "";
         document.getElementById("inp-pret").value = pretMin;
         document.getElementById("infoRange").innerHTML = pretMax.toString() + "   (" + pretMin.toString() + ")";
         document.getElementById("inp-categorie").value = "toate";
         document.getElementById("inp-size").value = "";
         document.getElementById("inp-kids").checked = false;
         document.getElementsByName("gr_rad")[document.getElementsByName("gr_rad").length - 1].checked = true;
         for(let art of v_articole2){
             art.parentElement.appendChild(art);
         }
         for(let luna of document.getElementById("inp-luna").options)
         {
             if(luna.value == "toate"){
                 luna.selected = true;
             }
             else
             {
                 luna.selected = false;
             }
         }

         for(let art of articole){
             art.style.display= "grid";
         }
     }
}