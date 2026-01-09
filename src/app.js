//console.log("Starting the server");

//Creating the server using express js -> helps you create server, open source framework

const express = require('express');

//creating a new express application

const app = express();

//creating a request handler
app.use('/test',(req,res)=>{
    res.send("Hello from test !");
})

app.use('/hello',(req,res)=>{
 res.send("Hello from hello")
})

app.use('/',(req,res)=>{
res. send("Hello from /");
}) 
//specify the port on which the server will listen
const port = 3000;

// listen to the port
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});
