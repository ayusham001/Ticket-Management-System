const mongoose = require('mongoose');

module.exports.init= async function(){
    await mongoose.connect(
        'mongodb+srv://ayush001:uXSWzBaSg3fElwBB@cluster0.xnla8rj.mongodb.net/TicketManagementSystem?retryWrites=true&w=majority'
        )
}