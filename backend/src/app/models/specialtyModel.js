const mongoose = require('mongoose');

const NameSpecialty = {
    'CARDIOLOGY': 'CARDIOLOGY', // tim mạch
    'RESPIRATORY': 'RESPIRATORY', // hô hấp
     'GENERAL': 'GENERAL', // tổng quát
    'NEUROLOGY': 'NEUROLOGY', // thần kinh
    'NUTRITION': 'NUTRITION' // dinh dưỡng
}

const SpecialtySchema = new mongoose.Schema({
    name:        { type: String, required: true, enum: Object.values(NameSpecialty), unique: true },

}, { timestamps: true });

module.exports = {
    Specialty: mongoose.model('Specialty', SpecialtySchema),
};