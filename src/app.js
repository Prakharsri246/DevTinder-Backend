const express = require("express");
// First we connect to the database then we start the server
const ConnectDB = require("./config/database");
//getiing schema from user.js
const User = require("./models/user");
const app = express();

// this allow the data to be read in json format
// Reads the json data and converts it into a javascript object.
app.use(express.json());

// Creating A SignUp API 
app.post('/signup',async (req,res)=>{
    // Creating a new instance for the User Model
  const user = new User(req.body)

  //Saving the user in the database and performing error handling 
try {
    await user.save();
    res.send("User Registered Successfully");
}catch(err){
    console.log("User Registration Failed",err.message);
}
})

//Fetching 1 user
app.get('/user', async(req, res)=>{
  const userEmail = req.body.email;
    try {
         const user = await User.find({email:userEmail});
         if(user.length === 0)
         {
            res.status(404).send("User Not Found");
        }
        else {
         res.send(user);
        }
          
    } catch (err) {
        console.log("User Fetching Failed",err.message);
    }
})

// Creating a Feed API
app.get("/feed", async(req,res)=>{
    try {
      const user = await User.find({});  // Passing({}) empty obj will fetch all user info
      res.send(user);
    } catch (error) {
       console.log("User Fetching Failed",err.message);
    }
})

//Deleting a user 
app.delete("/user", async(req, res)=>{
 const userId = req.body.userId;
    try {
      const user = await User.findByIdAndDelete(userId);
      res.send("User Deleted Successfully");
    }
catch (error){
  console.log("User Deletion Failed",error.message);
}})

//Updating a user
app.patch('/user', async(req,res)=>{
const data = req.body;   // Data to be updated
const userId = req.body.userId; // User id to be updated
try {
    const user = await User.findByIdAndUpdate(userId,data, {runValidators:true});  // you need to run validators to validate the data
    res.send("User Updated Successfully");
}catch(error){
    res.status(404).send("User Update Failed"+ error.message);
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


