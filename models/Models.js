const mongoose =require('mongoose')

const Ticket = new mongoose.Schema({
    username: String,
    name: String,
    email: String,
    profilePic: String,
    title: String,
    productId: String,
    status: String,
    date: String,
    category: String,
    priority: String,
    discription: String,
});

const returnTicket=mongoose.model("Return Ticket",Ticket)
const replaceTicket=mongoose.model("Replace Ticket",Ticket)
const Technical_Issues=mongoose.model("Technical Issues",Ticket)
const Help_Support=mongoose.model("Help and Support",Ticket)
const Sales_Support=mongoose.model("Sales Support",Ticket)
const Others=mongoose.model("Others",Ticket)

module.exports = {
    returnTicket,
    replaceTicket,
    Technical_Issues,
    Help_Support,
    Sales_Support,
    Others
};