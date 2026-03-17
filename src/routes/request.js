const express = require('express');
const { userAuth } = require("../middleware/auth.js");
const ConnectionRequest = require('../models/connectionRequest.js');
const User = require('../models/user');
const requestRouter = express.Router();


//Send connection request - handling 
requestRouter.post('/request/send/:status/:toUserId', userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id // loggedin user id
        const toUserId = req.params.toUserId;
        const status = req.params.status;
        // Validate the status
        const allowedStatus = ["ignored", "interested"]
        if (!allowedStatus.includes(status)) {
            return res.status(400).send({
                message: "Invalid status type" + status
            });
        }
        // validate if to user existss
        const toUser = await User.findById(toUserId)
        if (!toUser) {
            return res.status(404).send({
                message: "User Not found",
            })
        }

        // check if there is an existing connection request or is send from B to A 
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [{ fromUserId, toUserId }, { fromUserId: toUserId, toUserId: fromUserId }]
        })
        if (existingConnectionRequest) {
            return res.status(400).send({
                message: "Request already send"
            })
        }
        const connectionRequest = new ConnectionRequest({
            fromUserId, toUserId, status
        })

        const data = await connectionRequest.save();
        res.json({
            message: req.user.firstName + " is " + status + " in " + toUser.firstName,
            data
        })

    } catch (error) {
        res.status(400).send(error.message);
    }
})

// Recever end requests
requestRouter.post('/request/review/:status/:requestId', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user; // check if user is loggedIn
        const allowedStatus = ["accepted", "rejected"]
        const { status, requestId } = req.params
        if (!allowedStatus.includes(status)) {
            return res.status(404).send({ message: "Invalid status code" });
        }
        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested"
        });
        if (!connectionRequest) {
            return res.status(404).send({ message: " The request Id not present" })
        }
        connectionRequest.status = status;
        const data = await connectionRequest.save();
        res.json({ message: "Connection request" + status, data })

    } catch (error) {
        req.status(400).send(error.message);
    }
})

module.exports = requestRouter;