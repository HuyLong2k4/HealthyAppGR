const mongoose = require('mongoose');

const NameSpecialty = {
    'CARDIOLOGY': 'CARDIOLOGY', // tim mạch
    'RESPIRATORY': 'RESPIRATORY', // hô hấp
    'GENERAL': 'GENERAL', // tổng quát
    'NEUROLOGY': 'NEUROLOGY', // thần kinh
    'NUTRITION': 'NUTRITION' // dinh dưỡng
}

const Title = {
    'BS': 'BS',
    'ThS.BS': 'ThS.BS', 
    'TS.BS': 'TS.BS', 
    'PGS.TS': 'PGS.TS', 
    'GS.TS': 'GS.TS'
}
 
const DoctorSchema = new mongoose.Schema({
    user:           { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    specialty:      { type: String, required: true, enum: Object.values(NameSpecialty) },
    title:          { type: String, required: true, enum: Object.values(Title) },
    price:          { type: Number, required: true },
    schedule: [{
      dayOfWeek: {
        type: Number,
        required: true,
        min: 0, // 0 = Sunday
        max: 6  // 6 = Saturday
      },
      startTime: {
        type: String,
        required: true // Format: "08:00"
      },
      endTime: {
        type: String,
        required: true // Format: "17:00"
      },
      slotDuration: {
        type: Number,
        default: 30 // minutes per slot
      },
    }],
}, { timestamps: true });

module.exports = mongoose.model('Doctor', DoctorSchema);
