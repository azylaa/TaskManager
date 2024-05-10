const mongoose = require("mongoose")
const Schema = mongoose.Schema

const teamModal = new Schema({
    teamName:{type:String,required:true},
    user:{type: mongoose.Types.ObjectId,ref:"users"}
});

const Team = mongoose.model("Team" , teamModal)
module.exports = Team;