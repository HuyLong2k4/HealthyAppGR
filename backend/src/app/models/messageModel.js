const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true,
        index: true
    },
    role: { 
        type: String, 
        enum: ['user', 'model'],
        required: true  
    },
    content: { 
        type: String, 
        required: true  
    }
}, { timestamps: true });

messageSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Message', messageSchema);