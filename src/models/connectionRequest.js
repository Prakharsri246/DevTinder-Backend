const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({

    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', //referencing to the user collection.Created the link 
        required: true,

    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: {
            values: ["ignored", "accepted", "rejected", "interested"],
            message: `{VALUE} is incorrect satus type`
        },
        required: true
    }
},
    {
        timestamps: true,
    });

// Compound indexing where 1 means asceding 
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 })  // this will enhance the ability to perform search operations in db
// pre hook - middleware , it will be called everytime a connection request is saved, save is event handler
// before we save it we can call this
connectionRequestSchema.pre("save", function () {
    const connectionRequest = this;
    // Check if fromuserId is same as toUserId
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("Cannot send request to yourself");
    }
})

const ConnectionRequest = new mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = ConnectionRequest;