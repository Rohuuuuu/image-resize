const mongoose = require("mongoose");

// Schema validation for better data integrity
const EmployeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: (v) => /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}/.test(v),
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
});

// Define the model using the schema
const EmployeeModel = mongoose.model("employees", EmployeeSchema);

// Ensure the model is being exported properly
module.exports = EmployeeModel;
