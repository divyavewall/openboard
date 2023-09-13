let toolsContainer = document.querySelector(".tools-container");
let optionsContainer = document.querySelector(".options-container");
let pencilToolContainer = document.querySelector(".pencil-tool-container");
let eraserToolContainer = document.querySelector(".eraser-tool-container");
let upload = document.querySelector(".upload");
let pencil = document.querySelector(".pencil");
let eraser = document.querySelector(".eraser");
let pencilFlag = false;
let eraserFlag = false;
let optionsFlag = true;
let sticky = document.querySelector(".sticky-note");
//true to show hamburger false to hide tools
optionsContainer.addEventListener("click", (e) => {
    optionsFlag = !optionsFlag;
    if(optionsFlag) openTools();
    else closeTools();
})

//function to open tools
function openTools(){
    let iconElement = optionsContainer.children[0];
    iconElement.classList.remove("fa-times");
    iconElement.classList.add("fa-bars");
    toolsContainer.style.display = "flex";
}

function closeTools(){
    let iconElement = optionsContainer.children[0];
    iconElement.classList.remove("fa-bars");
    iconElement.classList.add("fa-times");
    toolsContainer.style.display = "none";
    pencilToolContainer.style.display = "none";
    eraserToolContainer.style.display = "none";
}

pencil.addEventListener("click", (e) =>{
    //true - show pencil tool, flase - hide
    pencilFlag = !pencilFlag;
    if(pencilFlag) pencilToolContainer.style.display = "block";
    else pencilToolContainer.style.display = "none";
})

eraser.addEventListener("click", (e) =>{
    //true - show eraser tool, flase - hide
    eraserFlag = !eraserFlag;
    if(eraserFlag) eraserToolContainer.style.display = "flex";
    else eraserToolContainer.style.display = "none";
})
function createSticky(stickyTemplateHTML){
    let stickyContainer = document.createElement("div");
        stickyContainer.setAttribute("class", "sticky-container");
        stickyContainer.innerHTML = stickyTemplateHTML;
        document.body.appendChild(stickyContainer);
        let minimize = stickyContainer.querySelector(".minimize");
        let remove = stickyContainer.querySelector(".remove");
        stickyNoteActions(minimize, remove, stickyContainer);
    
        stickyContainer.onmousedown = function(event) {
          dragAndDrop(stickyContainer, event);
        };
          
        stickyContainer.ondragstart = function() {
            return false;
        };
}
//----------------------------upload-------------------------------------
upload.addEventListener("click", (e)=>{
    //open file explorer
    let input = document.createElement("input");
    input.setAttribute("type", "file");
    input.click();

    input.addEventListener("change", (e)=>{
        let file = input.files[0];
        let url = URL.createObjectURL(file);
        let stickyTemplateHTML = `
        <div class="header-container">
        <div class="minimize"></div>
        <div class="remove"></div>
        </div>
        <div class="note-container">
        <img src="${url}"/>
        </div>
        `
        createSticky(stickyTemplateHTML);

    })
})
//-------------------------------Sticky-notes----------------------------------------------
sticky.addEventListener("click", (e)=>{
    let stickyTemplateHTML = `
        <div class="header-container">
            <div class="minimize"></div>
            <div class="remove"></div>
        </div>
        <div class="note-container">
            <textarea>Type here</textarea>
        </div>
    `;
    createSticky(stickyTemplateHTML);
})
//function for minimizing the sticky note and closing the sticky note
function stickyNoteActions(minimize, remove, stickyContainer){
    remove.addEventListener("click", (e)=>{
        stickyContainer.remove();
    })
    minimize.addEventListener("click", (e)=>{
        let noteCont = stickyContainer.querySelector(".note-container");
        let display = getComputedStyle(noteCont).getPropertyValue("display");
        if(display === "none") noteCont.style.display = "block";
        else noteCont.style.display = "none"; 
    })
}

//drag and drp fuction for sticky notes
function dragAndDrop(element, event){
    let shiftX = event.clientX - element.getBoundingClientRect().left;
    let shiftY = event.clientY - element.getBoundingClientRect().top;
      
    element.style.position = 'absolute';
    element.style.zIndex = 1000;
    moveAt(event.pageX, event.pageY);
    // moves the element at (pageX, pageY) coordinates
    // taking initial shifts into account
    function moveAt(pageX, pageY) {
        element.style.left = pageX - shiftX + 'px';
        element.style.top = pageY - shiftY + 'px';
    }
      
    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }
    // move the element on mousemove
    document.addEventListener('mousemove', onMouseMove);
    // drop the element, remove unneeded handlers
    element.onmouseup = function() {
      document.removeEventListener('mousemove', onMouseMove);
      element.onmouseup = null;
    };
}