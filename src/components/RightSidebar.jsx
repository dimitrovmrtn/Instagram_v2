import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import dexButton from '../../assets/dex_button.png';
import { ExternalLink, Copy, Check } from 'lucide-react';
import { getUsers } from '../utils/assetLoader';

const API_URL = 'https://jinstagram-server.onrender.com/api';

const RightSidebar = () => {
    const [copied, setCopied] = useState(false);
    const [followStates, setFollowStates] = useState({});
    const navigate = useNavigate();
    const tokenAddress = "Updating soon... Check X!";

    // Get 3 random users for suggestions
    const suggestedUsers = useMemo(() => {
        const allUsers = getUsers();
        const shuffled = [...allUsers].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, 3);
    }, []);

    const handleCopy = () => {
        navigator.clipboard.writeText(tokenAddress);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleFollow = async (username) => {
        const isCurrentlyFollowing = followStates[username] || false;
        const newFollowingState = !isCurrentlyFollowing;

        // Optimistic update
        setFollowStates(prev => ({
            ...prev,
            [username]: newFollowingState
        }));

        try {
            await fetch(`${API_URL}/user/${encodeURIComponent(username)}/follow`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isFollowing: isCurrentlyFollowing })
            });
        } catch (err) {
            console.error("Failed to update follow", err);
            // Revert on error
            setFollowStates(prev => ({
                ...prev,
                [username]: isCurrentlyFollowing
            }));
        }
    };

    const handleUserClick = (username) => {
        navigate(`/profile/${encodeURIComponent(username)}`);
    };

    return (
        <div className="hidden lg:block w-[320px] pl-8 py-8 pr-4">
            <div className="flex flex-col gap-4 fixed w-[300px]">
                {/* Top Row: Dex + X */}
                <div className="flex items-center gap-4">
                    {/* DexScreener Button - 4x smaller */}
                    <a
                        href="https://dexscreener.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block transition-transform hover:scale-105"
                    >
                        <img
                            src={dexButton}
                            alt="View on DexScreener"
                            className="w-16 h-16 rounded-lg shadow-lg border border-ig-separator object-cover"
                        />
                    </a>

                    {/* X (Twitter) Link - Icon only */}
                    <a
                        href="https://x.com/jinstagram_app"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-16 h-16 bg-ig-secondary rounded-lg hover:bg-gray-800 transition-colors border border-ig-separator group"
                        title="Follow on X"
                    >
                        <svg viewBox="0 0 24 24" aria-hidden="true" className="w-8 h-8 fill-white">
                            <g>
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                            </g>
                        </svg>
                    </a>
                </div>

                {/* Token Address Copy */}
                <div className="flex flex-col gap-2">
                    <button
                        onClick={handleCopy}
                        className="flex items-center justify-between p-3 bg-ig-secondary rounded-lg hover:bg-gray-800 transition-colors border border-ig-separator group text-left w-full"
                    >
                        <span className="font-mono text-xs truncate mr-2 text-gray-300">
                            {tokenAddress}
                        </span>
                        {copied ? (
                            <Check size={16} className="text-green-500 flex-shrink-0" />
                        ) : (
                            <Copy size={16} className="text-gray-400 group-hover:text-white flex-shrink-0" />
                        )}
                    </button>
                    {copied && (
                        <span className="text-xs text-green-500 text-center animate-fade-in">
                            Copied to clipboard!
                        </span>
                    )}
                </div>

                {/* Suggested Profiles */}
                <div className="mt-6">
                    <h3 className="text-sm font-semibold text-gray-400 mb-3">Suggested</h3>
                    <div className="flex flex-col gap-3">
                        {suggestedUsers.map((user) => {
                            const isFollowing = followStates[user.name] || false;
                            return (
                                <div key={user.name} className="flex items-center justify-between">
                                    <div
                                        className="flex items-center gap-3 cursor-pointer flex-1"
                                        onClick={() => handleUserClick(user.name)}
                                    >
                                        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-800 flex-shrink-0">
                                            {user.avatar && (
                                                <img
                                                    src={user.avatar}
                                                    alt={user.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            )}
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-sm font-semibold truncate">{user.name}</span>
                                            <span className="text-xs text-gray-400 truncate">Suggested for you</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleFollow(user.name)}
                                        className={`text-xs font-semibold transition-colors flex-shrink-0 ${isFollowing
                                                ? 'text-white'
                                                : 'text-blue-500 hover:text-blue-400'
                                            }`}
                                    >
                                        {isFollowing ? 'Following' : 'Follow'}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RightSidebar;

