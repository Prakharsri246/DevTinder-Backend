const express = require('express');
const { userAuth } = require('../middleware/auth');
const ConnectionRequest = require('../models/connectionRequest');

const userRouter = express.Router();

// Get all the pending request for loggedIn user
userRouter.get('/user/request/received', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }); // returns an array of connect req
        res.json({
            message: "List of connection request",
            data: connectionRequest
        })
    }
    catch (error) {
        res.status(404).send(error.message)
    }

})

module.exports = userRouter;