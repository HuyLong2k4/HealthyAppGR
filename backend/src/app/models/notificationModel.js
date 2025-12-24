const mongoose = require('mongoose');

const TYPE = {
    'NORMAL': 'NORMAL',
    'WARNING': 'WARNING'
};

const notificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: Object.values(TYPE) },
    title: { type: String, required: true },
    payload: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('notification', notificationSchema);

