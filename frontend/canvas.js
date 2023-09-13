let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let pencilColor = document.querySelectorAll(".pencil-color");
let pencilWidthElement = document.querySelector(".pencil-width");
let eraserWidthElement = document.querySelector(".eraser-width");
let download = document.querySelector(".download");
let undo = document.querySelector(".undo");
let redo = document.querySelector(".redo");

let penColor = "black";
let eraserColor = "white";
let penWidth = pencilWidthElement.value;
let eraserWidth = eraserWidthElement.value;
let undoRedoTracker = []; //data
let track = 0; // represent wjich action from tracker array
let mouseDown = false;
//api - access to tool
let tool = canvas.getContext("2d");

tool.strokeStyle = penColor;
tool.lineWidth = penWidth;

// tool.beginPath();//new graphic path
// tool.moveTo(10, 10);//start line
// tool.lineTo(100, 150);//end
// tool.stroke(); //fillcolor
function beginPath(strokeObject){
    tool.beginPath();
    tool.moveTo(strokeObject.x, strokeObject.y);
}

function drawStroke(strokeObject){
    tool.strokeStyle = strokeObject.color;
    toollineWidth = strokeObject.width;
    tool.lineTo(strokeObject.x, strokeObject.y);
    tool.stroke();
}
//mousedown -> start new path , mousemove -> path fill (graphics)
canvas.addEventListener("mousedown", (e)=>{
    mouseDown = true;
    let data = {
        x : e.clientX,
        y : e.clientY
    }
    //send dataa to server
    socket.emit("beginPath", data);
})
canvas.addEventListener("mousemove", (e) =>{
    if(mouseDown){
        let data = {
            x : e.clientX, 
            y : e.clientY,
            color : eraserFlag ? eraserColor : penColor,
            width : eraserFlag ? eraserWidth : penWidth 
        }
        socket.emit("drawStroke", data);
    }
})
canvas.addEventListener("mouseup", (e) =>{
    mouseDown = false;
    let url = canvas.toDataURL();
    undoRedoTracker.push(url);
    track = undoRedoTracker.length-1;
})

download.addEventListener("click", (e)=>{
    let url = canvas.toDataURL();
    let a = document.createElement("a");
    a.href = url;
    a.download = "board.jpg";
    a.click();
})

eraserWidthElement.addEventListener("change", (e)=>{
    eraserWidth = eraserWidthElement.value;
    tool.lineWidth = eraserWidth;
})
eraser.addEventListener("click", (e)=>{
    if(eraserFlag){
        tool.strokeStyle = eraserColor;
        tool.lineWidth = eraserWidth;
    }else{
        tool.strokeStyle = penColor;
        tool.lineWidth = penWidth;
    }
})

pencilColor.forEach((colorElem) =>{
    colorElem.addEventListener("click", (e)=>{
        let color = colorElem.classList[0];
        penColor = color;
        tool.strokeStyle = penColor;
    })
})
pencilWidthElement.addEventListener("change", (e)=>{
    penWidth = pencilWidthElement.value;
    tool.lineWidth = penWidth;
})

function undoRedoCanvas(trackObject){
    track = trackObject.trackValue;
    undoRedoTracker = trackObject.undoRedoTracker;
    let url = undoRedoTracker[track];
    let img = new Image(); //create new image reference element
    img.src = url;
    img.onload = (e) => {
        tool.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
}
redo.addEventListener("click", (e)=>{
    if(track < undoRedoTracker.length-1) track++;
    //track action
    let data = {
        trackValue: track,
        undoRedoTracker
    }
    socket.emit("redoUndo", data);
})

undo.addEventListener("click", (e)=>{
    if(track > 0) track--; 
    // track action
    let data = {
        trackValue: track,
        undoRedoTracker
    }
    socket.emit("redoUndo", data)
})

socket.on("beginPath", (data)=>{
    //data -> data from server
    beginPath(data);
})
socket.on("drawStroke", (data)=>{
    drawStroke(data);
})
socket.on("redoUndo", (data)=>{
    undoRedoCanvas(data);
})