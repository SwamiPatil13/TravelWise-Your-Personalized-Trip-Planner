import mongoose from 'mongoose';

const travellerPostSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // you'll link this to a User model later
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  interests: {
    type: [String], // e.g. ['hiking', 'food', 'nature']
    default: [],
  },
  isOpenToConnect: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true
});

const TravellerPost = mongoose.model('TravellerPost', travellerPostSchema);
export default TravellerPost;
