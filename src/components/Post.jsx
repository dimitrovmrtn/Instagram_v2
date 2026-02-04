import { Heart, MessageCircle, Send, Bookmark } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLikes } from '../context/LikesContext';

const Post = ({ image, username, avatar }) => {
    const [liked, setLiked] = useState(false);
    const { likesMap, handleLike } = useLikes();

    // Unique ID for the image - simply the filename/path
    const imageId = image;
    const likes = likesMap[imageId] || 0;

    const toggleLike = () => {
        handleLike(imageId, liked);
        setLiked(!liked);
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
                        <span className="font-semibold text-sm leading-none">{username}</span>
                        <span className="text-xs text-gray-400 mt-0.5">Little Saint James Island in U. S. Virgin Islands</span>
                    </div>
                </div>
                <button className="text-white">...</button>
            </div>

            {/* Image */}
            <div className="w-full bg-gray-900 overflow-hidden relative" onDoubleClick={toggleLike}>
                <img src={image} alt="Post" className="w-full h-auto object-contain" loading="lazy" />
                {liked && (
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
                    <span className="font-semibold mr-2">{username}</span>
                    <span className="text-gray-300">Found this interesting image in the archives... #files #leak</span>
                </div>
                <div className="text-gray-500 text-xs mt-1 uppercase">2 HOURS AGO</div>
            </div>
        </div>
    );
};

export default Post;
