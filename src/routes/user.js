const express = require('express');
const { userAuth } = require('../middleware/auth');
const ConnectionRequest = require('../models/connectionRequest');

const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName age photoUrl about gender";

// Get all the pending request for loggedIn user
userRouter.get('/user/request/received', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", USER_SAFE_DATA); // returns an array of connect req
        res.json({
            message: "List of connection request",
            data: connectionRequest
        })
    }
    catch (error) {
        res.status(404).send(error.message)
    }

})
userRouter.get('/user/connections', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequest.find({
            $or: [{ toUserId: loggedInUser._id, status: "accepted" },
            { fromUserId: loggedInUser._id, status: "accepted" }]

        }).populate("fromUserId", USER_SAFE_DATA)
        const data = connectionRequest.map((row) => row.fromUserId)

        res.json({
            message: "Connections information",
            data: data
        })

    } catch (error) {
        res.status(404).send('Invalid request')
    }
})

module.exports = userRouter;