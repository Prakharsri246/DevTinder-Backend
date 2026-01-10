const express = require("express");
// First we connect to the database then we start the server
const ConnectDB = require("./config/database");
//getiing schema from user.js
const User = require("./models/user");
const app = express();



// Creating A SignUp API 
app.post('/signup',async (req,res)=>{
  const user = new User({
    firstName:"Virat",
    lastName:"Kohli",
    email:"virat@gmail.com",
    password:"123456",
    age:20,
    gender:"Male"
  })
  //Saving the user in the database and performing error handling 


try {
    await user.save();
    res.send("User Registered Successfully");
}catch(err){
    console.log("User Registration Failed",err.message);
}
})



ConnectDB().then(()=>{
    console.log("Database Connected Successfully"); //First we connect to the database then we start the server
    app.listen(3000,()=>{
    console.log("Server is running on port 3000");  // Server has started listining to the requests
})
}).catch(err=>{
    console.log("Database Connection Failed",err);
})


