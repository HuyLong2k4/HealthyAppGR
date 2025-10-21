// src/app/models/userModel.js
const mongoose = require('mongoose');

const GENDERS = ['MALE', 'FEMALE', 'OTHER'];
const ROLES = ['PATIENT', 'STAFF', 'ADMIN'];

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, unique: true, sparse: true },
  phone:    { type: String, unique: true, sparse: true },
  passwordHash: { type: String, required: true },
  imageURL: String,
  gender:   { type: String, enum: GENDERS, default: 'OTHER' },
  dob:      { type: Date },
  role:     { type: String, enum: ROLES, required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
