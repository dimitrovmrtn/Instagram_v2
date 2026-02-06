import { getAllUserPosts, getUsers } from '../utils/assetLoader';
import Post from '../components/Post';
import { useState, useMemo, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLikes } from '../context/LikesContext';

const DESCRIPTIONS = [
    "Just found this in the archives... #files",
    "Can't believe this is public now 👁️",
    "The truth is out there.",
    "Data point #4021 approved.",
    "Witnessing history.",
    "Encrypted transmission received.",
    "Loading simulation...",
    "System override engaged.",
    "New evidence surfaced.",
    "Timeline diverging."
];

const POSTS_PER_LOAD = 12; // Load 12 posts at a time

const Feed = () => {
    // Determine the full feed once on mount (so random shuffle doesn't re-run constantly)
    const initialFeed = useMemo(() => {
        const posts = getAllUserPosts();
        // Deterministically assign a description to each post based on its image path/name length
        return posts.map(post => ({
            ...post,
            description: DESCRIPTIONS[post.img.length % DESCRIPTIONS.length]
        }));
    }, []);

    const { likesMap } = useLikes();
    const [sortBy, setSortBy] = useState('latest');
    const [displayedCount, setDisplayedCount] = useState(POSTS_PER_LOAD);
    const loadMoreRef = useRef(null);

    const sortedFeed = useMemo(() => {
        if (sortBy === 'latest') return initialFeed;

        return [...initialFeed].sort((a, b) => {
            const likesA = likesMap[a.img] || 0;
            const likesB = likesMap[b.img] || 0;
            return likesB - likesA;
        });
    }, [initialFeed, likesMap, sortBy]);

    // Reset displayed count when sort changes
    useEffect(() => {
        setDisplayedCount(POSTS_PER_LOAD);
    }, [sortBy]);

    // Infinite scroll observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && displayedCount < sortedFeed.length) {
                    setDisplayedCount(prev => Math.min(prev + POSTS_PER_LOAD, sortedFeed.length));
                }
            },
            { threshold: 0.1 }
        );

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => {
            if (loadMoreRef.current) {
                observer.unobserve(loadMoreRef.current);
            }
        };
    }, [displayedCount, sortedFeed.length]);

    const displayedPosts = sortedFeed.slice(0, displayedCount);

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
                {displayedPosts.map(({ img, user, description }, idx) => (
                    <Post
                        key={img}
                        image={img}
                        username={user.name}
                        avatar={user.avatar}
                        description={description}
                    />
                ))}
                {sortedFeed.length === 0 && <div className="text-center text-gray-500 mt-20">No images in user folders :(</div>}

                {/* Load more trigger */}
                {displayedCount < sortedFeed.length && (
                    <div ref={loadMoreRef} className="text-center text-gray-500 py-8">
                        Loading more posts...
                    </div>
                )}

                {displayedCount >= sortedFeed.length && sortedFeed.length > 0 && (
                    <div className="text-center text-gray-500 py-8">
                        You've reached the end!
                    </div>
                )}
            </div>
        </div>
    );
};

export default Feed;

