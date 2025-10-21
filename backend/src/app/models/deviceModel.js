const mongoose = require('mongoose');

const DeviceStatus = ['ACTIVE', 'INACTIVE', 'RETIRED'];

const DeviceSchema = new mongoose.Schema({
    serialNo: { type: String, require: true },
    model : { type: String},
    status: { type: String, enum: DeviceStatus, default: "ACTIVE"},
    user:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Device', DeviceSchema);
