
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: String,
    last_name: String,
    email: String,
});

UserSchema.index({ 'email': 1 });
UserSchema.index({ 'name': 1 });
UserSchema.index({ 'last_name': 1 });

const User = mongoose.model('User', UserSchema);
module.exports = User;
