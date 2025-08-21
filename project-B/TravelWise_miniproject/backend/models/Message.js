import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    relatedPostId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: false
    },
    isRead: {
        type: Boolean,
        default: false
    }
});

export default mongoose.model('Message', messageSchema); 