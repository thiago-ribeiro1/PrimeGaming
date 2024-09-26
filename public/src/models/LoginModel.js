const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    registrationDate: { type: Date, default: Date.now },
    profileImage: { type: String }
});


module.exports = mongoose.model('Login', UserSchema, 'login');
