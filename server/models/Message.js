const mongoose = require("mongoose")
const {Schema,model} = mongoose;
const messageSchema = new Schema({
        text : String,
        file : String,
        sender : {type:mongoose.Schema.Types.ObjectId, ref:"User"},
        recipient: {type:mongoose.Schema.Types.ObjectId, ref:"User"},
    },
        {timestamps: true}
    )
const messageModel = model("Message",messageSchema)
module.exports = messageModel;