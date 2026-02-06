import { getAllUserPosts } from '../utils/assetLoader';
import { Heart } from 'lucide-react';
import { useMemo } from 'react';
import { useLikes } from '../context/LikesContext';
import { useNavigate } from 'react-router-dom';

const Explore = () => {
    const navigate = useNavigate();
    const { likesMap } = useLikes();

    // Get all posts once
    const allPosts = useMemo(() => getAllUserPosts(), []);

    const handleImageClick = (username) => {
        navigate(`/profile/${encodeURIComponent(username)}`);
    };

    return (
        <div className="w-full h-full pt-8 px-4 pb-20">
            <h2 className="text-2xl font-semibold mb-6 px-4">Explore</h2>

            {/* Grid */}
            <div className="grid grid-cols-3 gap-1 md:gap-4">
                {allPosts.map(({ img, user }, idx) => (
                    <div
                        key={`${user.name}-${idx}`}
                        className="aspect-square bg-gray-900 group relative cursor-pointer overflow-hidden"
                        onClick={() => handleImageClick(user.name)}
                    >
                        <img src={img} className="w-full h-full object-cover" alt={`Post by ${user.name}`} />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white font-bold">
                            <div className="flex items-center gap-1">
                                <Heart className="fill-white" size={20} />
                                {(likesMap[img] || 0).toLocaleString()}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {allPosts.length === 0 && (
                <div className="text-center text-gray-500 mt-20">
                    No images found :(
                </div>
            )}
        </div>
    );
};

export default Explore;
