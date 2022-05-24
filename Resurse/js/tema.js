window.addEventListener("DOMContentLoaded", function(){
    var tema = localStorage.getItem("tema");
    if(tema) {
        if(tema == "<i class=\"fa-solid fa-moon\" style='color: white;'></i>"){
            document.body.classList.add("dark")
        }
        document.getElementById("btn_tema").innerHTML = tema;
    }
    else {
        localStorage.setItem("tema", "<i class=\"fas fa-sun\"></i>" )
    }
    document.getElementById("btn_tema").innerHTML = tema;
    document.getElementById("btn_tema").onclick=function(){
        tema=localStorage.getItem("tema");
        if(tema) {
            if(tema == "<i class=\"fas fa-sun\"></i>"){
                localStorage.setItem("tema", "<i class=\"fa-solid fa-moon\" style='color: white;'></i>" )
                document.getElementById("btn_tema").innerHTML = "<i class=\"fa-solid fa-moon\" style='color: white;'></i>" ;
            }
            else{
                localStorage.setItem("tema", "<i class=\"fas fa-sun\"></i>" )
                document.getElementById("btn_tema").innerHTML = "<i class=\"fas fa-sun\"></i>";
            }
        }
        else{
            console.log("imposibil")
        }

        document.body.classList.toggle("dark");
    }
})