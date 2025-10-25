const mongoose = require('mongoose');

const STATUS = ['IN_PROGRESS', 'COMPLETED', 'CANCELLED']; 

const EnrollmentSchema = new mongoose.Schema({
    status :        { type: String, enum: STATUS, default: "IN_PROGRESS"},
    progressPct:    { type: mongoose.Schema.Types.Decimal128, default: 0.0 },
    completeAt:     { type: Date },
    enrolledAt:     { type: Date, default: Date.now },
    user:           { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course:         { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true }
}, { timestamps: true });

EnrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', EnrollmentSchema);