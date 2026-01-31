#console.log("Starting the server");

#Creating the server using express js -> helps you create server, open source framework

const express = require('express');


#creating a new express application

const app = express();

# if there is empty response handler with no res.send() the req will be pending (loop) and then timeout

#app.use('/',(req,res)=>{        #this route will override the other routes
#res. send("Hello from /");
#}) 
#creating a request handler
# app.use('/test',(req,res)=>{
#     res.send("Hello from test !");
# })

# app.use('/hello',(req,res)=>{
#  res.send("Hello from hello")
# })

# app.use('/',(req,res)=>{        
# res. send("Hello from /");
# })


# HTTP Request Handlers ------------------>
#Get Request
# app.get('/user',(req,res)=>{
#     res.send({userName:"Prakhar", age:28});
# })

#Post Request
# app.post('/user',(req,res)=>{
#     res.send("Saved to Database");
# })

#Delete Request
# app.delete('/user',(req,res)=>{
#     res.send("Deleted from Database");
# })

# Some Advance Concepts for routing 
#...................................................................
# app.get("/a{b}c",(req,res)=>{
#     res.send({userName:"Prakhar", age:28});
# })

#/a{b}c this means that b is optional
#/ab+c this means a and c should be at last and b should be present one or more times 
# ab * cd this means ab <anything> cd it will work


#.........................................................................
# how do we handle the query parameters

# app.get("/user",(req,res)=>{
#     console.log(req.query);  # accessing query parameters
#     res.send({userName:"Prakhar", age:28});
# });

#........................................................................

#How do we access request params

# app.get("/user/:id",(req,res)=>{
#     console.log(req.params);  # accessing request params
#     res.send({userName:"Prakhar", age:28});
# });

# Comples req paramas

# app.get("/user/:id/:name/:age",(req, res)=>{
#  console.log(req.params);
#  res.send({userName:"Prakhar", age:28});
# })

#specify the port on which the server will listen
const port = 3000;

# listen to the port
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


# The sequence of the routes is very important.
# It follows the top down approach for matching the routes


# app.use() # this will match for all the HTTP requests 



# Can have multiple reposne handlers
app.use("/user", (req, res, next) => {
    res.send("Hello from user");
    next();
},
    (req, res) => {
        res.send("This will be executed after the next() is called is there is no res send from the previous handler");
    });


#Fetching 1 user
app.get('/user', async (req, res) => {
    const userEmail = req.body.email;
    try {
        const user = await User.find({ email: userEmail });
        if (user.length === 0) {
            res.status(404).send("User Not Found");
        }
        else {
            res.send(user);
        }

    } catch (err) {
        res.status(400).send("User Fetching Failed" + err.message);
        console.log("User Fetching Failed", err.message);
    }
})

# Creating a Feed API
app.get("/feed", async (req, res) => {
    try {
        const user = await User.find({});  # Passing({}) empty obj will fetch all user info
        res.send(user);
    } catch (error) {
        res.status(400).send("User Fetching Failed" + error.message);
        console.log("User Fetching Failed", error.message);
    }
})

# Deleting a user 
 app.delete("/user", async (req, res) => {
     const userId = req.body.userId;
     try {
         const user = await User.findByIdAndDelete(userId);
#         res.send("User Deleted Successfully");
#     }
#     catch (error) {
#         console.log("User Deletion Failed", error.message);
#     }
# })

# Updating a user (Very Important- DS)
app.patch('/user/:userId', async (req, res) => {
    const data = req.body;   # Data to be updated
    const userId = req.params.userId; # User id to be updated
    try {
        #VALIDATIONS FOR ALLOWED FIELDS
        const ALLOWED_FIELDS = ["age", "photoUrl", "about", "gender", "skills"]; #allowed fields to be updated
        const isAllowedFields = Object.keys(data).every(key => ALLOWED_FIELDS.includes(key));
        if (!isAllowedFields) {
            throw new Error("Invalid Update");
        }
        if (data?.skills.length > 10) {
            throw new Error("Skills limit exceeded");
        }
        const user = await User.findByIdAndUpdate(userId, data, { runValidators: true });  # you need to run validators to validate the data
        res.send("User Updated Successfully");
    } catch (error) {
        res.status(404).send("User Update Failed" + error.message);
        console.log("User Update Failed", error.message);
    }
})
