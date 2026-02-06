import { Heart, MessageCircle, Send, Bookmark } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLikes } from '../context/LikesContext';

// Generate random timestamp
const getRandomTimestamp = () => {
    const timestamps = [
        '1 minute ago',
        '5 minutes ago',
        '15 minutes ago',
        '30 minutes ago',
        '45 minutes ago',
        '1 hour ago',
        '2 hours ago',
        '3 hours ago',
        '5 hours ago',
        '8 hours ago',
        '12 hours ago',
        '18 hours ago',
        '1 day ago',
        '2 days ago',
        '3 days ago',
        '5 days ago',
        '1 week ago',
        '2 weeks ago',
        '3 weeks ago',
        '1 month ago',
        '2 months ago',
        '3 months ago',
        '4 months ago',
        '5 months ago',
        '6 months ago',
        '7 months ago',
        '8 months ago',
        '9 months ago',
        '10 months ago',
        '11 months ago'
    ];
    return timestamps[Math.floor(Math.random() * timestamps.length)];
};

const Post = ({ image, username, avatar, description = "Found this interesting image in the archives... #files #leak" }) => {
    const [liked, setLiked] = useState(false);
    const [showHeart, setShowHeart] = useState(false);
    const { likesMap, handleLike } = useLikes();
    const navigate = useNavigate();

    // Generate timestamp once per post (won't change on re-render)
    const timestamp = useMemo(() => getRandomTimestamp(), [image]);

    // Unique ID for the image - simply the filename/path
    const imageId = image;
    const likes = likesMap[imageId] || 0;

    const toggleLike = () => {
        handleLike(imageId, liked);
        setLiked(!liked);

        // Show heart animation
        if (!liked) {
            setShowHeart(true);
        }
    };

    // Auto-hide heart after 1.5 seconds
    useEffect(() => {
        if (showHeart) {
            const timer = setTimeout(() => {
                setShowHeart(false);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [showHeart]);

    const handleUsernameClick = (e) => {
        e.preventDefault();
        navigate(`/profile/${encodeURIComponent(username)}`);
    };

    return (
        <div className="border border-ig-separator rounded-sm bg-black mb-8 w-full mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-ig-story-ring p-[2px]">
                        <div className="w-full h-full rounded-full border-2 border-black overflow-hidden bg-gray-800">
                            <img src={avatar || '/placeholder-user.jpg'} alt={username} className="w-full h-full object-cover" />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span
                            className="font-semibold text-sm leading-none cursor-pointer hover:opacity-70 transition-opacity"
                            onClick={handleUsernameClick}
                        >
                            {username}
                        </span>
                        <span className="text-xs text-gray-400 mt-0.5">Little Saint James Island in U. S. Virgin Islands</span>
                    </div>
                </div>
                <button className="text-white">...</button>
            </div>

            {/* Image */}
            <div className="w-full bg-gray-900 overflow-hidden relative" onDoubleClick={toggleLike}>
                <img src={image} alt="Post" className="w-full h-auto object-contain" />
                {showHeart && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center text-white pointer-events-none"
                    >
                        <Heart size={120} fill="white" />
                    </motion.div>
                )}
            </div>

            {/* Actions */}
            <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-4">
                        <button onClick={toggleLike} className="hover:opacity-70 transition-opacity">
                            <Heart size={28} className={liked ? "fill-red-500 text-red-500" : ""} />
                        </button>
                        <button className="hover:opacity-70 transition-opacity"><MessageCircle size={28} /></button>
                        <button className="hover:opacity-70 transition-opacity"><Send size={28} /></button>
                    </div>
                    <button className="hover:opacity-70 transition-opacity"><Bookmark size={28} /></button>
                </div>

                <div className="font-semibold text-sm mb-1">{likes.toLocaleString()} likes</div>

                <div className="text-sm">
                    <span
                        className="font-semibold mr-2 cursor-pointer hover:opacity-70 transition-opacity"
                        onClick={handleUsernameClick}
                    >
                        {username}
                    </span>
                    <span className="text-gray-300">{description}</span>
                </div>
                <div className="text-gray-500 text-xs mt-1">{timestamp}</div>
            </div>
        </div>
    );
};

export default Post;
