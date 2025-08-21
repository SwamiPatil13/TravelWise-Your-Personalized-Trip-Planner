import express from 'express';
import Message from '../models/Message.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Send a message
router.post('/send', auth, async (req, res) => {
    try {
        const { receiverId, message, relatedPostId } = req.body;
        const newMessage = new Message({
            senderId: req.user._id,
            receiverId,
            message,
            relatedPostId,
            isRead: false
        });
        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get messages between two users
router.get('/conversation/:userId', auth, async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [
                { senderId: req.user._id, receiverId: req.params.userId },
                { senderId: req.params.userId, receiverId: req.user._id }
            ]
        }).sort({ timestamp: 1 });

        // Mark messages as read when fetched
        await Message.updateMany(
            { 
                senderId: req.params.userId, 
                receiverId: req.user._id,
                isRead: false 
            },
            { isRead: true }
        );

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get unread messages count
router.get('/unread-count', auth, async (req, res) => {
    try {
        const count = await Message.countDocuments({
            receiverId: req.user._id,
            isRead: false
        });
        res.json({ count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get recent messages
router.get('/recent', auth, async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [
                { senderId: req.user._id },
                { receiverId: req.user._id }
            ]
        })
        .sort({ timestamp: -1 })
        .limit(5)
        .populate('senderId', 'name')
        .populate('receiverId', 'name');

        // Get unique conversations
        const conversations = messages.reduce((acc, message) => {
            const otherUserId = message.senderId._id.toString() === req.user._id.toString() 
                ? message.receiverId._id.toString() 
                : message.senderId._id.toString();
            
            if (!acc[otherUserId]) {
                acc[otherUserId] = message;
            }
            return acc;
        }, {});

        res.json(Object.values(conversations));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router; 