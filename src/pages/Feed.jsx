import { getAssets, getUsers } from '../utils/assetLoader';
import Post from '../components/Post';
import { useState, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLikes } from '../context/LikesContext';

const Feed = () => {
    const { feed } = getAssets();
    const users = getUsers();
    const { likesMap } = useLikes(); // Use global like state
    const [sortBy, setSortBy] = useState('latest'); // 'latest' | 'likes'

    // Memoize the assigned users so they don't change on re-render/sort
    const feedWithUsers = useMemo(() => {
        return feed.map(img => {
            const randomUser = users[Math.floor(Math.random() * users.length)] || { name: 'Anonymous', avatar: null };
            return { img, user: randomUser };
        });
    }, [feed, users]);

    const sortedFeed = useMemo(() => {
        if (sortBy === 'latest') return feedWithUsers;

        return [...feedWithUsers].sort((a, b) => {
            const likesA = likesMap[a.img] || 0;
            const likesB = likesMap[b.img] || 0;
            return likesB - likesA;
        });
    }, [feedWithUsers, likesMap, sortBy]);

    return (
        <div className="custom-feed-layout flex flex-col items-center pt-8 pb-20 px-4 w-full h-full">
            {/* Filter Bar - Fluid Width */}
            <div className="w-full flex justify-end mb-6 px-4">
                <div className="relative group z-20">
                    <button className="flex items-center gap-2 text-sm font-semibold text-white/90 hover:text-white transition-colors py-2">
                        {sortBy === 'latest' ? 'Sort by Latest' : 'Sort by Most Liked'}
                        <ChevronDown size={16} />
                    </button>
                    {/* Hover Dropdown - Added pt-2 container to bridge the gap */}
                    <div className="absolute right-0 top-full pt-2 w-40 hidden group-hover:block">
                        <div className="bg-ig-secondary rounded-md shadow-xl border border-ig-separator overflow-hidden">
                            <button
                                onClick={() => setSortBy('latest')}
                                className={`w-full text-left px-4 py-3 text-sm hover:bg-white/10 ${sortBy === 'latest' ? 'text-white' : 'text-gray-400'}`}
                            >
                                Latest
                            </button>
                            <button
                                onClick={() => setSortBy('likes')}
                                className={`w-full text-left px-4 py-3 text-sm hover:bg-white/10 ${sortBy === 'likes' ? 'text-white' : 'text-gray-400'}`}
                            >
                                Most Liked
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-8 w-full">
                {sortedFeed.map(({ img, user }, idx) => (
                    <Post
                        key={img} // Use image path as key for stability
                        image={img}
                        username={user.name}
                        avatar={user.avatar}
                    />
                ))}
                {sortedFeed.length === 0 && <div className="text-center text-gray-500 mt-20">No images in Feed folder :(</div>}
            </div>
        </div>
    );
};

export default Feed;
