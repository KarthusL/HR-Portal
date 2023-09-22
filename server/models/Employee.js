const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmployeeSchema = new Schema({
  uname: { type: String, unique: true, required: true },
  email: { type: String, unique: true },
  psw: { type: String, required: true },
  role: { type: String, enum: ['normal', 'hr'] },
});

const Employee = mongoose.model('Employee', EmployeeSchema);
module.exports = Employee;
