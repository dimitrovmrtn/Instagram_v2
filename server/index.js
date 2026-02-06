import express from 'express';
import cors from 'cors';
import { getLikes, incrementLike, decrementLike, getUser, toggleFollow, initLikes } from './db.js';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Get all likes
app.get('/api/likes', (req, res) => {
    try {
        const likes = getLikes();
        // Convert array to object for easier lookup { imageId: count }
        const likesMap = likes.reduce((acc, curr) => {
            acc[curr.imageId] = curr.count;
            return acc;
        }, {});
        res.json(likesMap);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/init-likes', (req, res) => {
    try {
        const { imageIds } = req.body;
        if (!Array.isArray(imageIds)) {
            return res.status(400).json({ error: 'imageIds must be an array' });
        }
        initLikes(imageIds);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// User Endpoints
app.get('/api/user/:username', (req, res) => {
    try {
        const user = getUser(req.params.username);
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/user/:username/follow', (req, res) => {
    try {
        const { isFollowing } = req.body;
        const updatedUser = toggleFollow(req.params.username, isFollowing);
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Toggle like (increment/decrement based on client intent or just simple inc/dec endpoints)
// For simplicity, let's have specific action endpoints to avoid "toggle" desync issues
app.post('/api/like/:imageId', (req, res) => {
    const { imageId } = req.params;
    const { action } = req.body; // 'inc' or 'dec'

    if (action === 'inc') {
        const result = incrementLike(imageId);
        res.json(result);
    } else {
        const result = decrementLike(imageId);
        res.json(result);
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
