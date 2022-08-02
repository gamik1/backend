const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const EmployeeSchema = new Schema({
    id: Number,
    firstName: String,
    lastName: String,
    age: Number,
    dateOfJoining: {type: Date, default: new Date()},
    title: String,
    department: String,
    employeeType: String,
    currentStatus: Number   

});

const Employee = mongoose.model('Employee', EmployeeSchema, "employees");
module.exports = Employee;


