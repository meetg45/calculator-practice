const displayinput = document.querySelector(".display-area input");
const displaybtn = document.querySelectorAll(".buttons-area");

displaybtn.forEach(a => {
  a.addEventListener("click",myfun);
});

function myfun(e){
    if(e.target.tagName === "BUTTON"){
        const val=e.target.innerText;
        displayinput.value+=val;
        displayinput.scrollLeft = displayinput.scrollWidth;
    }
}
