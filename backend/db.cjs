const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/')
.then(() => {
        console.log("MongoDB connected successfully! ✅");
    })
    .catch((err) => {
        console.error("MongoDB connection failed: ❌", err);
    });


const { string } = require ('zod');
const { Schema } = mongoose;

const userSchema = new Schema({
    username: String,
    email: String,
    password: String,
    firstName: String,
    lastName: String
});

const User = mongoose.model('User', userSchema)

//creating the account schema
const accountSchema = new Schema({
    userId: {
        type : mongoose.Schema.Types.ObjectId, //reference to the User model
        ref: 'User',
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
})

const Account = mongoose.model('Account', accountSchema);

module.exports ={
    User,
    Account
}
