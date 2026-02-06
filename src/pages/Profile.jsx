import { useParams } from 'react-router-dom';
import { getAssets, getUserBio } from '../utils/assetLoader';
import { Grid, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLikes } from '../context/LikesContext';

const API_URL = 'https://jinstagram-server.onrender.com/api';

const Profile = () => {
    const { username } = useParams();
    const { users } = getAssets();
    const userImages = users[username] || [];
    const { likesMap } = useLikes();

    // State for user data
    const [userData, setUserData] = useState({ followers: 0, following: 0 });
    const [isFollowing, setIsFollowing] = useState(false);

    // Fetch user data
    useEffect(() => {
        // Scroll to top when profile loads
        window.scrollTo(0, 0);

        fetch(`${API_URL}/user/${encodeURIComponent(username)}`)
            .then(res => res.json())
            .then(data => setUserData(data))
            .catch(err => console.error("Failed to fetch user data", err));
    }, [username]);

    const handleFollow = async () => {
        // Optimistic update
        const newFollowingState = !isFollowing;
        setIsFollowing(newFollowingState);
        setUserData(prev => ({
            ...prev,
            followers: prev.followers + (newFollowingState ? 1 : -1)
        }));

        try {
            await fetch(`${API_URL}/user/${encodeURIComponent(username)}/follow`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isFollowing: !newFollowingState }) // Send current state (before toggle) to backend logic? 
                // Ah, my backend logic was: isFollowing = true -> we want to unfollow (decrement).
                // So if we are currently "Following" (newFollowingState = true), we must have sent "I want to follow".
                // My backend param is "isFollowing" -> which means "If I AM following, then UNFOLLOW".
                // So if new state is true (Following), that means previous was false. I should send isFollowing: false (meaning "I am not following, please follow").
                // Let's check backend logic: "const change = isFollowing ? -1 : 1;"
                // If I send "true", change is -1 (Unfollow). Correct.
                // If I send "false", change is 1 (Follow). Correct.
                // So if I want to FOLLOW (new state true), I send false.
            });
        } catch (err) {
            console.error("Failed to update follow", err);
            // Revert
            setIsFollowing(!newFollowingState);
            setUserData(prev => ({
                ...prev,
                followers: prev.followers + (newFollowingState ? -1 : 1)
            }));
        }
    };

    return (
        <div className="w-full h-full pt-8 px-8 pb-20">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12 px-4 max-w-screen-2xl mx-auto">
                <div className="w-20 h-20 md:w-36 md:h-36 rounded-full overflow-hidden border-2 border-ig-separator bg-gray-800 flex-shrink-0">
                    {userImages[0] && <img src={userImages[0]} className="w-full h-full object-cover" />}
                </div>

                <div className="flex-1 flex flex-col gap-4 items-center md:items-start text-center md:text-left">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl md:text-2xl font-normal">{username}</h2>
                        <button
                            onClick={handleFollow}
                            className={`px-4 py-1.5 rounded-lg font-semibold text-sm transition-colors ${isFollowing
                                ? 'bg-ig-secondary text-white hover:opacity-90'
                                : 'bg-white text-black hover:opacity-90'
                                }`}
                        >
                            {isFollowing ? 'Following' : 'Follow'}
                        </button>
                        <button className="bg-ig-secondary text-white px-4 py-1.5 rounded-lg font-semibold text-sm hover:opacity-70">Message</button>
                    </div>

                    <div className="flex gap-8 text-base">
                        <div><span className="font-bold">{userImages.length}</span> posts</div>
                        <div><span className="font-bold">{userData.followers.toLocaleString()}</span> followers</div>
                        <div><span className="font-bold">{userData.following.toLocaleString()}</span> following</div>
                    </div>

                    <div className="text-sm">
                        <div className="font-bold">{username}</div>
                        <div>{getUserBio(username)}</div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-t border-ig-separator mb-4 flex justify-center gap-12 font-semibold text-xs tracking-widest text-gray-500">
                <div className="border-t border-white text-white py-4 flex items-center gap-2"><Grid size={12} /> POSTS</div>
                <div className="py-4 flex items-center gap-2"><Heart size={12} /> LIKED</div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-3 gap-1 md:gap-7">
                {userImages.map((img, idx) => (
                    <div key={idx} className="aspect-square bg-gray-900 group relative cursor-pointer overflow-hidden">
                        <img src={img} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white font-bold">
                            <div className="flex items-center gap-1"><Heart className="fill-white" size={20} /> {(likesMap[img] || 0).toLocaleString()}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Profile;
