const mongoose =require('mongoose')

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    name: String,
    email: String,
    profilePic: String
});

const AdminSchema = new mongoose.Schema({
    username: String,
    password: String,
    name: String,
    email: String,
    category: String,
    profilePic: String
});

const User=mongoose.model("User",UserSchema)
const Admin=mongoose.model("Admin",AdminSchema)

module.exports = {
    User,
    Admin,
};