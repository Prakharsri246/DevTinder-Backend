const express = require("express");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
// First we connect to the database then we start the server
const ConnectDB = require("./config/database");
//getiing schema from user.js
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validateSignUp");
const app = express();

// this allow the data to be read in json format
// Reads the json data and converts it into a javascript object.
app.use(express.json());

// Added cookie parser to read the cookie
app.use(cookieParser());

// Creating A SignUp API 
app.post('/signup', async (req, res) => {
    //Saving the user in the database and performing error handling 
    try {
        //Validate the data
        validateSignUpData(req);

        // destructure the data
        const { firstName, lastName, email, password, age, gender, photoUrl, skills } = req.body;
        //Encrypting the password
        const hashPassword = await bcrypt.hash(password, 10);

        // Creating a new instance for the User Model
        const user = new User({
            firstName,
            lastName,
            email,
            password: hashPassword,
            age,
            gender,
            photoUrl,
            skills
        })
        await user.save();
        res.send("User Registered Successfully");
    } catch (error) {
        res.status(400).send(error.message);
        console.log("ERROR:" + error.message);
    }
})


//login API
app.post('/login', async (req, res) => {

    try {
        const { email, password } = req.body;
        // checks if email is present in db or not
        const isEmail = await User.findOne({ email: email })
        if (!isEmail) {
            console.log("why")
            throw new Error("Invalid credentials")
        }
        const isPassword = await bcrypt.compare(password, isEmail.password)
        if (isPassword) {

            // Creating A JWT TOKEN
            const token = await jwt.sign({ _id: isEmail._id }, "Dev@Tinder$123")
            //Add the token to cookie 
            res.cookie("token", token);
            res.send("User Logged in Successfully")
        } else {
            throw new Error("Invalid credentials")
        }


    } catch (error) {
        res.status(400).send("Error:" + error.message);
    }


})

//Profile API
app.get('/profile', async (req, res) => {
    try {
        const cookies = req.cookies;
        const { token } = cookies;
        if (!token) {
            throw new Error("Invalid Token");
        }
        // Validate the token
        const decodedMsg = await jwt.verify(token, "Dev@Tinder$123")
        const { _id } = decodedMsg;
        const user = await User.findById(_id);
        if (!user) {
            throw new Error("User Does Not exist");
        }

        console.log(decodedMsg);
        console.log(cookies);
        res.send(user);
    }
    catch (error) {
        res.status(404).send(error.message)
    }
})

//Fetching 1 user
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

// Creating a Feed API
app.get("/feed", async (req, res) => {
    try {
        const user = await User.find({});  // Passing({}) empty obj will fetch all user info
        res.send(user);
    } catch (error) {
        res.status(400).send("User Fetching Failed" + error.message);
        console.log("User Fetching Failed", error.message);
    }
})

//Deleting a user 
app.delete("/user", async (req, res) => {
    const userId = req.body.userId;
    try {
        const user = await User.findByIdAndDelete(userId);
        res.send("User Deleted Successfully");
    }
    catch (error) {
        console.log("User Deletion Failed", error.message);
    }
})

//Updating a user (Very Important- DS)
app.patch('/user/:userId', async (req, res) => {
    const data = req.body;   // Data to be updated
    const userId = req.params.userId; // User id to be updated
    try {
        //VALIDATIONS FOR ALLOWED FIELDS
        const ALLOWED_FIELDS = ["age", "photoUrl", "about", "gender", "skills"]; //allowed fields to be updated
        const isAllowedFields = Object.keys(data).every(key => ALLOWED_FIELDS.includes(key));
        if (!isAllowedFields) {
            throw new Error("Invalid Update");
        }
        if (data?.skills.length > 10) {
            throw new Error("Skills limit exceeded");
        }
        const user = await User.findByIdAndUpdate(userId, data, { runValidators: true });  // you need to run validators to validate the data
        res.send("User Updated Successfully");
    } catch (error) {
        res.status(404).send("User Update Failed" + error.message);
        console.log("User Update Failed", error.message);
    }
})

// Connecting it to the DB
ConnectDB().then(() => {
    console.log("Database Connected Successfully"); //First we connect to the database then we start the server
    app.listen(3000, () => {
        console.log("Server is running on port 3000");  // Server has started listining to the requests
    })
}).catch(err => {
    console.log("Database Connection Failed", err);
})


