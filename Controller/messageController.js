const MessageModel = require("../Models/MessageModel");

module.exports.addMessage = async (req, res, next) => {
    try{
        const {from , to, message} = req.body;
        const data = await MessageModel.create({
            message: {text: message},
            users: [from, to],
            sender: from,
        });
        if(data) {
            return res.json({msg: "Message Added Successfully"});
        }else {
            return res.json({msg: "Failed to Add message to the database"});
        }
    }
    catch(ex) {
        next(ex);
    }
}
module.exports.getAllMessages = async (req, res, next) => {
    try {
        const {from , to} =  req.body;
        const messages = await MessageModel.find({
            users: {
                $all : [from, to],
            },
        })
        .sort({updatedAt : 1 });
        const projectedMessages = messages.map((msg) =>  {
            return {
                fromSelf: msg.sender.toString() === from,
                message: msg.message.text,
            };
        });
        res.json(projectedMessages);
    }
    catch(ex) {
        next(ex);
    }
}