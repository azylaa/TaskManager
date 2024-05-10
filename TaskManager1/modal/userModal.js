const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    phone: { type: Number, unique: true, required: true },
    gender: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["Head", "Member"], default: "Member" } // Add role field
}, { timestamps: true });

// Compare password method
UserSchema.methods.comparePassword = function(candidatePassword) {
    return this.password === candidatePassword;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
