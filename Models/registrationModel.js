const mongoose = require('mongoose');
mongoose.set("strictQuery", false);
mongoose.connect('mongodb://localhost:27017/taskRegistration').then(() => {
    console.log('Connection Successful');
}).catch((err) => console.log(err));



const schema = new mongoose.Schema({
    firstName: {type: String, required: true},
    middleName: {type: String, required: true},
    lastName: {type: String, required: true},
    Email: {type: String, required: true, unique: true},
    Password: {type: String, required: true},
    confirmPassword: {type: String, required: true},
    role: {type: String, required: true},
    department: {type: String, required: true},
    token: {type: String, required: true},
    createdTime: {type: Date, default: Date.now},
    updatedTime: {type: Date, default: Date.now}
});

const registration = mongoose.model('registration', schema);

module.exports = registration;