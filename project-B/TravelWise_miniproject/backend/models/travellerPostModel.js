import mongoose from 'mongoose';

const travellerPostSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    destination: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    travelDate: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
});

export default mongoose.model('TravellerPost', travellerPostSchema); 