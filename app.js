const express = require("express");
const socket = require("socket.io");

const app = express(); // application initialisation -> intialized and server ready
app.use(express.static("frontend"));
let port = 3000;
let server = app.listen(port, () =>{
    console.log("Listening to port " + port);
});

let io = socket(server);
io.on("connection", (socket)=>{
    console.log("socket connection");
    //recieved data
    socket.on("beginPath", (data) =>{
        //data -> data from frontend
        //transfer data to all connected computers
        io.sockets.emit("beginPath", data); 
    })
    socket.on("drawStroke", (data)=>{
        io.sockets.emit("drawStroke", data);
    })
    socket.on("redoUndo", (data)=>{
        io.sockets.emit("redoUndo", 
        data);
    })
})