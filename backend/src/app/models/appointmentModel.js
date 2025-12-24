const mongoose = require('mongoose');

const NameSpecialty = {
    'CARDIOLOGY': 'CARDIOLOGY', // tim mạch
    'RESPIRATORY': 'RESPIRATORY', // hô hấp
    'GENERAL': 'GENERAL', // tổng quát
    'NEUROLOGY': 'NEUROLOGY', // thần kinh
    'NUTRITION': 'NUTRITION' // dinh dưỡng
}

const Status = {
    'PENDING': 'PENDING', 
    'CONFIRMED': 'CONFIRMED', 
    'IN_PROGRESS': 'IN_PROGRESS', 
    'COMPLETED': 'COMPLETED', 
    'CANCELLED': 'CANCELLED'
}

const AppointmentSchema = new mongoose.Schema({
    patient:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctor:         { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    specialty:      { type: String, required: true, enum: Object.values(NameSpecialty) },
    appointmentDate:{ type: Date, required: true },
    appointmentTime:{ type: String, required: true }, // Format: "08:00"
    status:         { type: String, required: true, enum: Object.values(Status), default: Status.PENDING }, 
    notes:          { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', AppointmentSchema);
