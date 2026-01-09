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


// HTTP Request Handlers ------------------>
//Get Request
// app.get('/user',(req,res)=>{
//     res.send({userName:"Prakhar", age:28});
// })

//Post Request
// app.post('/user',(req,res)=>{
//     res.send("Saved to Database");
// })

//Delete Request
// app.delete('/user',(req,res)=>{
//     res.send("Deleted from Database");
// })

// Some Advance Concepts for routing 
//...................................................................
// app.get("/a{b}c",(req,res)=>{
//     res.send({userName:"Prakhar", age:28});
// })

///a{b}c this means that b is optional
///ab+c this means a and c should be at last and b should be present one or more times 
// ab * cd this means ab <anything> cd it will work


//.........................................................................
// how do we handle the query parameters

// app.get("/user",(req,res)=>{
//     console.log(req.query);  // accessing query parameters
//     res.send({userName:"Prakhar", age:28});
// });

//........................................................................

//How do we access request params

// app.get("/user/:id",(req,res)=>{
//     console.log(req.params);  // accessing request params
//     res.send({userName:"Prakhar", age:28});
// });

// Comples req paramas

// app.get("/user/:id/:name/:age",(req, res)=>{
//  console.log(req.params);
//  res.send({userName:"Prakhar", age:28});
// })

//specify the port on which the server will listen
const port = 3000;

// listen to the port
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});


// The sequence of the routes is very important.
// It follows the top down approach for matching the routes


// app.use() // this will match for all the HTTP requests 