const mongoose = require("mongoose");
const {Schema} = mongoose;

const userSchema = new Schema(
    {
        name: {
            type: String,
            trim: true,
            required: [true, "Name is required"]
        },
        email: {
            type: String,
            trim: true,
            required: [true, "email is required"],
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        roll: {
            type: Number,
            default:1
        }
    },
    {timestamps: true, versionKey: false}
);

const User = mongoose.model("Users", userSchema);
module.exports = User;
