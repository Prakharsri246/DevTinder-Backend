//console.log("Starting the server");

//Creating the server using express js -> helps you create server, open source framework

const express = require('express');


//creating a new express application

const app = express();

//app.use('/',(req,res)=>{        //this route will override the other routes
//res. send("Hello from /");
//}) 
//creating a request handler
// app.use('/test',(req,res)=>{
//     res.send("Hello from test !");
// })

// app.use('/hello',(req,res)=>{
//  res.send("Hello from hello")
// })

// app.use('/',(req,res)=>{        
// res. send("Hello from /");
// })

//Get Request
app.get('/user',(req,res)=>{
    res.send({userName:"Prakhar", age:28});
})

//Post Request
app.post('/user',(req,res)=>{
    res.send("Saved to Database");
})
app.delete('/user',(req,res)=>{
    res.send("Deleted from Database");
})

//specify the port on which the server will listen
const port = 3000;

// listen to the port
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});


// The sequence of the routes is very important.
// It follows the top down approach for matching the routes


// app.use() // this will match for all the HTTP requests 