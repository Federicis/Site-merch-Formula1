

window.addEventListener("load",function(){
    if(localStorage.getItem("tema") == null) {

        document.getElementById("btn_tema").innerHTML = "<i class=\"fas fa-sun\"></i>"
    }
    else {
        document.getElementById("btn_tema").innerHTML = "<i class=\"fa-solid fa-moon\" style='color: white;'></i>"
    }
    document.getElementById("btn_tema").onclick=function(){
        var tema=localStorage.getItem("tema");
        if(tema) {
            localStorage.removeItem("tema");
            document.getElementById("btn_tema").innerHTML = "<i class=\"fas fa-sun\"></i>"
        }
        else{
            localStorage.setItem("tema", "dark");
            document.getElementById("btn_tema").innerHTML = "<i class=\"fa-solid fa-moon\" style='color: white;'></i>"
        }


        document.body.classList.toggle("dark");
        document.getElementById("btn_tema").classList.toggle("darkstyle");
    }
})