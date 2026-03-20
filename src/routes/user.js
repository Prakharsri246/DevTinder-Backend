const express = require('express');
const { userAuth } = require('../middleware/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require("../models/user");
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
        res.status(200).json({
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

        }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA)
        const data = connectionRequest.map((row) => {
            if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId;
            }
            return row.fromUserId;
        })

        res.status(200).json({
            message: "Connections information",
            data: data
        })

    } catch (error) {
        res.status(404).send('Invalid request')
    }
})
// Feed API
userRouter.get('/feed', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;

        const skip = (page - 1) * limit;

        const connectionRequest = await ConnectionRequest.find({
            $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }]
        }).select("fromUserId toUserId")

        const hideUsersFromFeed = new Set();;
        connectionRequest.forEach((req) => {
            hideUsersFromFeed.add(req.fromUserId);
            hideUsersFromFeed.add(req.toUserId);
        })

        const user = await User.find({
            $and: [{ _id: { $nin: Array.from(hideUsersFromFeed) } }, { _id: { $ne: loggedInUser._id } }]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit)
        res.send(user)

    } catch (error) {
        res.status(404).json({ message: 'Invalid request' })
    }
})
module.exports = userRouter;